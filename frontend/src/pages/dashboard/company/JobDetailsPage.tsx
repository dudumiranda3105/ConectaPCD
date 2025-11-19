import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  ArrowLeft,
  Briefcase,
  CalendarDays,
  Users,
  Eye,
  Edit,
  XCircle,
  HeartHandshake,
  Gift,
  GraduationCap,
  MapPin,
  CheckCircle,
  MoreVertical,
  FileText,
  Building2,
  TrendingUp,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { listarVagasEmpresa, fecharVaga, listarCandidaturasVaga } from '@/services/vagas'

export default function JobDetailsPage() {
  const { jobId } = useParams<{ jobId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()
  const [job, setJob] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        if (!user || !token || !user.empresaId) {
          navigate('/dashboard/empresa')
          return
        }

        const vagas = await listarVagasEmpresa(token, user.empresaId)
        const foundJob = vagas.find((v: any) => v.id === parseInt(jobId || '0'))

        if (foundJob) {
          console.log('[JobDetailsPage] Vaga encontrada:', foundJob)
          console.log('[JobDetailsPage] Acessibilidades da vaga:', foundJob.acessibilidades)
          
          // Buscar candidaturas
          try {
            const candidaturas = await listarCandidaturasVaga(token, foundJob.id)
            setJob({ ...foundJob, applications: candidaturas.length })
          } catch {
            setJob({ ...foundJob, applications: 0 })
          }
        } else {
          toast({
            title: 'Vaga não encontrada',
            description: 'A vaga solicitada não existe ou não pertence a sua empresa.',
            variant: 'destructive',
          })
          navigate('/dashboard/empresa')
        }
      } catch (error) {
        toast({
          title: 'Erro ao carregar vaga',
          description: 'Não foi possível carregar os detalhes da vaga.',
          variant: 'destructive',
        })
        navigate('/dashboard/empresa')
      } finally {
        setLoading(false)
      }
    }

    fetchJobDetails()
  }, [jobId, user, navigate, toast])

  const handleCloseJob = async () => {
    if (!job) return
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) return

      await fecharVaga(token, Number(job.id))
      toast({
        title: 'Vaga fechada com sucesso!',
        description: 'A vaga não receberá mais candidaturas.',
      })
      setJob({ ...job, isActive: false })
    } catch (err: any) {
      toast({
        title: 'Erro ao fechar vaga',
        description: err.message,
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

  const isJobActive = job.isActive === true

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Breadcrumb - Fixed */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/dashboard/empresa" className="flex items-center gap-1 hover:text-primary transition-colors">
                  <Building2 className="h-3.5 w-3.5" />
                  Minhas Vagas
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium">{job.titulo || 'Detalhes da Vaga'}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1 overflow-hidden">
        <div className="space-y-6 px-6 py-6">
          <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
        {/* Header com gradiente premium */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 px-8 py-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,white)]"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 bg-white/20 rounded-2xl backdrop-blur-md flex items-center justify-center shadow-2xl flex-shrink-0 hover:bg-white/30 transition-all duration-300">
                  <Briefcase className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-3">
                  <h1 className="text-4xl font-bold text-white drop-shadow-lg">{job.titulo}</h1>
                  <div className="flex flex-wrap items-center gap-3 text-blue-100">
                    <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg">
                      <CalendarDays className="h-4 w-4" />
                      <span className="text-sm">Publicada em {new Date(job.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <Badge
                      variant={isJobActive ? 'default' : 'secondary'}
                      className={
                        isJobActive
                          ? 'bg-green-500/90 text-white hover:bg-green-600 border-0 shadow-lg px-3 py-1.5'
                          : 'bg-gray-500/90 text-white hover:bg-gray-600 border-0 px-3 py-1.5'
                      }
                    >
                      {isJobActive ? '● Ativa' : '● Inativa'}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-stretch gap-2 w-full lg:w-auto">
                <Button
                  size="lg"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm shadow-xl h-12 hover:shadow-2xl transition-all duration-300 w-full lg:w-auto"
                  onClick={() => navigate(`/dashboard/empresa/vagas/${job.id}/candidatos`)}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Ver Candidatos
                  <Badge className="ml-2 bg-white/40 text-white hover:bg-white/50 border-0 font-semibold">
                    {job.applications || 0}
                  </Badge>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="lg"
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm shadow-xl h-12 hover:shadow-2xl transition-all duration-300 px-3"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-semibold">Ações da Vaga</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/dashboard/empresa')}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar Vaga
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate(`/dashboard/empresa/vagas/${job.id}/candidatos`)}>
                      <Users className="mr-2 h-4 w-4" />
                      Ver Candidatos
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="mr-2 h-4 w-4" />
                      Exportar Dados
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {isJobActive && (
                      <DropdownMenuItem
                        onClick={handleCloseJob}
                        className="text-destructive focus:text-destructive"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Fechar Vaga
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        <CardHeader className="pb-0">
        </CardHeader>
        <CardContent className="space-y-8 pt-6">
          {/* Métricas em Cards com Hover Effects */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-default">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-2">Candidaturas</p>
                    <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{job.applications || 0}</p>
                  </div>
                  <div className="h-16 w-16 bg-blue-600/15 rounded-2xl flex items-center justify-center group-hover:bg-blue-600/25 transition-all duration-300">
                    <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md bg-gradient-to-br from-violet-50 to-violet-100/50 dark:from-violet-950/30 dark:to-violet-900/20 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-default">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-2">Visualizações</p>
                    <p className="text-4xl font-bold text-violet-600 dark:text-violet-400">{job.views || 0}</p>
                  </div>
                  <div className="h-16 w-16 bg-violet-600/15 rounded-2xl flex items-center justify-center">
                    <Eye className="h-8 w-8 text-violet-600 dark:text-violet-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-default">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-2">Taxa de Conversão</p>
                    <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                      {job.views > 0 ? Math.round((job.applications / job.views) * 100) : 0}%
                    </p>
                  </div>
                  <div className="h-16 w-16 bg-emerald-600/15 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-2" />

          {/* Informações principais em cards */}
          <Card className="border-0 shadow-md bg-white dark:bg-slate-800">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                Informações da Vaga
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors">
                  <div className="h-10 w-10 bg-blue-600/15 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Tipo de Contrato</p>
                    <p className="font-semibold text-base">{job.tipo || 'Não informado'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors">
                  <div className="h-10 w-10 bg-indigo-600/15 rounded-lg flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Escolaridade Mínima</p>
                    <p className="font-semibold text-base">{job.escolaridade || 'Não informado'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-violet-50/50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/50 hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors">
                  <div className="h-10 w-10 bg-violet-600/15 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Regime de Trabalho</p>
                    <p className="font-semibold text-base">{job.regimeTrabalho || 'Não informado'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Descrição */}
          <Card className="border-0 shadow-md bg-white dark:bg-slate-800">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                Descrição da Vaga
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed text-base">
                {job.descricao || 'Sem descrição disponível'}
              </p>
            </CardContent>
          </Card>

          {/* Acessibilidades e Benefícios em grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <CardHeader className="pb-6">
                <CardTitle className="text-lg flex items-center gap-2">
                  <HeartHandshake className="h-5 w-5 text-blue-600" />
                  Acessibilidades Oferecidas
                </CardTitle>
              </CardHeader>
              <CardContent>
                {job.acessibilidades && job.acessibilidades.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {job.acessibilidades.map((acc: any, index: number) => {
                      // Suporta diferentes formatos de resposta do backend
                      const descricao = acc.acessibilidade?.descricao || acc.descricao || acc;
                      console.log('[JobDetailsPage] Renderizando acessibilidade:', { acc, descricao });
                      return (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800 py-2 px-3 text-sm font-medium flex items-center gap-1.5"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          {descricao}
                        </Badge>
                      );
                    })}
                  </div>
                ) : (
                  <>
                    {console.log('[JobDetailsPage] Nenhuma acessibilidade encontrada. job.acessibilidades:', job.acessibilidades)}
                    <p className="text-muted-foreground italic text-sm">
                      Nenhuma acessibilidade específica informada
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-gradient-to-br from-emerald-50/50 to-green-50/50 dark:from-emerald-950/20 dark:to-green-950/20">
              <CardHeader className="pb-6">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Gift className="h-5 w-5 text-emerald-600" />
                  Benefícios Oferecidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {job.beneficios && job.beneficios.trim() ? (
                  <div className="flex flex-wrap gap-2">
                    {job.beneficios.split(',').map((benefit: string, index: number) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-300 dark:border-emerald-800 py-2 px-3 text-sm font-medium"
                      >
                        {benefit.trim()}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic text-sm">
                    Nenhum benefício específico informado
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Button
        variant="outline"
        onClick={() => navigate('/dashboard/empresa')}
        className="gap-2 h-12 text-base border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para Minhas Vagas
      </Button>
        </div>
      </ScrollArea>
    </div>
  )
}
