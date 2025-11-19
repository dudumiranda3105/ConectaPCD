import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle, Users, Briefcase, CheckCircle2, Eye, TrendingUp, FileText } from 'lucide-react'
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
      <div className="space-y-6">
        {/* Header com gradiente e resumo */}
        <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-indigo-600 via-indigo-500 to-sky-500 text-white">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -left-10 -bottom-10 h-44 w-44 rounded-full bg-white/10 blur-xl" />
          <div className="relative p-4 sm:p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
                  Olá, {user?.name || 'empresa'}
                </h1>
                <p className="mt-1 text-sm sm:text-base text-indigo-50/90">
                  Gerencie suas vagas e acompanhe as candidaturas em tempo real.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="secondary" onClick={handleOpenCreateModal} className="w-full sm:w-auto">
                  <PlusCircle className="mr-2 h-4 w-4" /> Publicar vaga
                </Button>
              </div>
            </div>
            {/* Métricas principais */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Card className="shadow-sm">
                <CardHeader className="pb-2 px-4 pt-4 sm:px-6 sm:pt-6">
                  <CardTitle className="text-xs font-medium text-muted-foreground">Vagas ativas</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 px-4 pb-4 sm:px-6 sm:pb-6 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  <span className="text-xl font-semibold">
                    {stats?.activeJobs ?? jobs.filter((j) => (j?.isActive === true) || j?.status === 'Ativa').length}
                  </span>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardHeader className="pb-2 px-4 pt-4 sm:px-6 sm:pt-6">
                  <CardTitle className="text-xs font-medium text-muted-foreground">Candidaturas</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 px-4 pb-4 sm:px-6 sm:pb-6 flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-xl font-semibold">
                    {stats?.totalApplications ?? jobs.reduce((acc, j) => acc + (j?.applications || 0), 0)}
                  </span>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardHeader className="pb-2 px-4 pt-4 sm:px-6 sm:pt-6">
                  <CardTitle className="text-xs font-medium text-muted-foreground">Visualizações</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 px-4 pb-4 sm:px-6 sm:pb-6 flex items-center gap-2">
                  <Eye className="h-4 w-4 text-primary" />
                  <span className="text-xl font-semibold">{stats?.totalViews ?? 0}</span>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Linha de cards adicionais: Match, Atalhos e status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card adicional de match de acessibilidade */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Match de Acessibilidade</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">17</div>
              <p className="text-xs text-muted-foreground">
                candidatos têm match de acessibilidade com suas vagas.
              </p>
            </CardContent>
          </Card>

          {/* Card de Atalhos Rápidos */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Atalhos Rápidos</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button variant="outline" className="justify-start" asChild>
                <a href="#vagas-table">
                  <FileText className="mr-2 h-4 w-4" />
                  Gerenciar vagas
                </a>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <a href="#vagas-table">
                  <Users className="mr-2 h-4 w-4" />
                  Ver currículos
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Card de Status das vagas (aberto x fechado) */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Status das Vagas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Abertas</span>
                  <span className="font-semibold">{stats?.activeJobs ?? 0}</span>
                </div>
                <Progress value={stats?.totalJobs ? (stats.activeJobs / stats.totalJobs) * 100 : 0} className="h-2" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Fechadas</span>
                  <span className="font-semibold">{stats?.closedJobs ?? 0}</span>
                </div>
                <Progress value={stats?.totalJobs ? (stats.closedJobs / stats.totalJobs) * 100 : 0} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

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
