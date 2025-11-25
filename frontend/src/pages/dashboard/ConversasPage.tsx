import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  MessageSquare,
  Briefcase,
  Clock,
  ChevronRight,
  Sparkles,
  Users,
  Inbox
} from 'lucide-react'
import {
  listarConversasCandidato,
  listarConversasEmpresa,
  Conversa
} from '@/services/mensagens'

export default function ConversasPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [conversas, setConversas] = useState<Conversa[]>([])
  const [loading, setLoading] = useState(true)

  const tipoUsuario = (user as any)?.role === 'candidate' ? 'CANDIDATO' : 'EMPRESA'
  const userId = tipoUsuario === 'CANDIDATO' ? (user as any)?.candidatoId : (user as any)?.empresaId
  const basePath = tipoUsuario === 'CANDIDATO' ? '/dashboard/candidato' : '/dashboard/empresa'

  useEffect(() => {
    const fetchConversas = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        if (!token || !userId) return

        const data = tipoUsuario === 'CANDIDATO'
          ? await listarConversasCandidato(token, userId)
          : await listarConversasEmpresa(token, userId)

        setConversas(data)
      } catch (error) {
        console.error('Erro ao carregar conversas:', error)
        toast({
          title: 'Erro ao carregar',
          description: 'Não foi possível carregar as conversas.',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchConversas()
  }, [userId, tipoUsuario, toast])

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    } else if (diffDays === 1) {
      return 'Ontem'
    } else if (diffDays < 7) {
      return date.toLocaleDateString('pt-BR', { weekday: 'short' })
    } else {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-indigo-500/20 to-violet-500/20 blur-xl animate-pulse" />
            <div className="relative w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
          <p className="text-muted-foreground font-medium">Carregando conversas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-border/30 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-700" />
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-10 top-1/2 h-48 w-48 rounded-full bg-cyan-500/20 blur-2xl" />
        
        <div className="relative px-4 py-5 sm:px-6 sm:py-6 md:px-8 md:py-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="h-11 w-11 sm:h-14 sm:w-14 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <MessageSquare className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">
                Minhas Conversas
              </h1>
              <p className="text-white/70 mt-0.5 sm:mt-1 text-xs sm:text-sm md:text-base">
                {conversas.length} conversa{conversas.length !== 1 ? 's' : ''} ativa{conversas.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Conversas */}
      {conversas.length === 0 ? (
        <Card className="border-2 border-dashed border-indigo-500/30 bg-gradient-to-br from-indigo-500/5 to-violet-500/5">
          <CardContent className="text-center py-16">
            <div className="relative mx-auto w-fit mb-6">
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-indigo-500/20 to-violet-500/20 blur-xl" />
              <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-950 dark:to-violet-950 flex items-center justify-center">
                <Inbox className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">Nenhuma conversa ainda</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              {tipoUsuario === 'CANDIDATO'
                ? 'Quando uma empresa aceitar sua candidatura, você poderá iniciar uma conversa aqui.'
                : 'Aceite candidaturas para iniciar conversas com os candidatos.'}
            </p>
            <Button 
              onClick={() => navigate(basePath)}
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600"
            >
              {tipoUsuario === 'CANDIDATO' ? 'Ver Vagas' : 'Ver Candidaturas'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden shadow-lg">
          <ScrollArea className="max-h-[600px]">
            <div className="divide-y">
              {conversas.map((conversa) => {
                const outroNome = tipoUsuario === 'CANDIDATO'
                  ? conversa.candidatura.vaga.empresa.nome
                  : conversa.candidatura.candidato.nome

                const outroAvatar = tipoUsuario === 'EMPRESA'
                  ? conversa.candidatura.candidato.avatarUrl
                  : undefined

                const ultimaMensagem = conversa.mensagens?.[0]
                const naoLidas = conversa.naoLidas || 0

                return (
                  <div
                    key={conversa.id}
                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-muted/50 cursor-pointer transition-colors active:bg-muted"
                    onClick={() => navigate(`${basePath}/chat/${conversa.candidaturaId}`)}
                  >
                    <div className="relative shrink-0">
                      <Avatar className="h-12 w-12 sm:h-14 sm:w-14 border-2 border-background shadow">
                        <AvatarImage src={outroAvatar} />
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold text-sm sm:text-base">
                          {getInitials(outroNome)}
                        </AvatarFallback>
                      </Avatar>
                      {naoLidas > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                          {naoLidas > 9 ? '9+' : naoLidas}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5 sm:mb-1 gap-2">
                        <h3 className={`font-semibold truncate text-sm sm:text-base ${naoLidas > 0 ? 'text-foreground' : ''}`}>
                          {outroNome}
                        </h3>
                        {ultimaMensagem && (
                          <span className="text-[10px] sm:text-xs text-muted-foreground shrink-0">
                            {formatTime(ultimaMensagem.createdAt)}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">
                        <Briefcase className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                        <span className="truncate">{conversa.candidatura.vaga.titulo}</span>
                      </div>
                      
                      {ultimaMensagem && (
                        <p className={`text-xs sm:text-sm truncate ${naoLidas > 0 ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                          {ultimaMensagem.tipoRemetente === tipoUsuario ? 'Você: ' : ''}
                          {ultimaMensagem.conteudo}
                        </p>
                      )}
                    </div>

                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground shrink-0" />
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </Card>
      )}
    </div>
  )
}
