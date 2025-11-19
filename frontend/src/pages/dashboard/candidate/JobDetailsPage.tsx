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
  GraduationCap,
  Clock,
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
      // registra visualização no backend
      import('@/services/vagas').then(({ registrarVisualizacaoVaga }) => {
        if (jobId) registrarVisualizacaoVaga(parseInt(jobId)).catch(() => {})
      })
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

      {/* Header Card com gradiente */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 via-background to-background overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/3 rounded-full blur-3xl -z-10" />
        
        <CardHeader className="space-y-6 pb-8">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20 border-2 border-primary/20 shadow-lg">
                <AvatarImage src={job.logo} alt={`${job.company} logo`} />
                <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                  {job.company.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <CardTitle className="text-3xl font-bold">{job.title}</CardTitle>
                <CardDescription className="flex items-center gap-2 text-base">
                  <Building className="h-4 w-4" /> {job.company}
                </CardDescription>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Publicada em {new Date(job.createdAt).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 w-full sm:w-auto">
              <Button
                onClick={handleApply}
                className="w-full sm:w-auto h-11 text-base shadow-md hover:shadow-lg transition-shadow"
                disabled={!isJobActive || alreadyApplied || checkingApplication}
                size="lg"
              >
                {checkingApplication ? (
                  'Verificando...'
                ) : alreadyApplied ? (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Já candidatado
                  </>
                ) : (
                  'Candidatar-se agora'
                )}
              </Button>
              {alreadyApplied && isJobActive && (
                <Card className="bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800">
                  <CardContent className="p-3">
                    <p className="text-sm text-green-700 dark:text-green-400 flex items-center justify-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Você já se candidatou a esta vaga
                    </p>
                  </CardContent>
                </Card>
              )}
              {!isJobActive && (
                <Card className="bg-destructive/10 border-destructive/20">
                  <CardContent className="p-3">
                    <p className="text-sm text-destructive text-center">
                      Vaga fechada para candidaturas
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Métricas em cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-card/50 backdrop-blur border-primary/10">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Localização</p>
                  <p className="text-sm font-semibold">{job.location}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 backdrop-blur border-primary/10">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Regime</p>
                  <p className="text-sm font-semibold">{job.regime}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 backdrop-blur border-primary/10">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <CalendarDays className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tipo</p>
                  <p className="text-sm font-semibold">{job.type}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 backdrop-blur border-primary/10">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Escolaridade</p>
                  <p className="text-sm font-semibold">{job.sector}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardHeader>
      </Card>

      {/* Card de conteúdo */}
      <div className="grid gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Descrição da Vaga</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {job.description}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md border-blue-100 dark:border-blue-900/20">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <HeartHandshake className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              Acessibilidades Oferecidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {job.accessibilities && job.accessibilities.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {job.accessibilities.map((acc, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 text-sm py-1.5 px-3"
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
          </CardContent>
        </Card>
        
        <Card className="shadow-md border-green-100 dark:border-green-900/20">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              Benefícios Oferecidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {job.benefits && job.benefits.trim() ? (
              <div className="flex flex-wrap gap-2">
                {job.benefits.split(',').map((benefit, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 text-sm py-1.5 px-3"
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
          </CardContent>
        </Card>
      </div>

      <Button 
        variant="outline" 
        onClick={() => navigate(-1)}
        className="shadow-sm hover:shadow-md transition-shadow"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para as vagas
      </Button>
    </div>
  )
}
