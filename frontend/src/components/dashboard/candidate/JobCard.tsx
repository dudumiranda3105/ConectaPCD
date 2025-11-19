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
import { MapPin, Briefcase, Building, CheckCircle, HeartHandshake, Sparkles, ArrowRight } from 'lucide-react'
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
  


  const getScoreColor = () => {
    if (matchScore >= 75) return 'bg-green-500'
    if (matchScore >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

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
        title: 'Candidatura enviada!',
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
    if (matchScore >= 75) return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-900'
    if (matchScore >= 50) return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-900'
    return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-900'
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 relative overflow-hidden">
      {/* Badge de match score flutuante */}
      <div className="absolute top-4 right-4 z-10">
        <Badge className={cn('font-semibold shadow-sm', getMatchColor())}>
          <Sparkles className="h-3 w-3 mr-1" />
          {matchScore}% Match
        </Badge>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <Avatar className="h-14 w-14 border-2 border-border">
            <AvatarImage src={job.logo} alt={job.company} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {job.company?.charAt(0) || 'E'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 pr-20">
            <CardTitle className="text-lg leading-tight mb-1 line-clamp-1">
              {job.title || 'Sem título'}
            </CardTitle>
            <CardDescription className="flex items-center gap-1.5 text-sm">
              <Building className="h-3.5 w-3.5" />
              {job.company || 'Empresa'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pb-4">
        {/* Descrição */}
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {job.description || 'Sem descrição disponível'}
        </p>

        {/* Badges de info */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="gap-1">
            <MapPin className="h-3 w-3" />
            {job.location || 'Local não informado'}
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <Briefcase className="h-3 w-3" />
            {job.regime || 'Presencial'}
          </Badge>
          {job.accessibilities && job.accessibilities.length > 0 && (
            <Badge 
              variant="outline" 
              className="gap-1 border-blue-200 text-blue-700 bg-blue-50 dark:border-blue-900 dark:text-blue-400 dark:bg-blue-950"
            >
              <HeartHandshake className="h-3 w-3" />
              {job.accessibilities.length} acessibilidade{job.accessibilities.length > 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        {/* Status de candidatura */}
        {candidatado && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50 border border-green-200 dark:bg-green-950 dark:border-green-900">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-700 dark:text-green-400">
              Você já se candidatou a esta vaga
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 gap-2">
        <Button 
          variant="outline" 
          className="flex-1 group-hover:border-primary/50 transition-colors" 
          asChild
        >
          <Link to={`/dashboard/candidato/vaga/${job.id}`} className="gap-2">
            Ver Detalhes
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
        <Button 
          className="flex-1"
          onClick={handleCandidatar}
          disabled={loading || candidatado}
        >
          {candidatado ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Candidatado
            </>
          ) : loading ? (
            'Enviando...'
          ) : (
            'Candidatar-se'
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
