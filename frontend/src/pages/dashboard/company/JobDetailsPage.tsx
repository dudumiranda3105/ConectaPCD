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
  Clock,
  DollarSign,
  Sparkles,
  Target,
  Accessibility,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { listarVagasEmpresa, fecharVaga, listarCandidaturasVaga } from '@/services/vagas'

// Helper para obter iniciais da empresa
function getCompanyInitials(name: string): string {
  if (!name) return 'E'
  const words = name.trim().split(' ').filter(w => w.length > 0)
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase()
  }
  return (words[0][0] + words[1][0]).toUpperCase()
}

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header Fixo com Glassmorphism */}
      <div className="sticky top-0 z-50 px-6 py-4 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/dashboard/empresa" className="flex items-center gap-1.5 hover:text-primary transition-colors text-sm">
                    <Building2 className="h-4 w-4" />
                    Minhas Vagas
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold text-sm">{job.titulo || 'Detalhes da Vaga'}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard/empresa')}
            className="gap-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* Hero Card da Vaga */}
        <Card className="overflow-hidden border-0 shadow-2xl bg-white dark:bg-slate-900 relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 h-48" />
          <div className="absolute inset-0 h-48 opacity-20">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-white rounded-full blur-3xl" />
            <div className="absolute top-10 left-1/3 w-40 h-40 bg-blue-300 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-violet-300 rounded-full blur-3xl" />
          </div>
          
          {/* Conteúdo do Hero */}
          <div className="relative px-8 pt-8 pb-6 text-white">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
              <div className="flex items-start gap-5">
                {/* Avatar da Empresa com Foto ou Iniciais */}
                <Avatar className="h-20 w-20 rounded-2xl shadow-2xl border-2 border-white/30 hover:scale-105 transition-transform duration-300">
                  <AvatarImage 
                    src={job.empresa?.companyData?.logoUrl || job.empresa?.logoUrl} 
                    alt={job.empresa?.nomeFantasia || job.empresa?.nome || 'Empresa'}
                    className="object-cover"
                  />
                  <AvatarFallback className="rounded-2xl bg-white/20 backdrop-blur-xl text-white text-2xl font-bold">
                    {getCompanyInitials(job.empresa?.nomeFantasia || job.empresa?.razaoSocial || job.empresa?.nome || user?.name || 'Empresa')}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl lg:text-4xl font-bold drop-shadow-lg">{job.titulo}</h1>
                    <Badge
                      variant={isJobActive ? 'default' : 'secondary'}
                      className={
                        isJobActive
                          ? 'bg-emerald-500/90 text-white hover:bg-emerald-600 border-0 shadow-lg px-4 py-1.5 text-sm font-semibold'
                          : 'bg-slate-500/90 text-white hover:bg-slate-600 border-0 px-4 py-1.5 text-sm'
                      }
                    >
                      <div className={`h-2 w-2 rounded-full mr-2 ${isJobActive ? 'bg-emerald-200 animate-pulse' : 'bg-slate-300'}`} />
                      {isJobActive ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-blue-100">
                    <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                      <CalendarDays className="h-4 w-4" />
                      <span className="text-sm font-medium">Publicada em {new Date(job.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                    {job.regimeTrabalho && (
                      <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm font-medium">{job.regimeTrabalho}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Botões de Ação */}
              <div className="flex items-center gap-3 w-full lg:w-auto">
                <Button
                  size="lg"
                  className="bg-white text-indigo-700 hover:bg-white/90 shadow-xl h-12 font-semibold hover:shadow-2xl transition-all duration-300 flex-1 lg:flex-none"
                  onClick={() => navigate(`/dashboard/empresa/vagas/${job.id}/candidatos`)}
                >
                  <Users className="mr-2 h-5 w-5" />
                  Ver Candidatos
                  <Badge className="ml-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-0 font-bold text-base px-3">
                    {job.applications || 0}
                  </Badge>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="lg"
                      variant="secondary"
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm shadow-xl h-12 hover:shadow-2xl transition-all duration-300"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 shadow-xl border-0">
                    <DropdownMenuLabel className="font-semibold">Ações da Vaga</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/dashboard/empresa')} className="cursor-pointer">
                      <Edit className="mr-2 h-4 w-4" />
                      Editar Vaga
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate(`/dashboard/empresa/vagas/${job.id}/candidatos`)} className="cursor-pointer">
                      <Users className="mr-2 h-4 w-4" />
                      Ver Candidatos
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4" />
                      Exportar Dados
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {isJobActive && (
                      <DropdownMenuItem
                        onClick={handleCloseJob}
                        className="text-destructive focus:text-destructive cursor-pointer"
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
          
          {/* Cards de Métricas - Dentro do Hero */}
          <div className="relative px-8 pb-8 -mt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="group bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-lg border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Candidaturas</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{job.applications || 0}</p>
                    <p className="text-xs text-slate-400 mt-1">pessoas interessadas</p>
                  </div>
                  <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="group bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-lg border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Visualizações</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">{job.views || 0}</p>
                    <p className="text-xs text-slate-400 mt-1">vezes visualizada</p>
                  </div>
                  <div className="h-14 w-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Eye className="h-7 w-7 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="group bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-lg border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Conversão</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      {job.views > 0 ? Math.round((job.applications / job.views) * 100) : 0}%
                    </p>
                    <p className="text-xs text-slate-400 mt-1">taxa de interesse</p>
                  </div>
                  <div className="h-14 w-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-7 w-7 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Grid de Informações */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Coluna Principal - 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Descrição da Vaga */}
            <Card className="border-0 shadow-lg bg-white dark:bg-slate-900 overflow-hidden">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900">
                <CardTitle className="text-xl flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  Descrição da Vaga
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed text-base">
                  {job.descricao || 'Sem descrição disponível'}
                </p>
              </CardContent>
            </Card>

            {/* Acessibilidades Oferecidas */}
            <Card className="border-0 shadow-lg bg-white dark:bg-slate-900 overflow-hidden">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
                <CardTitle className="text-xl flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                    <Accessibility className="h-5 w-5 text-white" />
                  </div>
                  Acessibilidades Oferecidas
                  {job.acessibilidades && job.acessibilidades.length > 0 && (
                    <Badge className="ml-auto bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border-0 font-semibold">
                      {job.acessibilidades.length} recursos
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {job.acessibilidades && job.acessibilidades.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {job.acessibilidades.map((acc: any, index: number) => {
                      const descricao = acc.acessibilidade?.descricao || acc.descricao || acc;
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-100 dark:border-blue-900/50 hover:shadow-md transition-all duration-200"
                        >
                          <div className="h-8 w-8 rounded-lg bg-blue-500/15 flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="font-medium text-slate-700 dark:text-slate-200">{descricao}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="h-16 w-16 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                      <Accessibility className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                      Nenhuma acessibilidade específica informada
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      Edite a vaga para adicionar recursos de acessibilidade
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tipos de Deficiência Aceitos */}
            <Card className="border-0 shadow-lg bg-white dark:bg-slate-900 overflow-hidden">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30">
                <CardTitle className="text-xl flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-md">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  Tipos de Deficiência Aceitos
                  {job.subtiposAceitos && job.subtiposAceitos.length > 0 && (
                    <Badge className="ml-auto bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300 border-0 font-semibold">
                      {job.subtiposAceitos.length} {job.subtiposAceitos.length === 1 ? 'tipo' : 'tipos'}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {job.subtiposAceitos && job.subtiposAceitos.length > 0 ? (
                  <div className="space-y-5">
                    {(() => {
                      const grouped = job.subtiposAceitos.reduce((acc: any, item: any) => {
                        const tipoNome = item.subtipo?.tipo?.nome || 'Outros'
                        if (!acc[tipoNome]) acc[tipoNome] = []
                        acc[tipoNome].push(item.subtipo)
                        return acc
                      }, {})
                      
                      return Object.entries(grouped).map(([tipoNome, subtipos]: [string, any]) => (
                        <div key={tipoNome} className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-500" />
                            <h4 className="font-semibold text-rose-700 dark:text-rose-400">{tipoNome}</h4>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-5">
                            {subtipos.map((subtipo: any) => (
                              <div
                                key={subtipo.id}
                                className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 border border-rose-100 dark:border-rose-900/50"
                              >
                                <CheckCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                                <span className="font-medium text-slate-700 dark:text-slate-200 text-sm">{subtipo.nome}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    })()}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="h-16 w-16 mx-auto rounded-full bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center mb-4">
                      <Sparkles className="h-8 w-8 text-rose-400" />
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 font-medium">
                      Esta vaga aceita todos os tipos de deficiência
                    </p>
                    <p className="text-sm text-slate-400 mt-2">
                      Edite a vaga para especificar os tipos e melhorar o match com candidatos
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Coluna Lateral - 1/3 */}
          <div className="space-y-6">
            
            {/* Informações da Vaga */}
            <Card className="border-0 shadow-lg bg-white dark:bg-slate-900 overflow-hidden sticky top-24">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-500" />
                  Detalhes da Vaga
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                  <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tipo de Contrato</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-100 mt-1">{job.tipo || 'Não informado'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                  <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Escolaridade</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-100 mt-1">{job.escolaridade || 'Não informado'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                  <div className="h-10 w-10 bg-violet-100 dark:bg-violet-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Regime de Trabalho</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-100 mt-1">{job.regimeTrabalho || 'Não informado'}</p>
                  </div>
                </div>

                <Separator className="my-4" />
                
                {/* Benefícios */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-8 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center">
                      <Gift className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-100">Benefícios</h4>
                  </div>
                  {job.beneficios && job.beneficios.trim() ? (
                    <div className="flex flex-wrap gap-2">
                      {job.beneficios.split(',').map((benefit: string, index: number) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800 py-1.5 px-3 text-sm font-medium"
                        >
                          {benefit.trim()}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic">Nenhum benefício informado</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
