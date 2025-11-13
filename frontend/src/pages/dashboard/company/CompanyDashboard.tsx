import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle, Users } from 'lucide-react'
import { JobPublicationModal } from '@/components/dashboard/company/JobPublicationModal'
import { JobsTable } from '@/components/dashboard/company/JobsTable'
import { JobPostingFormValues } from '@/lib/schemas/job-posting-schema'
import { useToast } from '@/components/ui/use-toast'
import { publicarVaga, listarVagasEmpresa, atualizarVaga, fecharVaga, listarCandidaturasVaga } from '@/services/vagas'
import { useAuth } from '@/hooks/use-auth'

export default function CompanyDashboard() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [jobToEdit, setJobToEdit] = useState<any | null>(null)
  const { toast } = useToast()

  const handleOpenEditModal = (job: any) => {
    // Converter dados da vaga para o formato do formulário
    const jobForEdit = {
      ...job,
      title: job.titulo || job.title,
      description: job.descricao || job.description,
      type: job.tipo || job.type,
      regime: job.regimeTrabalho || job.regime,
      escolaridade: job.escolaridade,
      benefits: job.beneficios || job.benefits,
      accessibilities: job.acessibilidades 
        ? job.acessibilidades.map((item: any) => 
            item.acessibilidade?.descricao || item.descricao || item
          )
        : []
    }
    console.log('[CompanyDashboard] Editando vaga:', jobForEdit)
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
    try {
      const token = localStorage.getItem('auth_token')
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
        await publicarVaga(data, token, user.empresaId)
        toast({
          title: 'Vaga publicada com sucesso!',
          description: `A vaga "${data.title}" agora está visível para candidatos.`,
        })
      }
      await fetchJobs()
    } catch (err: any) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])



  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Minhas Vagas</h1>
            <p className="text-muted-foreground">
              Gerencie suas vagas e acompanhe as candidaturas.
            </p>
          </div>
          <Button onClick={handleOpenCreateModal}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Publicar vaga
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Match de Acessibilidade
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">17</div>
            <p className="text-xs text-muted-foreground">
              candidatos têm match de acessibilidade com suas vagas.
            </p>
          </CardContent>
        </Card>

        <JobsTable
          jobs={jobs}
          onEdit={handleOpenEditModal}
          onClose={handleCloseJob}
        />
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
