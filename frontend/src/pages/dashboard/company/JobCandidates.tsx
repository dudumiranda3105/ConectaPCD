import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Eye,
  Filter,
  ExternalLink,
  MessageSquare,
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
      acessibilidadeId: number
      vagaId: number
      acessibilidade: {
        id: number
        descricao: string
      }
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
    try {
      const { candidato, vaga } = candidatura

      // Verificações de segurança
      if (!candidato || !vaga) {
        console.warn('[calcularMatchScore] Candidatura sem candidato ou vaga:', candidatura)
        return {
          score: 0,
          scoreAcessibilidades: 0,
          scoreSubtipos: 0,
          acessibilidadesAtendidas: 0,
          acessibilidadesTotal: 0,
          detalhes: { atendidas: [], naoAtendidas: [], extras: [] }
        }
      }

      console.log('[calcularMatchScore] ====== INÍCIO DO CÁLCULO ======')
      console.log('[calcularMatchScore] Candidato:', candidato.nome)

      // 1. Score de Subtipos - Verificar se candidato tem deficiência aceita pela vaga
      const candidatoSubtiposIds = candidato.subtipos?.map(s => s.subtipoId || s.subtipo?.id).filter(Boolean) || []
      const candidatoSubtipos = new Set(candidatoSubtiposIds)
      
      const vagaSubtiposIds = (vaga.subtiposAceitos || []).map(s => s.subtipo?.id).filter(Boolean)
      const vagaSubtipos = new Set(vagaSubtiposIds)

      console.log('[calcularMatchScore] Subtipos do candidato:', Array.from(candidatoSubtipos))
      console.log('[calcularMatchScore] Subtipos aceitos pela vaga:', Array.from(vagaSubtipos))

      let scoreSubtipos = 100 // Default: compatível

      if (vagaSubtipos.size > 0 && candidatoSubtipos.size > 0) {
        // Vaga tem restrições E candidato tem subtipos
        const subtiposCompativeis = Array.from(candidatoSubtipos).filter(id => vagaSubtipos.has(id))
        scoreSubtipos = subtiposCompativeis.length > 0 
          ? Math.round((subtiposCompativeis.length / candidatoSubtipos.size) * 100)
          : 0
      }
      // Se vaga não tem restrições OU candidato não tem subtipos, score = 100

      // 2. Acessibilidades oferecidas pela vaga
      const vagaAcessibilidades = vaga.acessibilidades || []
      const oferecidas = new Map<number, { id: number; descricao: string }>()
      
      vagaAcessibilidades.forEach(va => {
        if (va.acessibilidade) {
          oferecidas.set(va.acessibilidade.id, va.acessibilidade)
        }
      })

      const ofertasVaga = Array.from(oferecidas.values())
      console.log('[calcularMatchScore] Acessibilidades oferecidas pela vaga:', ofertasVaga.length)

      // 3. Necessidades do candidato
      const candidatoAcessibilidades = candidato.acessibilidades || []
      const necessidadesMap = new Map<number, { id: number; descricao: string; prioridade: string }>()

      candidatoAcessibilidades.forEach(ca => {
        const acessId = ca.acessibilidadeId || ca.acessibilidade?.id
        if (acessId && ca.acessibilidade) {
          necessidadesMap.set(acessId, {
            id: acessId,
            descricao: ca.acessibilidade.descricao || 'Acessibilidade',
            prioridade: ca.prioridade || 'importante'
          })
        }
      })

      const necessidades = Array.from(necessidadesMap.values())
      console.log('[calcularMatchScore] Necessidades do candidato:', necessidades.length)

      // 4. Calcular atendimento
      const atendidas = necessidades.filter(n => oferecidas.has(n.id))
      const naoAtendidas = necessidades.filter(n => !oferecidas.has(n.id))
      const extras = ofertasVaga.filter(o => !necessidades.some(n => n.id === o.id))

      // 5. Score de acessibilidades
      let scoreAcessibilidades = 100

      if (necessidades.length > 0) {
        // Candidato tem necessidades específicas - calcular match
        let pontos = 0
        let maxPontos = 0
        necessidades.forEach(n => {
          const peso = n.prioridade === 'essencial' ? 3 : n.prioridade === 'importante' ? 2 : 1
          maxPontos += peso
          if (oferecidas.has(n.id)) pontos += peso
        })
        scoreAcessibilidades = maxPontos > 0 ? Math.round((pontos / maxPontos) * 100) : 100
      } else {
        // Candidato NÃO tem necessidades específicas cadastradas
        // Dar score baseado na quantidade de acessibilidades que a vaga oferece
        // Quanto mais acessibilidades a vaga oferece, melhor para qualquer PCD
        if (oferecidas.size >= 5) {
          scoreAcessibilidades = 100 // Vaga muito acessível
        } else if (oferecidas.size >= 3) {
          scoreAcessibilidades = 85 // Vaga moderadamente acessível
        } else if (oferecidas.size >= 1) {
          scoreAcessibilidades = 70 // Vaga com alguma acessibilidade
        } else {
          scoreAcessibilidades = 50 // Vaga sem acessibilidades definidas
        }
      }

      // 6. Score total (média ponderada: 30% subtipos + 70% acessibilidades)
      const scoreTotal = Math.round((scoreSubtipos * 0.3) + (scoreAcessibilidades * 0.7))

      console.log('[calcularMatchScore] ====== RESULTADO ======')
      console.log('[calcularMatchScore] Score Subtipos:', scoreSubtipos)
      console.log('[calcularMatchScore] Score Acessibilidades:', scoreAcessibilidades)
      console.log('[calcularMatchScore] Score Total:', scoreTotal)

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
    } catch (error) {
      console.error('[calcularMatchScore] Erro ao calcular match score:', error)
      return {
        score: 0,
        scoreAcessibilidades: 0,
        scoreSubtipos: 0,
        acessibilidadesAtendidas: 0,
        acessibilidadesTotal: 0,
        detalhes: { atendidas: [], naoAtendidas: [], extras: [] }
      }
    }
  }

  useEffect(() => {
    const fetchCandidaturas = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        if (!token || !jobId) {
          console.log('[JobCandidates] Token ou jobId ausente', { token: !!token, jobId })
          return
        }

        console.log('[JobCandidates] Buscando candidaturas para vaga:', jobId)
        const data = await listarCandidaturasVaga(token, parseInt(jobId))
        console.log('[JobCandidates] Candidaturas recebidas (raw):', JSON.stringify(data, null, 2))

        // Usar match score do banco de dados quando disponível, senão calcular localmente
        const candidaturasComMatch = data.map((candidatura: any) => {
          console.log('[JobCandidates] Processando candidatura:', candidatura.id)
          
          // Verificar se tem matchScoreDB do backend
          if (candidatura.matchScoreDB) {
            console.log('[JobCandidates] Usando matchScore do banco de dados:', candidatura.matchScoreDB)
            
            // Converter detalhes do formato do banco para o formato esperado pelo componente
            const detalhesDB = candidatura.matchScoreDB.detalhes || {}
            const detalhesConvertidos = {
              atendidas: [] as Array<{ id: number; descricao: string }>,
              naoAtendidas: [] as Array<{ id: number; descricao: string; prioridade: string }>,
              extras: [] as Array<{ id: number; descricao: string }>
            }
            
            // Se o detalhes tem o formato do banco (barreirasPorSubtipo), extrair informações
            if (detalhesDB.barreirasPorSubtipo) {
              detalhesDB.barreirasPorSubtipo.forEach((subtipo: any) => {
                subtipo.barreiras?.forEach((barreira: any) => {
                  if (barreira.atendida) {
                    detalhesConvertidos.atendidas.push({
                      id: barreira.id,
                      descricao: barreira.descricao
                    })
                  } else {
                    detalhesConvertidos.naoAtendidas.push({
                      id: barreira.id,
                      descricao: barreira.descricao,
                      prioridade: 'importante'
                    })
                  }
                })
              })
            }
            // Se já tem o formato esperado, usar diretamente
            else if (detalhesDB.atendidas) {
              detalhesConvertidos.atendidas = detalhesDB.atendidas || []
              detalhesConvertidos.naoAtendidas = detalhesDB.naoAtendidas || []
              detalhesConvertidos.extras = detalhesDB.extras || []
            }
            
            return {
              ...candidatura,
              matchScore: {
                score: candidatura.matchScoreDB.scoreTotal,
                scoreAcessibilidades: candidatura.matchScoreDB.scoreAcessibilidades,
                scoreSubtipos: candidatura.matchScoreDB.scoreSubtipos,
                acessibilidadesAtendidas: candidatura.matchScoreDB.acessibilidadesAtendidas,
                acessibilidadesTotal: candidatura.matchScoreDB.acessibilidadesTotal,
                detalhes: detalhesConvertidos
              }
            }
          }
          
          // Fallback: calcular localmente se não tiver no banco
          console.log('[JobCandidates] matchScoreDB não disponível, calculando localmente')
          const matchScore = calcularMatchScore(candidatura)
          console.log('[JobCandidates] Match calculado localmente:', matchScore)
          
          return {
            ...candidatura,
            matchScore
          }
        })

        console.log('[JobCandidates] Candidaturas com match:', candidaturasComMatch)
        setCandidaturas(candidaturasComMatch)
      } catch (error: any) {
        console.error('[JobCandidates] Erro ao buscar candidaturas:', error)
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
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-indigo-500/20 to-violet-500/20 blur-xl animate-pulse" />
            <div className="relative w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
          <p className="text-muted-foreground font-medium">Carregando candidaturas...</p>
        </div>
      </div>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-emerald-500 to-green-600'
    if (score >= 60) return 'from-amber-500 to-yellow-600'
    if (score >= 40) return 'from-orange-500 to-amber-600'
    return 'from-red-500 to-rose-600'
  }

  const getScoreTextColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400'
    if (score >= 60) return 'text-amber-600 dark:text-amber-400'
    if (score >= 40) return 'text-orange-600 dark:text-orange-400'
    return 'text-red-600 dark:text-red-400'
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Hero Header Premium */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl border border-border/30 shadow-2xl -mx-2">
        {/* Background gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-700" />

        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-candidates" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-candidates)" />
          </svg>
        </div>

        {/* Elementos decorativos */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse" />
        <div className="absolute -left-10 top-1/2 h-48 w-48 rounded-full bg-cyan-500/20 blur-2xl" />

        {/* Ícones decorativos */}
        <div className="absolute top-6 right-8 opacity-20 hidden sm:block">
          <Sparkles className="h-8 w-8 text-white animate-pulse" />
        </div>

        <div className="relative px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-2 text-white/80 hover:text-white hover:bg-white/10 mb-4 sm:mb-6 -ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden xs:inline">Voltar para vagas</span>
            <span className="xs:hidden">Voltar</span>
          </Button>

          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
              <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
                {/* Ícone principal */}
                <div className="relative group">
                  <div className="absolute -inset-1 rounded-xl sm:rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 opacity-70 blur group-hover:opacity-100 transition-opacity" />
                  <div className="relative h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-2xl ring-2 sm:ring-4 ring-white/20">
                    <Users className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 text-white" />
                  </div>
                </div>

                <div className="space-y-0.5 sm:space-y-1 md:space-y-2">
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight drop-shadow-lg">
                    Candidatos
                  </h1>
                  <p className="text-white/70 text-xs sm:text-sm md:text-base lg:text-lg">
                    {candidaturas.length} candidatura{candidaturas.length !== 1 ? 's' : ''} recebida{candidaturas.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Stats rápidas */}
              <div className="flex gap-3 sm:gap-4">
                <div className="px-3 py-2 sm:px-4 sm:py-3 md:px-5 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-white">{candidaturas.filter(c => (c.matchScore?.score || 0) >= 70).length}</p>
                  <p className="text-[10px] sm:text-xs text-white/60">Match Alto</p>
                </div>
                <div className="px-3 py-2 sm:px-4 sm:py-3 md:px-5 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-white">{candidaturas.filter(c => c.status === 'Pendente').length}</p>
                  <p className="text-[10px] sm:text-xs text-white/60">Pendentes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {candidaturas.length === 0 ? (
        <Card className="border-2 border-dashed border-indigo-500/30 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 shadow-lg">
          <CardContent className="text-center py-16">
            <div className="relative mx-auto w-fit mb-6">
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-indigo-500/20 to-violet-500/20 blur-xl" />
              <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-950 dark:to-violet-950 flex items-center justify-center">
                <User className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">Nenhuma candidatura ainda</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Esta vaga ainda não recebeu candidaturas. Continue divulgando para atrair talentos qualificados.
            </p>
            <Button variant="outline" className="rounded-xl border-2" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para vagas
            </Button>
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
            .map((candidatura, index) => (
              <Card
                key={candidatura.id}
                className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-background to-background/80"
              >
                {/* Decoração superior baseada no score */}
                <div className={`h-1.5 bg-gradient-to-r ${getScoreColor(candidatura.matchScore?.score || 0)}`} />

                <CardHeader className="bg-gradient-to-r from-muted/50 to-transparent pb-4 sm:pb-6">
                  <div className="flex flex-col gap-4 sm:gap-6">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6">
                      <div className="flex items-start gap-3 sm:gap-4 md:gap-5">
                        {/* Ranking badge */}
                        {index < 3 && (
                          <div className={`absolute -top-2 -left-2 h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10 text-xs sm:text-sm ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-500' :
                              index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                                'bg-gradient-to-br from-orange-400 to-amber-600'
                            }`}>
                            {index + 1}º
                          </div>
                        )}

                        <div className="relative">
                          <Avatar className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 border-2 sm:border-4 border-background shadow-xl ring-1 sm:ring-2 ring-border/50">
                            <AvatarImage src={candidatura.candidato.avatarUrl || undefined} />
                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-lg sm:text-xl md:text-2xl font-bold">
                              {getInitials(candidatura.candidato.nome)}
                            </AvatarFallback>
                          </Avatar>
                          {/* Online indicator mock */}
                          <div className="absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-emerald-500 border-2 sm:border-4 border-background" />
                        </div>

                        <div className="space-y-1 sm:space-y-2 min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <CardTitle className="text-lg sm:text-xl md:text-2xl truncate max-w-[200px] sm:max-w-none">
                              {candidatura.candidato.nome}
                            </CardTitle>
                            <Badge variant={getStatusBadgeVariant(candidatura.status)} className="text-[10px] sm:text-xs font-medium">
                              {candidatura.status}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                            <div className="flex items-center gap-1 sm:gap-1.5">
                              <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                              <span className="hidden xs:inline">Candidatou em</span> {formatDate(candidatura.createdAt)}
                            </div>
                            {candidatura.candidato.dataNascimento && (
                              <div className="flex items-center gap-1 sm:gap-1.5">
                                <User className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                {calculateAge(candidatura.candidato.dataNascimento)} anos
                              </div>
                            )}
                            {candidatura.candidato.cidade && candidatura.candidato.estado && (
                              <div className="flex items-center gap-1 sm:gap-1.5 hidden sm:flex">
                                <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                {candidatura.candidato.cidade}, {candidatura.candidato.estado}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <GraduationCap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-indigo-600" />
                            <span className="text-xs sm:text-sm font-medium">{candidatura.candidato.escolaridade}</span>
                          </div>
                        </div>
                      </div>

                    {/* Match Score Card */}
                    {candidatura.matchScore && (
                      <Card className={`border-2 shadow-lg bg-gradient-to-br w-full sm:w-auto ${candidatura.matchScore.score >= 80 ? 'from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border-emerald-200 dark:border-emerald-800' :
                          candidatura.matchScore.score >= 60 ? 'from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border-amber-200 dark:border-amber-800' :
                            'from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border-orange-200 dark:border-orange-800'
                        }`}>
                        <CardContent className="pt-4 pb-4 px-4 sm:pt-5 sm:pb-5 sm:px-6">
                          <div className="flex items-center gap-2 sm:gap-3 mb-2">
                            <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${getScoreColor(candidatura.matchScore.score)} flex items-center justify-center shadow-lg`}>
                              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                            </div>
                            <div>
                              <span className={`text-2xl sm:text-3xl md:text-4xl font-bold ${getScoreTextColor(candidatura.matchScore.score)}`}>
                                {candidatura.matchScore.score}%
                              </span>
                              <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                Match Score
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-3 sm:gap-4 mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-border/50">
                            <div className="text-center">
                              <p className="text-base sm:text-lg font-bold text-indigo-600">{candidatura.matchScore.scoreAcessibilidades}%</p>
                              <p className="text-[9px] sm:text-[10px] text-muted-foreground">Acessibilidade</p>
                            </div>
                            <div className="text-center">
                              <p className="text-base sm:text-lg font-bold text-violet-600">{candidatura.matchScore.scoreSubtipos}%</p>
                              <p className="text-[9px] sm:text-[10px] text-muted-foreground">Deficiências</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
                </CardHeader>

                <CardContent className="space-y-6 pt-6">
                  {/* Grid de Informações de Contato */}
                  <div>
                    <h3 className="font-semibold text-xs sm:text-sm text-muted-foreground uppercase tracking-wide mb-3 sm:mb-4 flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Informações de Contato
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                      <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500/5 to-indigo-500/5 border border-blue-500/10 hover:border-blue-500/30 transition-colors">
                        <div className="h-9 w-9 sm:h-11 sm:w-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                          <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">E-mail</p>
                          <p className="font-medium text-xs sm:text-sm truncate">{candidatura.candidato.email || 'Não informado'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-emerald-500/10 hover:border-emerald-500/30 transition-colors">
                        <div className="h-9 w-9 sm:h-11 sm:w-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                          <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">Telefone</p>
                          <p className="font-medium text-xs sm:text-sm">{candidatura.candidato.telefone || 'Não informado'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-br from-violet-500/5 to-purple-500/5 border border-violet-500/10 hover:border-violet-500/30 transition-colors">
                        <div className="h-9 w-9 sm:h-11 sm:w-11 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                          <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">Localização</p>
                          <p className="font-medium text-xs sm:text-sm truncate">
                            {candidatura.candidato.cidade && candidatura.candidato.estado
                              ? `${candidatura.candidato.cidade}, ${candidatura.candidato.estado}`
                              : candidatura.candidato.profileData?.endereco || 'Não informado'
                            }
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/10 hover:border-amber-500/30 transition-colors">
                        <div className="h-9 w-9 sm:h-11 sm:w-11 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                          <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">Escolaridade</p>
                          <p className="font-medium text-xs sm:text-sm">{candidatura.candidato.escolaridade}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Deficiências */}
                  {candidatura.candidato.subtipos && candidatura.candidato.subtipos.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Deficiências e Necessidades
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {candidatura.candidato.subtipos.map((item, idx) => (
                          <Badge key={idx} variant="outline" className="py-2 px-4 text-sm rounded-xl bg-gradient-to-r from-indigo-500/5 to-violet-500/5 border-indigo-500/20 hover:border-indigo-500/40 transition-colors">
                            <User className="mr-2 h-4 w-4 text-indigo-600" />
                            <span className="font-medium">{item.subtipo.nome}</span>
                            <span className="mx-1.5 text-muted-foreground">•</span>
                            <span className="text-muted-foreground">{item.subtipo.tipo.nome}</span>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Match Score Detalhado */}
                  {candidatura.matchScore && candidatura.matchScore.detalhes && (
                    <Card className="border-2 bg-gradient-to-br from-slate-50/50 to-gray-50/50 dark:from-slate-950/20 dark:to-gray-950/20">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Award className="h-5 w-5 text-indigo-600" />
                          Análise Detalhada de Compatibilidade
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Atendidas */}
                        {candidatura.matchScore.detalhes.atendidas?.length > 0 && (
                          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4" />
                              Acessibilidades Atendidas ({candidatura.matchScore.detalhes.atendidas.length})
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {candidatura.matchScore.detalhes.atendidas.map((acc: any) => (
                                <Badge key={acc.id} className="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-0 rounded-lg">
                                  <CheckCircle2 className="mr-1.5 h-3 w-3" />
                                  {acc.descricao}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Não Atendidas */}
                        {candidatura.matchScore.detalhes.naoAtendidas?.length > 0 && (
                          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                            <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-3 flex items-center gap-2">
                              <AlertCircle className="h-4 w-4" />
                              Necessidades Não Atendidas ({candidatura.matchScore.detalhes.naoAtendidas.length})
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {candidatura.matchScore.detalhes.naoAtendidas.map((acc: any) => (
                                <Badge key={acc.id} className="bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-0 rounded-lg">
                                  {acc.descricao}
                                  {acc.prioridade === 'essencial' && <span className="ml-1.5">🔴</span>}
                                  {acc.prioridade === 'importante' && <span className="ml-1.5">🟡</span>}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Extras */}
                        {candidatura.matchScore.detalhes.extras?.length > 0 && (
                          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                            <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-3 flex items-center gap-2">
                              <Star className="h-4 w-4" />
                              Acessibilidades Extras Oferecidas ({candidatura.matchScore.detalhes.extras.length})
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {candidatura.matchScore.detalhes.extras.map((acc: any) => (
                                <Badge key={acc.id} className="bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-0 rounded-lg">
                                  <Star className="mr-1.5 h-3 w-3" />
                                  {acc.descricao}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Ações */}
                  <div className="flex flex-wrap gap-2 sm:gap-3 pt-4 border-t border-border/50">
                    {candidatura.candidato.curriculoUrl && (
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-md rounded-lg sm:rounded-xl text-xs sm:text-sm h-9 sm:h-10"
                        asChild
                      >
                        <a href={candidatura.candidato.curriculoUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                          <span className="hidden xs:inline">Baixar </span>Currículo
                        </a>
                      </Button>
                    )}
                    {candidatura.candidato.linkedin && (
                      <Button variant="outline" size="sm" className="gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl border-2 hover:border-blue-500/50 text-xs sm:text-sm h-9 sm:h-10" asChild>
                        <a href={candidatura.candidato.linkedin} target="_blank" rel="noopener noreferrer">
                          <LinkIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          LinkedIn
                          <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3 ml-0.5 sm:ml-1 hidden sm:inline" />
                        </a>
                      </Button>
                    )}
                    {candidatura.candidato.portfolio && (
                      <Button variant="outline" size="sm" className="gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl border-2 hover:border-violet-500/50 text-xs sm:text-sm h-9 sm:h-10" asChild>
                        <a href={candidatura.candidato.portfolio} target="_blank" rel="noopener noreferrer">
                          <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          Portfólio
                          <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3 ml-0.5 sm:ml-1 hidden sm:inline" />
                        </a>
                      </Button>
                    )}
                    
                    {/* Botão de Chat - apenas para candidaturas em processo */}
                    {candidatura.status === 'EM_PROCESSO' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl border-2 hover:border-indigo-500/50 text-xs sm:text-sm h-9 sm:h-10"
                        onClick={() => navigate(`/dashboard/empresa/chat/${candidatura.id}`)}
                      >
                        <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span className="hidden xs:inline">Enviar </span>Mensagem
                      </Button>
                    )}

                    {candidatura.status !== 'EM_PROCESSO' && (
                      <Button
                        size="sm"
                        className="gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-emerald-500/20 text-xs sm:text-sm h-9 sm:h-10 w-full xs:w-auto"
                        onClick={async () => {
                          try {
                            const token = localStorage.getItem('auth_token')
                            if (token) {
                              await import('@/services/vagas').then(m => m.atualizarStatusCandidatura(token, candidatura.id, 'EM_PROCESSO'))
                              toast({
                                title: "Candidatura Aceita!",
                                description: "O candidato foi movido para a lista de processos.",
                                className: "bg-emerald-50 border-emerald-200 text-emerald-800"
                              })
                              // Update local state to reflect change immediately
                              setCandidaturas(prev => prev.map(c =>
                                c.id === candidatura.id ? { ...c, status: 'EM_PROCESSO' } : c
                              ))
                            }
                          } catch (error) {
                            toast({
                              title: "Erro ao aceitar",
                              description: "Não foi possível atualizar o status.",
                              variant: "destructive"
                            })
                          }
                        }}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Aceitar Candidatura
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
