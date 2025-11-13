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
import { MapPin, Briefcase, Building, CheckCircle } from 'lucide-react'
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

  // Teste com versão simplificada primeiro
  return (
    <Card className="p-4 space-y-4">
      <div>
        <h3 className="font-semibold text-lg">{job.title || 'Sem título'}</h3>
        <p className="text-muted-foreground">{job.company || 'Empresa'}</p>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">{job.location || 'Local não informado'}</Badge>
        <Badge variant="secondary">{job.regime || 'Presencial'}</Badge>
        <Badge className="bg-blue-500 text-white">{matchScore}% Match</Badge>
        {job.accessibilities && job.accessibilities.length > 0 && (
          <Badge variant="outline" className="text-blue-600 border-blue-300">
            {job.accessibilities.length} acessibilidade{job.accessibilities.length > 1 ? 's' : ''}
          </Badge>
        )}
      </div>
      
      {candidatado && (
        <Badge className="bg-green-100 text-green-700 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Já candidatado
        </Badge>
      )}
      
      <p className="text-sm text-muted-foreground">
        {job.description || 'Sem descrição disponível'}
      </p>
      
      <div className="flex gap-2 pt-2">
        <Button variant="outline" className="flex-1" asChild>
          <Link to={`/dashboard/candidato/vaga/${job.id}`}>Ver Detalhes</Link>
        </Button>
        <Button 
          className="flex-1"
          onClick={handleCandidatar}
          disabled={loading || candidatado}
        >
          {candidatado ? 'Candidatado' : loading ? 'Enviando...' : 'Candidatar-se'}
        </Button>
      </div>
    </Card>
  )
}
