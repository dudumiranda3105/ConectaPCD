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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  ArrowLeft,
  Send,
  MessageSquare,
  Briefcase,
  CheckCheck,
  Loader2,
  Sparkles,
  PartyPopper,
  UserCheck,
  Award,
  Building2,
  MapPin,
  Calendar,
  XCircle,
  UserX
} from 'lucide-react'
import {
  getOrCreateConversa,
  enviarMensagem,
  marcarComoLidas,
  Conversa,
  Mensagem
} from '@/services/mensagens'
import { atualizarStatusCandidatura, fecharVaga } from '@/services/vagas'

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
  const [aprovando, setAprovando] = useState(false)
  const [rejeitando, setRejeitando] = useState(false)
  const [aprovado, setAprovado] = useState(false)
  const [rejeitado, setRejeitado] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
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
        
        // Verificar se já foi aprovado ou rejeitado
        if (data.candidatura?.status === 'APROVADA') {
          setAprovado(true)
        } else if (data.candidatura?.status === 'Rejeitada') {
          setRejeitado(true)
        }

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

  const handleAprovarContratacao = async () => {
    if (!conversa || aprovando) return

    setAprovando(true)
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) return

      await atualizarStatusCandidatura(token, conversa.candidatura.id.toString(), 'APROVADA')
      
      // Fechar a vaga automaticamente após aprovação
      try {
        await fecharVaga(token, conversa.candidatura.vaga.id)
        console.log('[ChatPage] Vaga fechada automaticamente após contratação')
      } catch (err) {
        console.warn('[ChatPage] Erro ao fechar vaga (não crítico):', err)
      }
      
      setAprovado(true)
      setShowConfetti(true)
      
      toast({
        title: '🎉 Contratação Aprovada!',
        description: `Parabéns! ${conversa.candidatura.candidato.nome} foi contratado(a) com sucesso! A vaga foi fechada automaticamente.`,
        className: 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 text-emerald-800'
      })

      // Enviar mensagem automática
      await enviarMensagem(
        token,
        conversa.id,
        userId,
        tipoUsuario,
        `🎉 Parabéns! Sua contratação para a vaga de "${conversa.candidatura.vaga.titulo}" foi aprovada! Seja bem-vindo(a) à equipe!`
      )

      // Recarregar mensagens
      const data = await getOrCreateConversa(token, parseInt(candidaturaId!))
      setMensagens(data.mensagens || [])

      // Esconder confetti após alguns segundos
      setTimeout(() => setShowConfetti(false), 5000)
    } catch (error) {
      toast({
        title: 'Erro ao aprovar',
        description: 'Não foi possível aprovar a contratação.',
        variant: 'destructive'
      })
    } finally {
      setAprovando(false)
    }
  }

  const handleRejeitarContratacao = async () => {
    if (!conversa || rejeitando) return

    setRejeitando(true)
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) return

      await atualizarStatusCandidatura(token, conversa.candidatura.id.toString(), 'Rejeitada')
      
      setRejeitado(true)
      
      toast({
        title: 'Candidatura Rejeitada',
        description: `A candidatura de ${conversa.candidatura.candidato.nome} foi rejeitada.`,
        variant: 'destructive'
      })

      // Enviar mensagem automática
      await enviarMensagem(
        token,
        conversa.id,
        userId,
        tipoUsuario,
        `Infelizmente, após análise do seu perfil, decidimos não prosseguir com sua candidatura para a vaga de "${conversa.candidatura.vaga.titulo}". Agradecemos seu interesse e desejamos sucesso em sua busca.`
      )

      // Recarregar mensagens
      const data = await getOrCreateConversa(token, parseInt(candidaturaId!))
      setMensagens(data.mensagens || [])
    } catch (error) {
      toast({
        title: 'Erro ao rejeitar',
        description: 'Não foi possível rejeitar a candidatura.',
        variant: 'destructive'
      })
    } finally {
      setRejeitando(false)
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

  const statusCandidatura = conversa.candidatura?.status || 'EM_PROCESSO'
  const isAprovada = statusCandidatura === 'APROVADA' || aprovado
  const isRejeitada = statusCandidatura === 'Rejeitada' || rejeitado
  const isFinalizado = isAprovada || isRejeitada

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] sm:h-[calc(100vh-10rem)] md:h-[calc(100vh-12rem)] max-h-[850px] relative">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(60)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10px`,
                animation: `confetti-fall ${3 + Math.random() * 2}s ease-out forwards`,
                animationDelay: `${Math.random() * 1}s`
              }}
            >
              <div 
                className="w-3 h-3"
                style={{
                  backgroundColor: ['#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#3b82f6', '#14b8a6'][Math.floor(Math.random() * 6)],
                  borderRadius: Math.random() > 0.5 ? '50%' : '0',
                  transform: `rotate(${Math.random() * 360}deg)`
                }}
              />
            </div>
          ))}
          <style>{`
            @keyframes confetti-fall {
              0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
              }
              100% {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
              }
            }
          `}</style>
        </div>
      )}
      {/* Header */}
      <Card className={`rounded-b-none border-b-0 ${isAprovada ? 'bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30' : isRejeitada ? 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30' : ''}`}>
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
              
              <div className="relative">
                <Avatar className={`h-10 w-10 sm:h-12 sm:w-12 border-2 border-background shadow-lg ring-2 ${isAprovada ? 'ring-emerald-500/20' : isRejeitada ? 'ring-red-500/20' : 'ring-indigo-500/20'}`}>
                  <AvatarImage src={outroAvatar} />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold text-sm sm:text-base">
                    {getInitials(outroNome)}
                  </AvatarFallback>
                </Avatar>
                {isAprovada && (
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1">
                    <UserCheck className="h-3 w-3 text-white" />
                  </div>
                )}
                {isRejeitada && (
                  <div className="absolute -bottom-1 -right-1 bg-red-500 rounded-full p-1">
                    <XCircle className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
              
              <div className="min-w-0">
                <CardTitle className="text-sm sm:text-base md:text-lg truncate flex items-center gap-2">
                  {outroNome}
                  {isAprovada && (
                    <Award className="h-4 w-4 text-emerald-500" />
                  )}
                </CardTitle>
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                  <Briefcase className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                  <span className="truncate">{conversa.candidatura.vaga.titulo}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {isAprovada ? (
                <div className="flex items-center gap-2">
                  <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0 text-[10px] sm:text-xs shrink-0 shadow-lg shadow-emerald-500/20">
                    <UserCheck className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                    <span className="hidden xs:inline">Contratação Feita</span>
                    <span className="xs:hidden">✓</span>
                  </Badge>
                </div>
              ) : isRejeitada ? (
                <Badge className="bg-gradient-to-r from-red-500 to-rose-500 text-white border-0 text-[10px] sm:text-xs shrink-0 shadow-lg shadow-red-500/20">
                  <XCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                  <span className="hidden xs:inline">Não Aprovado</span>
                  <span className="xs:hidden">✗</span>
                </Badge>
              ) : (
                <>
                  <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 text-[10px] sm:text-xs shrink-0 hidden sm:flex">
                    <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                    Em Processo
                  </Badge>
                  
                  {tipoUsuario === 'EMPRESA' && (
                    <div className="flex items-center gap-1 sm:gap-2">
                      {/* Botão Rejeitar */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1 sm:gap-1.5 rounded-lg sm:rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 text-xs sm:text-sm h-8 sm:h-9"
                            disabled={rejeitando}
                          >
                            {rejeitando ? (
                              <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                            ) : (
                              <UserX className="h-3 w-3 sm:h-4 sm:w-4" />
                            )}
                            <span className="hidden sm:inline">Rejeitar</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-md">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                              <div className="p-2 rounded-full bg-red-100">
                                <UserX className="h-5 w-5 text-red-600" />
                              </div>
                              Rejeitar Candidatura
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-left">
                              Você está prestes a rejeitar a candidatura de <strong>{conversa.candidatura.candidato.nome}</strong> para a vaga de <strong>{conversa.candidatura.vaga.titulo}</strong>.
                              <br /><br />
                              Esta ação enviará uma notificação ao candidato informando que não foi selecionado.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleRejeitarContratacao}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              <UserX className="h-4 w-4 mr-2" />
                              Confirmar Rejeição
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      {/* Botão Aprovar */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            className="gap-1 sm:gap-1.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-lg shadow-emerald-500/20 text-xs sm:text-sm h-8 sm:h-9"
                            disabled={aprovando}
                          >
                            {aprovando ? (
                              <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                            ) : (
                              <UserCheck className="h-3 w-3 sm:h-4 sm:w-4" />
                            )}
                            <span className="hidden sm:inline">Aprovar</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-md">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                              <div className="p-2 rounded-full bg-emerald-100">
                                <PartyPopper className="h-5 w-5 text-emerald-600" />
                              </div>
                              Aprovar Contratação
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-left">
                              Você está prestes a aprovar a contratação de <strong>{conversa.candidatura.candidato.nome}</strong> para a vaga de <strong>{conversa.candidatura.vaga.titulo}</strong>.
                              <br /><br />
                              Esta ação enviará uma notificação ao candidato e marcará o processo como concluído.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleAprovarContratacao}
                              className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                            >
                              <UserCheck className="h-4 w-4 mr-2" />
                              Confirmar Contratação
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Banner de Status para candidato */}
      {isAprovada && tipoUsuario === 'CANDIDATO' && (
        <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white py-3 px-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <PartyPopper className="h-5 w-5" />
            <span className="font-semibold">Parabéns! Você foi contratado para esta vaga!</span>
            <PartyPopper className="h-5 w-5" />
          </div>
        </div>
      )}
      
      {isRejeitada && tipoUsuario === 'CANDIDATO' && (
        <div className="bg-gradient-to-r from-red-500 to-rose-500 text-white py-3 px-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <XCircle className="h-5 w-5" />
            <span className="font-semibold">Infelizmente sua candidatura não foi aprovada para esta vaga.</span>
          </div>
        </div>
      )}

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

      {/* Input - Bloqueado quando finalizado */}
      <Card className={`rounded-t-none border-t-0 ${isFinalizado ? 'bg-muted/50' : ''}`}>
        <CardContent className="p-2 sm:p-3 md:p-4">
          {isFinalizado ? (
            <div className={`flex items-center justify-center gap-2 py-2 px-4 rounded-xl ${
              isAprovada 
                ? 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400' 
                : 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400'
            }`}>
              {isAprovada ? (
                <>
                  <CheckCheck className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Processo finalizado - Candidato contratado
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Processo finalizado - Candidatura não aprovada
                  </span>
                </>
              )}
            </div>
          ) : (
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}
