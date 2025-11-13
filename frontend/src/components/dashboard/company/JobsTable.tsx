import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { MoreHorizontal, Search } from 'lucide-react'
import { JobPostingFormValues } from '@/lib/schemas/job-posting-schema'

type Job = JobPostingFormValues & {
  id: string
  status: 'Ativa' | 'Pausada' | 'Fechada'
  applications: number
  createdAt: string
  // Campos do backend
  titulo?: string
  descricao?: string
  escolaridade?: string
  isActive?: boolean
}

interface JobsTableProps {
  jobs: Job[]
  onEdit: (job: Job) => void
  onClose: (jobId: string) => void
}

export const JobsTable = ({ jobs, onEdit, onClose }: JobsTableProps) => {
  const [filter, setFilter] = useState('')
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const navigate = useNavigate()

  const filteredJobs = jobs.filter((job) =>
    (job.title || job.descricao || '').toLowerCase().includes(filter.toLowerCase()),
  )

  const getTitle = (job: Job) => job.title || job.titulo || job.descricao || 'Sem título'
  const getDescricao = (job: Job) => job.description || job.descricao || ''
  const getDescricaoPreview = (job: Job, max = 80) => {
    const text = getDescricao(job)
    if (!text) return ''
    if (text.length <= max) return text
    return text.slice(0, max) + '...'
  }
  const toggleExpand = (id: string) => setExpanded((e) => ({ ...e, [id]: !e[id] }))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Filtrar por título..."
            className="pl-8"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Título</TableHead>
                <TableHead className="min-w-[240px]">Descrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Candidaturas</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead>
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{getTitle(job)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{expanded[job.id] ? getDescricao(job) : getDescricaoPreview(job)}</span>
                          {getDescricao(job) && getDescricao(job).length > 80 && (
                            <Button variant="link" className="p-0 h-auto" onClick={() => toggleExpand(job.id)}>
                              {expanded[job.id] ? 'ver menos' : 'ver mais'}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            (job.status === 'Ativa' || job.isActive) ? 'default' : 'secondary'
                          }
                        >
                          {job.status || (job.isActive ? 'Ativa' : 'Inativa')}
                        </Badge>
                      </TableCell>
                      <TableCell>{job.applications || 0}</TableCell>
                      <TableCell>
                        {job.createdAt ? new Date(job.createdAt).toLocaleDateString('pt-BR') : '-'}
                      </TableCell>
                      <TableCell>
                        <AlertDialog>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(
                                    `/dashboard/empresa/vagas/${job.id}/candidatos`,
                                  )
                                }
                              >
                                Ver Candidatos
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onEdit(job)}>
                                Editar Vaga
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-destructive">
                                  Fechar Vaga
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Tem certeza que deseja fechar esta vaga?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não poderá ser desfeita. A vaga não
                                aceitará novas candidaturas.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => onClose(job.id)}>
                                Confirmar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Nenhuma vaga encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
