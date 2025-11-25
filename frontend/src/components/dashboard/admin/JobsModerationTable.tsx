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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import { adminService } from '@/services/adminService'
import { CheckCircle, XCircle, Briefcase, Loader2, AlertCircle, Eye, Building2 } from 'lucide-react'

type JobStatus = 'Pendente' | 'Aprovada' | 'Reprovada'
type Job = {
  id: string
  title: string
  company: string
  posted: string
  status: JobStatus
}

interface JobsModerationTableProps {
  searchTerm?: string
}

export const JobsModerationTable = ({ searchTerm = '' }: JobsModerationTableProps) => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await adminService.getJobsForModeration()
        setJobs(data)
      } catch (err) {
        setError('Erro ao carregar vagas. Tente novamente.')
        console.error('Erro ao carregar vagas:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  const filteredJobs = jobs.filter((job) => {
    const search = searchTerm.toLowerCase()
    return (
      job.title?.toLowerCase().includes(search) ||
      job.company?.toLowerCase().includes(search)
    )
  })

  const handleStatusChange = async (jobId: string, newStatus: 'Aprovada' | 'Reprovada') => {
    setProcessingId(jobId)
    try {
      await adminService.moderateJob(jobId, newStatus)
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === jobId ? { ...job, status: newStatus } : job,
        ),
      )
      toast({
        title: newStatus === 'Aprovada' ? '✅ Vaga aprovada!' : '❌ Vaga reprovada',
        description: `A vaga foi ${newStatus === 'Aprovada' ? 'aprovada' : 'reprovada'} com sucesso.`,
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status da vaga.',
        variant: 'destructive',
      })
    } finally {
      setProcessingId(null)
    }
  }

  const getInitials = (name: string) => {
    if (!name) return 'E'
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  const getStatusConfig = (status: JobStatus) => {
    switch (status) {
      case 'Aprovada':
        return {
          bg: 'bg-emerald-100 dark:bg-emerald-950/50',
          text: 'text-emerald-700 dark:text-emerald-300',
          border: 'border-emerald-200 dark:border-emerald-800',
          dot: 'bg-emerald-500',
        }
      case 'Pendente':
        return {
          bg: 'bg-amber-100 dark:bg-amber-950/50',
          text: 'text-amber-700 dark:text-amber-300',
          border: 'border-amber-200 dark:border-amber-800',
          dot: 'bg-amber-500',
        }
      case 'Reprovada':
        return {
          bg: 'bg-rose-100 dark:bg-rose-950/50',
          text: 'text-rose-700 dark:text-rose-300',
          border: 'border-rose-200 dark:border-rose-800',
          dot: 'bg-rose-500',
        }
      default:
        return {
          bg: 'bg-slate-100 dark:bg-slate-950/50',
          text: 'text-slate-700 dark:text-slate-300',
          border: 'border-slate-200 dark:border-slate-800',
          dot: 'bg-slate-500',
        }
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center animate-pulse">
          <Briefcase className="h-8 w-8 text-white" />
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Carregando vagas...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="h-16 w-16 rounded-2xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-rose-500" />
        </div>
        <p className="text-rose-500 font-medium">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Tentar novamente
        </Button>
      </div>
    )
  }

  if (filteredJobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
          <Briefcase className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">
          {searchTerm ? 'Nenhuma vaga encontrada para a busca.' : 'Nenhuma vaga para moderar.'}
        </p>
      </div>
    )
  }

  return (
    <div className="relative w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="min-w-[250px] font-semibold">Vaga</TableHead>
            <TableHead className="min-w-[200px] font-semibold">Empresa</TableHead>
            <TableHead className="font-semibold">Data de Publicação</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="text-right min-w-[200px] font-semibold">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredJobs.map((job) => {
            const statusConfig = getStatusConfig(job.status)
            const isProcessing = processingId === job.id
            
            return (
              <TableRow 
                key={job.id}
                className="group transition-colors hover:bg-purple-50/50 dark:hover:bg-purple-950/20"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{job.title}</p>
                      <p className="text-sm text-muted-foreground">ID: {job.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border border-border">
                      <AvatarFallback className="bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 text-xs">
                        {getInitials(job.company)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-foreground">{job.company}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(job.posted).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border`}
                    variant="outline"
                  >
                    <span className={`mr-1.5 h-2 w-2 rounded-full ${statusConfig.dot}`} />
                    {job.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {job.status === 'Pendente' && (
                      <>
                        <Button
                          size="sm"
                          className="bg-emerald-500 hover:bg-emerald-600 text-white"
                          onClick={() => handleStatusChange(job.id, 'Aprovada')}
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Aprovar
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleStatusChange(job.id, 'Reprovada')}
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 mr-1" />
                              Reprovar
                            </>
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
