import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useJobStore } from '@/stores/job-store'
import { useApplicationStore } from '@/stores/application-store'
import { Job } from '@/lib/jobs'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Building,
  CalendarDays,
  Award,
  HeartHandshake,
  CheckCircle,
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useAuth } from '@/hooks/use-auth'
import { listarCandidaturasCandidato, candidatarSeVaga } from '@/services/candidaturas'

export default function JobDetailsPage() {
  const { jobId } = useParams<{ jobId: string }>()
  const navigate = useNavigate()
  const { jobs } = useJobStore()
  const { toast } = useToast()
  const { user } = useAuth()
  const { applyForJob } = useApplicationStore()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [alreadyApplied, setAlreadyApplied] = useState(false)
  const [checkingApplication, setCheckingApplication] = useState(false)

  const checkIfAlreadyApplied = async () => {
    if (!user?.candidatoId || !jobId) return
    
    setCheckingApplication(true)
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) return
      
      const candidaturas = await listarCandidaturasCandidato(user.candidatoId, token)
      const hasAppliedToJob = candidaturas.some((candidatura: any) => 
        candidatura.vaga.id === parseInt(jobId)
      )
      setAlreadyApplied(hasAppliedToJob)
    } catch (error) {
      console.error('Erro ao verificar candidaturas:', error)
    } finally {
      setCheckingApplication(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    const foundJob = jobs.find((j) => j.id === jobId)
    if (foundJob) {
      setJob(foundJob)
      checkIfAlreadyApplied()
    } else {
      navigate('/dashboard/candidato')
    }
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [jobId, jobs, navigate, user])

  const handleApply = async () => {
    if (!job || !jobId || !user?.candidatoId || alreadyApplied) return

    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        toast({
          title: 'Erro',
          description: 'Você precisa estar logado para se candidatar.',
          variant: 'destructive',
        })
        return
      }

      await candidatarSeVaga(parseInt(jobId), user.candidatoId, token)
      applyForJob(jobId) // Atualiza o store local também
      setAlreadyApplied(true)
      
      toast({
        title: 'Candidatura enviada com sucesso!',
        description: `Você se candidatou para a vaga de ${job.title}.`,
      })
    } catch (error: any) {
      toast({
        title: 'Erro ao candidatar-se',
        description: error.message || 'Ocorreu um erro inesperado.',
        variant: 'destructive',
      })
    }
  }

  if (loading || !job) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  const isJobActive = job.status === 'Ativa'

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard/candidato">Vagas</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{job.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={job.logo} alt={`${job.company} logo`} />
                <AvatarFallback>{job.company.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{job.title}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Building className="h-4 w-4" /> {job.company}
                </CardDescription>
              </div>
            </div>
            <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
              <Button
                onClick={handleApply}
                className="w-full sm:w-auto"
                disabled={!isJobActive || alreadyApplied || checkingApplication}
              >
                {checkingApplication ? (
                  'Verificando...'
                ) : alreadyApplied ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Já candidatado
                  </>
                ) : (
                  'Candidatar-se agora'
                )}
              </Button>
              {alreadyApplied && isJobActive && (
                <p className="text-xs text-green-600 text-center sm:text-right flex items-center justify-center sm:justify-end gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Você já se candidatou a esta vaga
                </p>
              )}
              {!isJobActive && (
                <p className="text-xs text-destructive text-center sm:text-right">
                  Esta vaga não está mais aceitando candidaturas.
                </p>
              )}
              <p className="text-xs text-muted-foreground text-center sm:text-right">
                Publicada em:{' '}
                {new Date(job.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              <span>{job.regime}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              <span>{job.type}</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              <span>{job.sector}</span>
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="text-lg font-semibold mb-2">Descrição da Vaga</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {job.description}
            </p>
          </div>
          <Separator />
          <div className="grid grid-cols-1 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <HeartHandshake className="h-5 w-5 text-blue-600" /> 
                Acessibilidades Oferecidas
              </h3>
              {job.accessibilities && job.accessibilities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {job.accessibilities.map((acc, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                    >
                      {acc}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">
                  Nenhuma acessibilidade específica informada
                </p>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-green-600" /> 
                Benefícios Oferecidos
              </h3>
              {job.benefits && job.benefits.trim() ? (
                <div className="flex flex-wrap gap-2">
                  {job.benefits.split(',').map((benefit, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary"
                      className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                    >
                      {benefit.trim()}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">
                  Nenhum benefício específico informado
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <Button variant="outline" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para as vagas
      </Button>
    </div>
  )
}
