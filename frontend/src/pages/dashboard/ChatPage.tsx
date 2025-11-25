import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  ArrowLeft,
  Send,
  MessageSquare,
  Briefcase,
  User,
  Clock,
  CheckCheck,
  Loader2,
  Sparkles
} from 'lucide-react'
import {
  getOrCreateConversa,
  enviarMensagem,
  marcarComoLidas,
  Conversa,
  Mensagem
} from '@/services/mensagens'

export default function ChatPage() {
  const { candidaturaId } = useParams<{ candidaturaId: string }>()
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [conversa, setConversa] = useState<Conversa | null>(null)
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [novaMensagem, setNovaMensagem] = useState('')
  const [loading, setLoading] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const tipoUsuario = (user as any)?.role === 'candidate' ? 'CANDIDATO' : 'EMPRESA'
  const userId = tipoUsuario === 'CANDIDATO' ? (user as any)?.candidatoId : (user as any)?.empresaId

  // Carregar conversa
  useEffect(() => {
    const fetchConversa = async () => {
      if (!candidaturaId) return

      try {
        const token = localStorage.getItem('auth_token')
        if (!token) {
          toast({
            title: 'Erro de autenticação',
            description: 'Por favor, faça login novamente.',
            variant: 'destructive'
          })
          return
        }

        const data = await getOrCreateConversa(token, parseInt(candidaturaId))
        setConversa(data)
        setMensagens(data.mensagens || [])

        // Marcar mensagens como lidas
        if (data.id) {
          await marcarComoLidas(token, data.id, tipoUsuario)
        }
      } catch (error) {
        console.error('Erro ao carregar conversa:', error)
        toast({
          title: 'Erro ao carregar conversa',
          description: 'Não foi possível carregar as mensagens.',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchConversa()
    
    // Polling para atualizar mensagens a cada 5 segundos
    const interval = setInterval(fetchConversa, 5000)
    return () => clearInterval(interval)
  }, [candidaturaId, toast, tipoUsuario])

  // Scroll para o final quando mensagens são atualizadas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensagens])

  const handleEnviarMensagem = async () => {
    if (!novaMensagem.trim() || !conversa || enviando) return

    setEnviando(true)
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) return

      const mensagem = await enviarMensagem(
        token,
        conversa.id,
        userId,
        tipoUsuario,
        novaMensagem.trim()
      )

      setMensagens(prev => [...prev, mensagem])
      setNovaMensagem('')
    } catch (error) {
      toast({
        title: 'Erro ao enviar',
        description: 'Não foi possível enviar a mensagem.',
        variant: 'destructive'
      })
    } finally {
      setEnviando(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleEnviarMensagem()
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-indigo-500/20 to-violet-500/20 blur-xl animate-pulse" />
            <div className="relative w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
          <p className="text-muted-foreground font-medium">Carregando conversa...</p>
        </div>
      </div>
    )
  }

  if (!conversa) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Card className="border-2 border-dashed max-w-md">
          <CardContent className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Conversa não encontrada</h3>
            <p className="text-muted-foreground mb-4">
              Não foi possível carregar esta conversa.
            </p>
            <Button onClick={() => navigate(-1)}>Voltar</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const outroUsuario = tipoUsuario === 'CANDIDATO' 
    ? conversa.candidatura.vaga.empresa 
    : conversa.candidatura.candidato

  const outroNome = tipoUsuario === 'CANDIDATO'
    ? conversa.candidatura.vaga.empresa.nome
    : conversa.candidatura.candidato.nome

  const outroAvatar = tipoUsuario === 'EMPRESA'
    ? (conversa.candidatura.candidato as any).avatarUrl
    : undefined

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] sm:h-[calc(100vh-10rem)] md:h-[calc(100vh-12rem)] max-h-[800px]">
      {/* Header */}
      <Card className="rounded-b-none border-b-0">
        <CardHeader className="p-3 sm:p-4 md:pb-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="shrink-0 h-8 w-8 sm:h-9 sm:w-9"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              
              <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-background shadow">
                <AvatarImage src={outroAvatar} />
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold text-sm sm:text-base">
                  {getInitials(outroNome)}
                </AvatarFallback>
              </Avatar>
              
              <div className="min-w-0">
                <CardTitle className="text-sm sm:text-base md:text-lg truncate">{outroNome}</CardTitle>
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                  <Briefcase className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                  <span className="truncate">{conversa.candidatura.vaga.titulo}</span>
                </div>
              </div>
            </div>
            
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px] sm:text-xs shrink-0">
              <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
              <span className="hidden xs:inline">Em Processo</span>
              <span className="xs:hidden">Ativo</span>
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Messages */}
      <Card className="flex-1 rounded-none border-y-0 overflow-hidden">
        <ScrollArea className="h-full p-4">
          {mensagens.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-950 dark:to-violet-950 flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Inicie a conversa!</h3>
              <p className="text-muted-foreground text-sm max-w-xs">
                {tipoUsuario === 'EMPRESA' 
                  ? 'Envie uma mensagem para o candidato e dê início ao processo seletivo.'
                  : 'A empresa demonstrou interesse em seu perfil. Envie uma mensagem!'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {mensagens.map((mensagem, index) => {
                const isMinhaMsg = mensagem.tipoRemetente === tipoUsuario
                const showDate = index === 0 || 
                  formatDate(mensagem.createdAt) !== formatDate(mensagens[index - 1].createdAt)

                return (
                  <div key={mensagem.id}>
                    {showDate && (
                      <div className="flex justify-center my-4">
                        <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                          {formatDate(mensagem.createdAt)}
                        </span>
                      </div>
                    )}
                    
                    <div className={`flex ${isMinhaMsg ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] sm:max-w-[75%] ${isMinhaMsg ? 'order-2' : 'order-1'}`}>
                        <div
                          className={`rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 ${
                            isMinhaMsg
                              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-br-md'
                              : 'bg-muted rounded-bl-md'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {mensagem.conteudo}
                          </p>
                        </div>
                        <div className={`flex items-center gap-1 mt-1 ${isMinhaMsg ? 'justify-end' : 'justify-start'}`}>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(mensagem.createdAt)}
                          </span>
                          {isMinhaMsg && mensagem.lida && (
                            <CheckCheck className="h-3.5 w-3.5 text-indigo-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>
      </Card>

      {/* Input */}
      <Card className="rounded-t-none border-t-0">
        <CardContent className="p-2 sm:p-3 md:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Input
              placeholder="Digite sua mensagem..."
              value={novaMensagem}
              onChange={(e) => setNovaMensagem(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={enviando}
              className="flex-1 h-10 sm:h-11 rounded-lg sm:rounded-xl border-2 focus-visible:ring-indigo-500 text-sm"
            />
            <Button
              onClick={handleEnviarMensagem}
              disabled={!novaMensagem.trim() || enviando}
              size="icon"
              className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg sm:rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
            >
              {enviando ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
