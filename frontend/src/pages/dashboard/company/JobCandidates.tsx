import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  GraduationCap,
  Briefcase,
  Calendar,
  Star,
  Link as LinkIcon,
  FileText,
  Sparkles,
  Users,
  Award,
  Download,
} from 'lucide-react'
import { listarCandidaturasVaga } from '@/services/vagas'

interface Candidatura {
  id: string
  createdAt: string
  status: string
  vaga: {
    id: number
    titulo: string
    subtiposAceitos: Array<{
      subtipo: {
        id: number
        nome: string
        tipo: {
          id: number
          nome: string
        }
      }
    }>
    acessibilidades: Array<{
      acessibilidade: {
        id: number
        descricao: string
      }
      disponivel: boolean
      qualidade: string
    }>
  }
  candidato: {
    id: string
    nome: string
    cpf?: string
    telefone?: string
    email?: string
    escolaridade: string
    avatarUrl?: string
    curriculoUrl?: string
    linkedin?: string
    portfolio?: string
    dataNascimento?: string
    cidade?: string
    estado?: string
    biografia?: string
    profileData?: any
    user?: {
      email: string
    }
    subtipos?: Array<{
      candidatoId: number
      subtipoId: number
      prioridade?: string
      subtipo: {
        id: number
        nome: string
        tipo: {
          id: number
          nome: string
        }
      }
      barreiras?: Array<{
        barreiraId: number
        barreira: {
          id: number
          descricao: string
        }
      }>
    }>
    acessibilidades?: Array<{
      acessibilidadeId: number
      prioridade: string
      acessibilidade: {
        id: number
        descricao: string
      }
    }>
    recursosAssistivos?: Array<{
      recursoId: number
      usoFrequencia?: string
      recurso: {
        id: number
        nome: string
        mitigacoes?: Array<{
          barreiraId: number
          eficiencia?: string
        }>
      }
    }>
  }
  matchScore?: {
    score: number
    scoreAcessibilidades: number
    scoreSubtipos: number
    acessibilidadesAtendidas: number
    acessibilidadesTotal: number
    detalhes?: {
      atendidas: Array<{ id: number; descricao: string }>
      naoAtendidas: Array<{ id: number; descricao: string; prioridade: string }>
      extras: Array<{ id: number; descricao: string }>
    }
  }
}

export const JobCandidates = () => {
  const { jobId } = useParams<{ jobId: string }>()
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [candidaturas, setCandidaturas] = useState<Candidatura[]>([])
  const [loading, setLoading] = useState(true)

  // Função para calcular o match score
  const calcularMatchScore = (candidatura: Candidatura) => {
    const { candidato, vaga } = candidatura

    // 1. Score de Subtipos
    const candidatoSubtipos = new Set(candidato.subtipos?.map(s => s.subtipoId) || [])
    const vagaSubtipos = new Set(vaga.subtiposAceitos.map(s => s.subtipo.id) || [])
    
    const subtiposCompativeis = Array.from(candidatoSubtipos).filter(id => vagaSubtipos.has(id))
    const scoreSubtipos = candidatoSubtipos.size > 0 
      ? Math.round((subtiposCompativeis.length / candidatoSubtipos.size) * 100) 
      : 100

    // 2. Mapear mitigações por recursos assistivos
    const mitigacoesBarreiras = new Map<number, string>()
    candidato.recursosAssistivos?.forEach(cr => {
      cr.recurso.mitigacoes?.forEach(m => {
        const atual = mitigacoesBarreiras.get(m.barreiraId)
        const nova = m.eficiencia || 'baixa'
        const rank = (e: string) => e === 'alta' ? 3 : e === 'media' ? 2 : 1
        if (!atual || rank(nova) > rank(atual)) {
          mitigacoesBarreiras.set(m.barreiraId, nova)
        }
      })
    })

    // 3. Necessidades derivadas das barreiras (ajustadas por recursos)
    const necessidadesMap = new Map<number, { id: number; descricao: string; prioridade: string }>()
    
    candidato.subtipos?.forEach(cs => {
      cs.barreiras?.forEach(csb => {
        const eficiencia = mitigacoesBarreiras.get(csb.barreiraId)
        
        // Se eficiência é alta, a barreira está totalmente mitigada
        if (eficiencia === 'alta') return
        
        // Ajustar prioridade baseado na mitigação
        const prioridade = eficiencia === 'media' ? 'desejavel' : 'importante'
        
        // Adicionar necessidade (simplificado: não temos a relação barreira->acessibilidade aqui)
        // Por enquanto, vamos considerar as acessibilidades diretas do candidato
      })
    })

    // Usar acessibilidades diretas do candidato
    candidato.acessibilidades?.forEach(ca => {
      if (!necessidadesMap.has(ca.acessibilidadeId)) {
        necessidadesMap.set(ca.acessibilidadeId, {
          id: ca.acessibilidadeId,
          descricao: ca.acessibilidade.descricao,
          prioridade: ca.prioridade
        })
      }
    })

    const necessidades = Array.from(necessidadesMap.values())

    // 4. Acessibilidades oferecidas pela vaga
    const oferecidas = new Map(
      vaga.acessibilidades
        .filter(va => va.disponivel)
        .map(va => [va.acessibilidade.id, va.acessibilidade])
    )

    // 5. Calcular atendimento
    const atendidas = necessidades.filter(n => oferecidas.has(n.id))
    const naoAtendidas = necessidades.filter(n => !oferecidas.has(n.id))
    const extras = vaga.acessibilidades
      .filter(va => va.disponivel && !necessidades.some(n => n.id === va.acessibilidade.id))
      .map(va => va.acessibilidade)

    // 6. Score ponderado por prioridade
    let pontos = 0
    let maxPontos = 0
    necessidades.forEach(n => {
      const peso = n.prioridade === 'essencial' ? 3 : n.prioridade === 'importante' ? 2 : 1
      maxPontos += peso
      if (oferecidas.has(n.id)) pontos += peso
    })

    const scoreAcessibilidades = maxPontos > 0 
      ? Math.round((pontos / maxPontos) * 100) 
      : 100

    // 7. Score total (média ponderada: 30% subtipos + 70% acessibilidades)
    const scoreTotal = Math.round((scoreSubtipos * 0.3) + (scoreAcessibilidades * 0.7))

    return {
      score: scoreTotal,
      scoreAcessibilidades,
      scoreSubtipos,
      acessibilidadesAtendidas: atendidas.length,
      acessibilidadesTotal: necessidades.length,
      detalhes: {
        atendidas,
        naoAtendidas,
        extras
      }
    }
  }

  useEffect(() => {
    const fetchCandidaturas = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        if (!token || !jobId) return

        const data = await listarCandidaturasVaga(token, parseInt(jobId))
        
        // Calcular match score para cada candidatura
        const candidaturasComMatch = data.map((candidatura: Candidatura) => ({
          ...candidatura,
          matchScore: calcularMatchScore(candidatura)
        }))
        
        setCandidaturas(candidaturasComMatch)
      } catch (error: any) {
        toast({
          title: 'Erro ao carregar candidaturas',
          description: error.message,
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCandidaturas()
  }, [jobId, toast])

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'APROVADA':
        return 'default'
      case 'REJEITADA':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando candidaturas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header com gradiente */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 -mx-8 -mt-8 px-8 py-8 mb-8 relative overflow-hidden rounded-b-3xl">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,white)]"></div>
        <div className="relative z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-2 text-white hover:bg-white/20 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-white/20 rounded-2xl backdrop-blur-md flex items-center justify-center shadow-2xl">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Candidatos da Vaga</h1>
              <p className="text-blue-100 text-lg mt-1">
                {candidaturas.length} candidatura{candidaturas.length !== 1 ? 's' : ''} recebida{candidaturas.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      {candidaturas.length === 0 ? (
        <Card className="border-2 shadow-lg">
          <CardContent className="text-center py-16">
            <div className="h-20 w-20 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Nenhuma candidatura</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Esta vaga ainda não recebeu candidaturas. Continue divulgando para atrair talentos qualificados.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {candidaturas
            .sort((a, b) => {
              const scoreA = a.matchScore?.score || 0
              const scoreB = b.matchScore?.score || 0
              if (scoreA !== scoreB) return scoreB - scoreA
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            })
            .map((candidatura) => (
            <Card key={candidatura.id} className="overflow-hidden border-2 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/30 pb-6">
                <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
                      <AvatarImage src={candidatura.candidato.avatarUrl || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl font-bold">
                        {getInitials(candidatura.candidato.nome)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-2xl mb-2">
                        {candidatura.candidato.nome}
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          Candidatura em {formatDate(candidatura.createdAt)}
                        </div>
                        <Badge variant={getStatusBadgeVariant(candidatura.status)} className="text-xs font-medium">
                          {candidatura.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {candidatura.matchScore && (
                    <Card className="border-2 shadow-md bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20">
                      <CardContent className="pt-5 pb-5 px-6">
                        <div className="flex items-center gap-2.5 mb-1.5">
                          <Sparkles className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                          <span className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">
                            {candidatura.matchScore.score}%
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Match Score
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6 pt-6">
                {/* Informações de Contato */}
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">
                    Informações de Contato
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground mb-0.5">E-mail</p>
                        <p className="font-medium truncate">{candidatura.candidato.email || 'Não informado'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Telefone</p>
                        <p className="font-medium">{candidatura.candidato.telefone || 'Não informado'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground mb-0.5">Localização</p>
                        <p className="font-medium truncate">{candidatura.candidato.profileData?.endereco || 'Não informado'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Escolaridade</p>
                        <p className="font-medium">{candidatura.candidato.escolaridade}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Deficiências */}
                {candidatura.candidato.subtipos && candidatura.candidato.subtipos.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                      Deficiências e Necessidades
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {candidatura.candidato.subtipos.map((item, index) => (
                        <Badge key={index} variant="outline" className="py-1.5 px-3 text-sm">
                          <User className="mr-1.5 h-3.5 w-3.5" />
                          {item.subtipo.nome} ({item.subtipo.tipo.nome})
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Match Score Detalhado */}
                {candidatura.matchScore && (
                  <Card className="border-2 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        Análise de Compatibilidade
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-background/80">
                          <p className="text-xs text-muted-foreground mb-1">Acessibilidade</p>
                          <p className="text-2xl font-bold text-primary">
                            {candidatura.matchScore.scoreAcessibilidades}%
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-background/80">
                          <p className="text-xs text-muted-foreground mb-1">Deficiências</p>
                          <p className="text-2xl font-bold text-primary">
                            {candidatura.matchScore.scoreSubtipos}%
                          </p>
                        </div>
                      </div>
                      
                      {/* Detalhes das Acessibilidades */}
                      {candidatura.matchScore.detalhes && (
                        <div className="space-y-3 pt-2">
                          {/* Atendidas */}
                          {candidatura.matchScore.detalhes.atendidas.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2 flex items-center gap-1.5">
                                <div className="h-2 w-2 bg-green-600 dark:bg-green-400 rounded-full"></div>
                                Acessibilidades Atendidas ({candidatura.matchScore.detalhes.atendidas.length})
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {candidatura.matchScore.detalhes.atendidas.map(acc => (
                                  <Badge key={acc.id} variant="outline" className="text-xs bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300">
                                    {acc.descricao}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Não Atendidas */}
                          {candidatura.matchScore.detalhes.naoAtendidas.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                                <div className="h-2 w-2 bg-amber-600 dark:bg-amber-400 rounded-full"></div>
                                Necessidades Não Atendidas ({candidatura.matchScore.detalhes.naoAtendidas.length})
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {candidatura.matchScore.detalhes.naoAtendidas.map(acc => (
                                  <Badge key={acc.id} variant="outline" className="text-xs bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300">
                                    {acc.descricao}
                                    {acc.prioridade === 'essencial' && ' 🔴'}
                                    {acc.prioridade === 'importante' && ' 🟡'}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Extras */}
                          {candidatura.matchScore.detalhes.extras.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-1.5">
                                <div className="h-2 w-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                                Acessibilidades Extras Oferecidas ({candidatura.matchScore.detalhes.extras.length})
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {candidatura.matchScore.detalhes.extras.map(acc => (
                                  <Badge key={acc.id} variant="outline" className="text-xs bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300">
                                    {acc.descricao}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Ações */}
                <Separator />
                <div className="flex flex-wrap gap-3">
                  {candidatura.candidato.curriculoUrl && (
                    <Button variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      Baixar Currículo
                    </Button>
                  )}
                  {candidatura.candidato.linkedin && (
                    <Button variant="outline" className="gap-2" asChild>
                      <a href={candidatura.candidato.linkedin} target="_blank" rel="noopener noreferrer">
                        <LinkIcon className="h-4 w-4" />
                        LinkedIn
                      </a>
                    </Button>
                  )}
                  {candidatura.candidato.portfolio && (
                    <Button variant="outline" className="gap-2" asChild>
                      <a href={candidatura.candidato.portfolio} target="_blank" rel="noopener noreferrer">
                        <Briefcase className="h-4 w-4" />
                        Portfólio
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
