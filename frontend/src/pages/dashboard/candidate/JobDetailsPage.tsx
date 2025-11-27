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
  Sparkles,
  Star,
  Users,
  Send,
  Eye,
  Share2,
  Heart,
  Globe,
  DollarSign,
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
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-8 w-48" />
        <div className="rounded-2xl overflow-hidden">
          <Skeleton className="h-80 w-full" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    )
  }

  const isJobActive = job.status === 'Ativa'

  return (
    <div className="space-y-8 pb-8">
      {/* Breadcrumb estilizado */}
      <Breadcrumb>
        <BreadcrumbList className="text-sm">
          <BreadcrumbItem>
            <BreadcrumbLink asChild className="text-muted-foreground hover:text-primary transition-colors">
              <Link to="/dashboard/candidato">🏠 Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild className="text-muted-foreground hover:text-primary transition-colors">
              <Link to="/dashboard/candidato">💼 Vagas</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold text-foreground">{job.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Hero Section com gradiente vibrante */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-primary/10 shadow-2xl">
        {/* Background gradiente animado */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLThoLTJ2LTRoMnY0em0tOCA4aC0ydi00aDJ2NHptMC04aC0ydi00aDJ2NHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        
        {/* Elementos decorativos */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
        
        {/* Conteúdo do Hero */}
        <div className="relative p-8 md:p-12">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
            {/* Info da vaga */}
            <div className="flex items-start gap-6 flex-1">
              {/* Avatar da empresa */}
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl" />
                <Avatar className="relative h-24 w-24 md:h-28 md:w-28 border-4 border-white/30 shadow-2xl ring-4 ring-white/10">
                  <AvatarImage src={job.logo} alt={`${job.company} logo`} />
                  <AvatarFallback className="text-3xl font-bold bg-white/20 text-white backdrop-blur-sm">
                    {job.company.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {isJobActive && (
                  <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              
              {/* Título e empresa */}
              <div className="space-y-4 flex-1">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm hover:bg-white/30">
                      <Sparkles className="h-3 w-3 mr-1" />
                      {isJobActive ? 'Vaga Ativa' : 'Vaga Fechada'}
                    </Badge>
                    <Badge variant="outline" className="border-white/30 text-white/90 bg-white/10">
                      {job.type}
                    </Badge>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
                    {job.title}
                  </h1>
                  <div className="flex items-center gap-2 text-white/90 text-lg">
                    <Building className="h-5 w-5" />
                    <span className="font-semibold">{job.company}</span>
                  </div>
                </div>
                
                {/* Tags de info */}
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 text-white/80 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm font-medium">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
                    <Briefcase className="h-4 w-4" />
                    <span className="text-sm font-medium">{job.regime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {new Date(job.createdAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Botão de candidatura */}
            <div className="flex flex-col gap-4 w-full lg:w-auto lg:min-w-[280px]">
              <Button
                onClick={handleApply}
                className={`w-full h-14 text-lg font-bold shadow-2xl transition-all duration-300 ${
                  alreadyApplied 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-white text-indigo-700 hover:bg-white/90 hover:scale-105'
                }`}
                disabled={!isJobActive || alreadyApplied || checkingApplication}
                size="lg"
              >
                {checkingApplication ? (
                  <span className="flex items-center gap-2">
                    <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Verificando...
                  </span>
                ) : alreadyApplied ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle className="h-6 w-6" />
                    Candidatura Enviada!
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Candidatar-se Agora
                  </span>
                )}
              </Button>
              
              {alreadyApplied && (
                <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-sm text-white flex items-center gap-2 justify-center font-medium">
                    <Star className="h-4 w-4 fill-current" />
                    Sua candidatura está em análise
                  </p>
                </div>
              )}
              
              {!isJobActive && (
                <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-sm text-white text-center font-medium">
                    ⚠️ Esta vaga não está mais recebendo candidaturas
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="group hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 hover:border-blue-200 dark:hover:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Localização</p>
                <p className="text-base font-bold text-foreground">{job.location}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="group hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 hover:border-purple-200 dark:hover:border-purple-800 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Regime</p>
                <p className="text-base font-bold text-foreground">{job.regime}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="group hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 hover:border-emerald-200 dark:hover:border-emerald-800 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <CalendarDays className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Tipo</p>
                <p className="text-base font-bold text-foreground">{job.type}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="group hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 hover:border-amber-200 dark:hover:border-amber-800 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Setor</p>
                <p className="text-base font-bold text-foreground">{job.sector}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conteúdo principal */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Coluna principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Descrição da vaga */}
          <Card className="shadow-lg border-2 hover:shadow-xl transition-shadow overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50 border-b">
              <CardTitle className="text-xl flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-600 to-gray-700 flex items-center justify-center shadow-md">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                Descrição da Vaga
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed text-base">
                  {job.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Acessibilidades */}
          <Card className="shadow-lg border-2 border-blue-100 dark:border-blue-900/30 hover:shadow-xl transition-shadow overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-b border-blue-100 dark:border-blue-900/30">
              <CardTitle className="text-xl flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                  <HeartHandshake className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span>Recursos de Acessibilidade</span>
                  {job.accessibilities && job.accessibilities.length > 0 && (
                    <Badge className="ml-3 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                      {job.accessibilities.length} disponíveis
                    </Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {job.accessibilities && job.accessibilities.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {job.accessibilities.map((acc, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-2 border-blue-100 dark:border-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                    >
                      <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="font-medium text-blue-800 dark:text-blue-300">{acc}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                    <HeartHandshake className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-muted-foreground">
                    Nenhum recurso de acessibilidade específico informado
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tipos de Deficiência Aceitos */}
          <Card className="shadow-lg border-2 border-rose-100 dark:border-rose-900/30 hover:shadow-xl transition-shadow overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 border-b border-rose-100 dark:border-rose-900/30">
              <CardTitle className="text-xl flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-md">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span>Tipos de Deficiência Aceitos</span>
                  {job.subtiposAceitos && job.subtiposAceitos.length > 0 && (
                    <Badge className="ml-3 bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300">
                      {job.subtiposAceitos.length} {job.subtiposAceitos.length === 1 ? 'tipo' : 'tipos'}
                    </Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {job.subtiposAceitos && job.subtiposAceitos.length > 0 ? (
                <div className="space-y-4">
                  {/* Agrupar por tipo de deficiência */}
                  {(() => {
                    const grouped = job.subtiposAceitos.reduce((acc: any, item) => {
                      const tipoNome = item.subtipo?.tipo?.nome || 'Outros'
                      if (!acc[tipoNome]) acc[tipoNome] = []
                      acc[tipoNome].push(item.subtipo)
                      return acc
                    }, {})
                    
                    return Object.entries(grouped).map(([tipoNome, subtipos]: [string, any]) => (
                      <div key={tipoNome} className="space-y-2">
                        <h4 className="text-sm font-semibold text-rose-700 dark:text-rose-400 flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-rose-500"></div>
                          {tipoNome}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4">
                          {subtipos.map((subtipo: any) => (
                            <div 
                              key={subtipo.id}
                              className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 border-2 border-rose-100 dark:border-rose-900/30 hover:border-rose-300 dark:hover:border-rose-700 transition-colors"
                            >
                              <div className="h-7 w-7 rounded-lg bg-rose-500/10 flex items-center justify-center">
                                <CheckCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                              </div>
                              <span className="font-medium text-rose-800 dark:text-rose-300 text-sm">{subtipo.nome}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  })()}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-muted-foreground">
                    Esta vaga aceita todos os tipos de deficiência
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Não há restrições específicas de tipo de deficiência
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Benefícios */}
          <Card className="shadow-lg border-2 border-emerald-100 dark:border-emerald-900/30 hover:shadow-xl transition-shadow overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-b border-emerald-100 dark:border-emerald-900/30">
              <CardTitle className="text-lg flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                  <Award className="h-5 w-5 text-white" />
                </div>
                Benefícios
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              {job.benefits && job.benefits.trim() ? (
                <div className="space-y-2">
                  {job.benefits.split(',').map((benefit, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30"
                    >
                      <Star className="h-4 w-4 text-emerald-600 dark:text-emerald-400 fill-current" />
                      <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">{benefit.trim()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground text-sm">
                    Benefícios não informados
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card da empresa */}
          <Card className="shadow-lg border-2 hover:shadow-xl transition-shadow overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border-b">
              <CardTitle className="text-lg flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md">
                  <Building className="h-5 w-5 text-white" />
                </div>
                Sobre a Empresa
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-14 w-14 border-2 shadow-md">
                  <AvatarImage src={job.logo} />
                  <AvatarFallback className="bg-violet-100 text-violet-700 font-bold text-lg">
                    {job.company.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-bold text-lg">{job.company}</h4>
                  <p className="text-sm text-muted-foreground">{job.sector}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  <span>Setor: {job.sector}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA final */}
          {isJobActive && !alreadyApplied && (
            <Card className="shadow-lg border-2 border-indigo-200 dark:border-indigo-800 bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30">
              <CardContent className="p-6 text-center space-y-4">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto shadow-lg">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Interessado na vaga?</h3>
                  <p className="text-sm text-muted-foreground">
                    Envie sua candidatura agora mesmo!
                  </p>
                </div>
                <Button 
                  onClick={handleApply}
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg"
                  size="lg"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Candidatar-se
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Botão voltar */}
      <div className="pt-4">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="shadow-md hover:shadow-lg transition-all border-2 hover:border-primary/50 group"
          size="lg"
        >
          <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          Voltar para as vagas
        </Button>
      </div>
    </div>
  )
}
