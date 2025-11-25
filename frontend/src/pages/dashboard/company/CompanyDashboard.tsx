import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PlusCircle, Users, Briefcase, CheckCircle2, Eye, TrendingUp, FileText, Sparkles, Building2, Target, Zap, ArrowRight, Clock, Star, Award, BarChart3, UserCheck, CalendarDays } from 'lucide-react'
import { JobPublicationModal } from '@/components/dashboard/company/JobPublicationModal'
import { JobsTable } from '@/components/dashboard/company/JobsTable'
import { JobPostingFormValues } from '@/lib/schemas/job-posting-schema'
import { useToast } from '@/components/ui/use-toast'
import { publicarVaga, listarVagasEmpresa, atualizarVaga, fecharVaga, listarCandidaturasVaga } from '@/services/vagas'
import { useAuth } from '@/hooks/use-auth'
import { getCompanyStats } from '@/services/empresas'
import { Progress } from '@/components/ui/progress'

export default function CompanyDashboard() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [jobToEdit, setJobToEdit] = useState<any | null>(null)
  const [stats, setStats] = useState<{ totalJobs: number; activeJobs: number; closedJobs: number; totalApplications: number; totalViews: number; jobsByRegime: Record<string, number>; applicationsByStatus: Record<string, number> } | null>(null)
  const { toast } = useToast()

  const handleOpenEditModal = (job: any) => {
    // Converter dados da vaga para o formato do formulário
    console.log('[CompanyDashboard] Vaga original recebida:', job)
    console.log('[CompanyDashboard] Acessibilidades da vaga:', job.acessibilidades)
    
    // Processar acessibilidades para o formato esperado pelo formulário
    let accessibilities: string[] = []
    if (job.acessibilidades && Array.isArray(job.acessibilidades)) {
      accessibilities = job.acessibilidades.map((item: any) => {
        // Formato retornado do backend: { acessibilidade: { descricao: "..." } }
        if (item.acessibilidade && item.acessibilidade.descricao) {
          return item.acessibilidade.descricao
        }
        // Formato alternativo: { descricao: "..." }
        if (item.descricao) {
          return item.descricao
        }
        // Formato direto: "..."
        return item
      })
    }
    
    console.log('[CompanyDashboard] Acessibilidades processadas:', accessibilities)
    
    const jobForEdit = {
      ...job,
      title: job.titulo || job.title,
      description: job.descricao || job.description,
      type: job.tipo || job.type,
      regime: job.regimeTrabalho || job.regime,
      escolaridade: job.escolaridade,
      benefits: job.beneficios || job.benefits,
      accessibilities: accessibilities
    }
    console.log('[CompanyDashboard] Vaga formatada para edição:', jobForEdit)
    setJobToEdit(jobForEdit)
    setIsModalOpen(true)
  }

  const handleOpenCreateModal = () => {
    setJobToEdit(null)
    setIsModalOpen(true)
  }

  const handleCloseJob = async (jobId: string) => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) return
      
      await fecharVaga(token, Number(jobId))
      toast({
        title: 'Vaga fechada com sucesso!',
        description: 'A vaga não receberá mais candidaturas.',
      })
      await fetchJobs()
    } catch (err: any) {
      toast({ title: 'Erro ao fechar vaga', description: err.message, variant: 'destructive' })
    }
  }

  const handleJobSubmit = async (data: JobPostingFormValues) => {
    console.log('[CompanyDashboard] handleJobSubmit INICIADO')
    console.log('[CompanyDashboard] Dados recebidos:', data)
    try {
      const token = localStorage.getItem('auth_token')
      console.log('[CompanyDashboard] Token:', token ? 'presente' : 'ausente')
      console.log('[CompanyDashboard] User:', user)
      console.log('[CompanyDashboard] EmpresaId:', user?.empresaId)
      if (!user || !token) throw new Error('Usuário não autenticado')
      if (!user.empresaId) {
        toast({
          title: 'Complete seu perfil primeiro',
          description: 'Você precisa completar o cadastro da empresa antes de publicar vagas.',
          variant: 'destructive',
        })
        return
      }
      if (jobToEdit) {
        // Editando vaga existente
        await atualizarVaga(token, Number(jobToEdit.id), {
          titulo: data.title,
          descricao: data.description,
          escolaridade: data.escolaridade,
          tipo: data.type,
          regimeTrabalho: data.regime,
          beneficios: data.benefits,
          acessibilidades: data.accessibilities,
        })
        toast({
          title: 'Vaga atualizada com sucesso!',
          description: `A vaga "${data.title}" foi atualizada.`,
        })
      } else {
        // Criando nova vaga
        console.log('[CompanyDashboard] Chamando publicarVaga...')
        const result = await publicarVaga(data, token, user.empresaId)
        console.log('[CompanyDashboard] Vaga publicada, resultado:', result)
        toast({
          title: 'Vaga publicada com sucesso!',
          description: `A vaga "${data.title}" agora está visível para candidatos.`,
        })
      }
      console.log('[CompanyDashboard] Atualizando lista de vagas...')
      await fetchJobs()
      console.log('[CompanyDashboard] Lista atualizada, fechando modal')
      setIsModalOpen(false)
      console.log('[CompanyDashboard] handleJobSubmit CONCLUÍDO')
    } catch (err: any) {
      console.error('[CompanyDashboard] ERRO ao publicar vaga:', err)
      toast({ title: 'Erro ao publicar vaga', description: err.message, variant: 'destructive' })
    }
  }

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!user || !token) return
      if (!user.empresaId) {
        console.log('[CompanyDashboard] Usuário sem empresaId')
        return
      }
      const data = await listarVagasEmpresa(token, user.empresaId)
      console.log('[CompanyDashboard] Vagas carregadas:', data)
      
      // Carregar número de candidaturas para cada vaga
      const jobsWithApplications = await Promise.all(
        data.map(async (job: any) => {
          try {
            const candidaturas = await listarCandidaturasVaga(token, job.id)
            return { ...job, applications: candidaturas.length }
          } catch (error) {
            console.error(`Erro ao carregar candidaturas da vaga ${job.id}:`, error)
            return { ...job, applications: 0 }
          }
        })
      )
      
      setJobs(jobsWithApplications)
    } catch (err: any) {
      toast({ title: 'Erro ao carregar vagas', description: err.message, variant: 'destructive' })
    }
  }

  useEffect(() => {
    fetchJobs()
    fetchStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!user || !token || !user.empresaId) return
      const data = await getCompanyStats(token, user.empresaId)
      setStats(data)
    } catch (err: any) {
      console.error('[CompanyDashboard] Erro ao buscar estatísticas:', err.message)
    }
  }



  return (
    <>
      <div className="space-y-8 pb-8">
        {/* Hero Header Premium */}
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl border border-border/30 shadow-2xl">
          {/* Background gradiente */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700" />
          
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid-company" width="32" height="32" patternUnits="userSpaceOnUse">
                  <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-company)" />
            </svg>
          </div>
          
          {/* Elementos decorativos flutuantes */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse" />
          <div className="absolute -left-10 top-1/2 h-48 w-48 rounded-full bg-cyan-500/20 blur-2xl" />
          <div className="absolute right-1/4 bottom-0 h-32 w-32 rounded-full bg-pink-400/20 blur-xl" />
          
          {/* Ícones decorativos */}
          <div className="absolute top-6 right-8 opacity-20 hidden sm:block">
            <Sparkles className="h-8 w-8 text-white animate-pulse" />
          </div>
          <div className="absolute bottom-8 left-8 opacity-15 hidden sm:block">
            <Star className="h-10 w-10 text-white" />
          </div>
          
          <div className="relative px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12 lg:py-14">
            <div className="flex flex-col gap-6 lg:gap-8">
              {/* Informações da empresa */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
                <div className="flex items-center gap-4 sm:gap-6">
                  {/* Avatar da empresa */}
                  <div className="relative group">
                    <div className="absolute -inset-1 rounded-xl sm:rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 opacity-70 blur group-hover:opacity-100 transition-opacity" />
                    <div className="relative h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-2xl ring-2 sm:ring-4 ring-white/20">
                      <Building2 className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white" />
                    </div>
                  </div>
                  
                  <div className="space-y-1 sm:space-y-2">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight drop-shadow-lg">
                        Olá, {user?.name || 'Empresa'}!
                      </h1>
                      {(stats?.activeJobs ?? 0) > 0 && (
                        <Badge className="bg-emerald-500/20 text-emerald-200 border-emerald-400/30 backdrop-blur-sm text-xs">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Ativo
                        </Badge>
                      )}
                    </div>
                    <p className="text-white/70 text-sm sm:text-base lg:text-lg max-w-xl">
                      Gerencie suas vagas e encontre os melhores talentos com acessibilidade
                    </p>
                  </div>
                </div>
                
                {/* Botão de ação */}
                <Button 
                  onClick={handleOpenCreateModal}
                  size="lg"
                  className="w-full sm:w-auto bg-white text-indigo-600 hover:bg-white/90 shadow-xl shadow-black/20 h-12 sm:h-14 px-6 sm:px-8 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base transition-all hover:scale-[1.02]"
                >
                  <PlusCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Publicar Nova Vaga
                </Button>
              </div>
            
              {/* Stats Cards dentro do Hero */}
            <div className="mt-6 sm:mt-8 lg:mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-3 sm:p-4 lg:p-5 transition-all hover:bg-white/20">
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg">
                    <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                      {stats?.activeJobs ?? jobs.filter((j) => j?.isActive === true || j?.status === 'Ativa').length}
                    </p>
                    <p className="text-[10px] sm:text-xs lg:text-sm text-white/60">Vagas Ativas</p>
                  </div>
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                  <ArrowRight className="h-4 w-4 text-white/50" />
                </div>
              </div>
              
              <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-3 sm:p-4 lg:p-5 transition-all hover:bg-white/20">
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                      {stats?.totalApplications ?? jobs.reduce((acc, j) => acc + (j?.applications || 0), 0)}
                    </p>
                    <p className="text-[10px] sm:text-xs lg:text-sm text-white/60">Candidaturas</p>
                  </div>
                </div>
              </div>
              
              <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-3 sm:p-4 lg:p-5 transition-all hover:bg-white/20">
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-lg">
                    <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{stats?.totalViews ?? 0}</p>
                    <p className="text-[10px] sm:text-xs lg:text-sm text-white/60">Visualizações</p>
                  </div>
                </div>
              </div>
              
              <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-3 sm:p-4 lg:p-5 transition-all hover:bg-white/20">
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                    <Target className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{stats?.totalJobs ?? jobs.length}</p>
                    <p className="text-[10px] sm:text-xs lg:text-sm text-white/60">Total de Vagas</p>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* Cards de Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Card Match de Acessibilidade */}
          <Card className="border-0 shadow-xl overflow-hidden bg-gradient-to-br from-background to-background/80 group hover:shadow-2xl transition-all">
            <CardHeader className="bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border-b border-border/50 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                  <UserCheck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">Match de Acessibilidade</CardTitle>
                  <CardDescription>Candidatos compatíveis</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-end gap-4">
                <div className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  17
                </div>
                <div className="pb-2">
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +5 esta semana
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Candidatos com perfil de acessibilidade compatível com suas vagas
              </p>
              <div className="mt-4 pt-4 border-t border-border/50">
                <Button variant="ghost" className="w-full justify-between group/btn hover:bg-emerald-500/10">
                  Ver candidatos compatíveis
                  <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Card Atalhos Rápidos */}
          <Card className="border-0 shadow-xl overflow-hidden bg-gradient-to-br from-background to-background/80">
            <CardHeader className="bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-transparent border-b border-border/50 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">Ações Rápidas</CardTitle>
                  <CardDescription>Acesse rapidamente</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start h-12 rounded-xl border-2 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group"
                asChild
              >
                <a href="#vagas-table">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center mr-3 group-hover:bg-blue-500/20 transition-colors">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-medium">Gerenciar vagas</span>
                </a>
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start h-12 rounded-xl border-2 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group"
                asChild
              >
                <a href="#vagas-table">
                  <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center mr-3 group-hover:bg-indigo-500/20 transition-colors">
                    <Users className="h-4 w-4 text-indigo-600" />
                  </div>
                  <span className="font-medium">Ver currículos</span>
                </a>
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start h-12 rounded-xl border-2 hover:border-violet-500/50 hover:bg-violet-500/5 transition-all group"
                onClick={handleOpenCreateModal}
              >
                <div className="h-8 w-8 rounded-lg bg-violet-500/10 flex items-center justify-center mr-3 group-hover:bg-violet-500/20 transition-colors">
                  <PlusCircle className="h-4 w-4 text-violet-600" />
                </div>
                <span className="font-medium">Nova vaga</span>
              </Button>
            </CardContent>
          </Card>

          {/* Card Status das Vagas */}
          <Card className="border-0 shadow-xl overflow-hidden bg-gradient-to-br from-background to-background/80">
            <CardHeader className="bg-gradient-to-r from-violet-500/10 via-purple-500/5 to-transparent border-b border-border/50 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">Status das Vagas</CardTitle>
                  <CardDescription>Visão geral</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-emerald-500" />
                    <span className="text-sm font-medium">Vagas Abertas</span>
                  </div>
                  <span className="text-lg font-bold text-emerald-600">{stats?.activeJobs ?? 0}</span>
                </div>
                <Progress 
                  value={stats?.totalJobs ? (stats.activeJobs / stats.totalJobs) * 100 : 0} 
                  className="h-2 bg-emerald-100 dark:bg-emerald-950"
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-gray-400" />
                    <span className="text-sm font-medium">Vagas Fechadas</span>
                  </div>
                  <span className="text-lg font-bold text-muted-foreground">{stats?.closedJobs ?? 0}</span>
                </div>
                <Progress 
                  value={stats?.totalJobs ? (stats.closedJobs / stats.totalJobs) * 100 : 0} 
                  className="h-2"
                />
              </div>
              
              <div className="pt-4 border-t border-border/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Taxa de preenchimento</span>
                  <span className="font-semibold text-violet-600">
                    {stats?.totalJobs ? Math.round((stats.closedJobs / stats.totalJobs) * 100) : 0}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dicas e Insights */}
        {(stats?.activeJobs ?? 0) === 0 && (
          <Card className="border-0 shadow-xl overflow-hidden bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-yellow-500/10">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg flex-shrink-0">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">Comece a atrair talentos!</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Publique sua primeira vaga e conecte-se com candidatos qualificados que buscam empresas inclusivas como a sua.
                  </p>
                  <Button 
                    onClick={handleOpenCreateModal}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-lg"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Publicar Primeira Vaga
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabela de Vagas */}
        <div id="vagas-table">
          <JobsTable
            jobs={jobs}
            onEdit={handleOpenEditModal}
            onClose={handleCloseJob}
          />
        </div>
      </div>
      
      <JobPublicationModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onJobSubmit={handleJobSubmit}
        jobToEdit={jobToEdit}
      />
    </>
  )
}
