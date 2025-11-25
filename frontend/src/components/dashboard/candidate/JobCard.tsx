import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MapPin, Briefcase, Building, CheckCircle, HeartHandshake, Sparkles, ArrowRight, Star, TrendingUp, Clock, Zap, Eye } from 'lucide-react'
import { Job } from '@/lib/jobs'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { candidatarSeVaga } from '@/services/candidaturas'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/components/ui/use-toast'

interface JobCardProps {
  job: Job
  matchScore: number
  showIcons?: boolean
  isApplied?: boolean
}

export const JobCard = ({
  job,
  matchScore = 75,
  showIcons = true,
  isApplied = false,
}: JobCardProps) => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [candidatado, setCandidatado] = useState(isApplied)
  
  // Atualiza o estado quando a prop isApplied muda
  useEffect(() => {
    setCandidatado(isApplied)
  }, [isApplied])

  const handleCandidatar = async () => {
    if (!user?.candidatoId) {
      toast({
        title: 'Complete seu perfil',
        description: 'Você precisa completar seu cadastro antes de se candidatar.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) throw new Error('Token não encontrado')
      
      if (!user.candidatoId) {
        throw new Error('Você precisa completar seu perfil de candidato para se candidatar.')
      }
      if (!job.id) {
        throw new Error('ID da vaga não encontrado.')
      }
      
      await candidatarSeVaga(Number(job.id), user.candidatoId, token)
      setCandidatado(true)
      toast({
        title: 'Candidatura enviada! 🎉',
        description: `Você se candidatou para a vaga "${job.title}".`,
      })
    } catch (err: any) {
      if (err.message && err.message.includes('já se candidatou')) {
        setCandidatado(true)
        toast({
          title: 'Você já se candidatou!',
          description: 'Você já enviou sua candidatura para esta vaga.',
        })
      } else {
        toast({
          title: 'Erro ao candidatar-se',
          description: err.message || 'Erro inesperado ao se candidatar',
          variant: 'destructive',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  // Validações de segurança para evitar erros de renderização
  if (!job || !job.id) {
    return (
      <Card className="p-4">
        <div className="text-center text-muted-foreground">
          Erro ao carregar vaga
        </div>
      </Card>
    )
  }

  const getMatchColor = () => {
    if (matchScore === 100) return 'from-blue-500 to-indigo-600'
    if (matchScore >= 60) return 'from-emerald-500 to-green-600'
    if (matchScore >= 26) return 'from-amber-500 to-orange-600'
    return 'from-rose-500 to-red-600'
  }

  const getMatchBg = () => {
    if (matchScore === 100) return 'bg-blue-500/10 border-blue-500/30'
    if (matchScore >= 60) return 'bg-emerald-500/10 border-emerald-500/30'
    if (matchScore >= 26) return 'bg-amber-500/10 border-amber-500/30'
    return 'bg-rose-500/10 border-rose-500/30'
  }

  const getMatchText = () => {
    if (matchScore === 100) return 'Match Perfeito!'
    if (matchScore >= 60) return 'Ótimo Match'
    if (matchScore >= 26) return 'Match Razoável'
    return 'Match Baixo'
  }

  const getMatchIcon = () => {
    if (matchScore === 100) return <Star className="h-4 w-4 fill-current" />
    if (matchScore >= 60) return <TrendingUp className="h-4 w-4" />
    if (matchScore >= 26) return <Zap className="h-4 w-4" />
    return <Sparkles className="h-4 w-4" />
  }

  return (
    <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-gradient-to-br from-background via-background to-muted/20">
      {/* Gradiente decorativo no topo */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r",
        getMatchColor()
      )} />
      
      {/* Efeito de brilho no hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="pb-4 pt-6 relative">
        <div className="flex items-start gap-4">
          {/* Avatar da empresa com efeito */}
          <div className="relative">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-primary/20 to-violet-500/20 blur opacity-0 group-hover:opacity-100 transition-opacity" />
            <Avatar className="relative h-14 w-14 rounded-xl border-2 border-background shadow-lg">
              <AvatarImage src={job.logo} alt={job.company} className="object-cover" />
              <AvatarFallback className="rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold text-lg">
                {job.company?.charAt(0) || 'E'}
              </AvatarFallback>
            </Avatar>
            {/* Indicador de match alto */}
            {matchScore >= 75 && (
              <div className="absolute -top-1 -right-1 h-6 w-6 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg ring-2 ring-background">
                <Star className="h-3.5 w-3.5 text-white fill-current" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-bold leading-tight line-clamp-1 group-hover:text-primary transition-colors">
              {job.title || 'Sem título'}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1.5 font-medium">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{job.company || 'Empresa'}</span>
            </CardDescription>
          </div>
        </div>

        {/* Badge de Match flutuante */}
        <div className={cn(
          "absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 transition-transform group-hover:scale-105",
          getMatchBg()
        )}>
          <div className={cn("bg-gradient-to-r bg-clip-text text-transparent font-bold", getMatchColor())}>
            {matchScore}%
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pb-4 relative">
        {/* Descrição */}
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {job.description || 'Sem descrição disponível'}
        </p>

        {/* Info badges */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-700 dark:text-blue-300 text-sm font-medium">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate max-w-[120px]">{job.location || 'Brasil'}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/10 text-violet-700 dark:text-violet-300 text-sm font-medium">
            <Clock className="h-3.5 w-3.5" />
            <span>{job.regime || 'Presencial'}</span>
          </div>
        </div>

        {/* Acessibilidades */}
        {job.accessibilities && job.accessibilities.length > 0 && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
              <HeartHandshake className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Recursos de acessibilidade</p>
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                {job.accessibilities.length} {job.accessibilities.length === 1 ? 'recurso disponível' : 'recursos disponíveis'}
              </p>
            </div>
          </div>
        )}

        {/* Match info */}
        <div className={cn(
          "flex items-center gap-3 p-3 rounded-xl border-2 transition-all",
          getMatchBg()
        )}>
          <div className={cn(
            "h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg",
            getMatchColor()
          )}>
            {getMatchIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold">{getMatchText()}</p>
            <p className="text-xs text-muted-foreground">
              Compatibilidade com seu perfil
            </p>
          </div>
          <div className={cn(
            "text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
            getMatchColor()
          )}>
            {matchScore}%
          </div>
        </div>

        {/* Status de candidatura */}
        {candidatado && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 border-2 border-emerald-500/30">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-md">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                Candidatura enviada!
              </p>
              <p className="text-xs text-muted-foreground">Aguarde retorno da empresa</p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 pb-4 sm:pb-5 gap-2 sm:gap-3 relative flex-col xs:flex-row">
        <Button 
          variant="outline" 
          className="flex-1 h-10 sm:h-11 font-semibold rounded-xl border-2 hover:border-primary hover:bg-primary/5 transition-all text-xs sm:text-sm w-full xs:w-auto" 
          asChild
        >
          <Link to={`/dashboard/candidato/vaga/${job.id}`} className="gap-2">
            <Eye className="h-4 w-4" />
            Ver Detalhes
          </Link>
        </Button>
        <Button 
          className={cn(
            "flex-1 h-10 sm:h-11 font-semibold rounded-xl shadow-lg transition-all text-xs sm:text-sm w-full xs:w-auto",
            !candidatado 
              ? "bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 hover:shadow-xl hover:shadow-indigo-500/25" 
              : "bg-emerald-500 hover:bg-emerald-600"
          )}
          onClick={handleCandidatar}
          disabled={loading || candidatado}
        >
          {candidatado ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Candidatado
            </>
          ) : loading ? (
            <>
              <div className="mr-2 h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Candidatar-se
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
