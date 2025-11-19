import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { adminService } from '@/services/adminService'

type JobStatus = 'Pendente' | 'Aprovada' | 'Reprovada'
type Job = {
  id: string
  title: string
  company: string
  posted: string
  status: JobStatus
}

export const JobsModerationTable = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await adminService.getJobsForModeration()
        setJobs(data)
      } catch (error) {
        console.error('Erro ao carregar vagas:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  const handleStatusChange = async (jobId: string, newStatus: JobStatus) => {
    try {
      await adminService.moderateJob(jobId, newStatus)
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === jobId ? { ...job, status: newStatus } : job,
        ),
      )
      toast({
        title: `Vaga ${newStatus.toLowerCase()}`,
        description: `A vaga foi marcada como ${newStatus.toLowerCase()}.`,
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status da vaga.',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return <div className="p-4">Carregando vagas...</div>
  }

  return (
    <div className="relative w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px]">Título da Vaga</TableHead>
            <TableHead className="min-w-[150px]">Empresa</TableHead>
            <TableHead>Data de Publicação</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right min-w-[180px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell className="font-medium">{job.title}</TableCell>
              <TableCell>{job.company}</TableCell>
              <TableCell>
                {new Date(job.posted).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    job.status === 'Aprovada'
                      ? 'default'
                      : job.status === 'Pendente'
                        ? 'secondary'
                        : 'destructive'
                  }
                >
                  {job.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  {job.status === 'Pendente' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(job.id, 'Aprovada')}
                      >
                        Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleStatusChange(job.id, 'Reprovada')}
                      >
                        Reprovar
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
