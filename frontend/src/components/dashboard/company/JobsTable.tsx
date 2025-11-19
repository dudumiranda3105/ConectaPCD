import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { Card } from '@/components/ui/card'
import { MoreHorizontal, Search, Calendar, Users, Eye, Briefcase, Edit, XCircle, FileText, MapPin, GraduationCap, Gift } from 'lucide-react'
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gerenciar Vagas</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'vaga encontrada' : 'vagas encontradas'}
          </p>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar vagas..."
            className="pl-9 h-10"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <Card 
              key={job.id} 
              className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl flex flex-col"
            >
              {/* Status Badge - Canto Superior */}
              <div className="absolute top-4 right-4 z-10">
                <Badge
                  variant={(job.status === 'Ativa' || job.isActive) ? 'default' : 'secondary'}
                  className={`shadow-lg ${
                    (job.status === 'Ativa' || job.isActive)
                      ? 'bg-green-500 hover:bg-green-600 text-white border-0'
                      : 'bg-gray-400 hover:bg-gray-500 text-white border-0'
                  }`}
                >
                  {job.status || (job.isActive ? 'Ativa' : 'Inativa')}
                </Badge>
              </div>

              {/* Header com Gradiente */}
              <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-6 pb-8">
                <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(0deg,transparent,white)]"></div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 mb-4 shadow-lg">
                    <Briefcase className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white leading-tight mb-2 pr-20 line-clamp-2">
                    {getTitle(job)}
                  </h3>
                  <div className="flex items-center gap-2 text-blue-100 text-sm">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {job.createdAt ? new Date(job.createdAt).toLocaleDateString('pt-BR') : '-'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Conteúdo */}
              <div className="flex-1 p-6 space-y-4">
                {/* Descrição */}
                <p className="text-sm text-muted-foreground line-clamp-3 min-h-[60px]">
                  {getDescricao(job) || 'Sem descrição disponível'}
                </p>

                {/* Detalhes */}
                <div className="space-y-2.5 pt-2 border-t">
                  {job.type && (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950">
                        <Briefcase className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-muted-foreground">Tipo:</span>
                      <span className="font-medium">{job.type}</span>
                    </div>
                  )}
                  {job.regime && (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950">
                        <MapPin className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <span className="text-muted-foreground">Regime:</span>
                      <span className="font-medium">{job.regime}</span>
                    </div>
                  )}
                  {job.escolaridade && (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950">
                        <GraduationCap className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-muted-foreground">Escolaridade:</span>
                      <span className="font-medium text-xs">{job.escolaridade}</span>
                    </div>
                  )}
                </div>

                {/* Métricas */}
                <div className="flex items-center gap-4 pt-3 border-t">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-semibold">{job.applications || 0}</span>
                    <span className="text-xs text-muted-foreground">candidatos</span>
                  </div>
                  {(job as any).views !== undefined && (
                    <div className="flex items-center gap-1.5">
                      <Eye className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      <span className="text-sm font-semibold">{(job as any).views || 0}</span>
                      <span className="text-xs text-muted-foreground">views</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer com Ações */}
              <div className="p-4 bg-muted/50 border-t flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/dashboard/empresa/vagas/${job.id}/candidatos`)}
                  className="flex-1"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Candidatos
                </Button>
                
                <AlertDialog>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="px-3">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => navigate(`/dashboard/empresa/vagas/${job.id}`)}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Ver Detalhes
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(job)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar Vaga
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          <XCircle className="mr-2 h-4 w-4" />
                          Fechar Vaga
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Fechar vaga "{getTitle(job)}"?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta vaga não aceitará mais candidaturas. Você pode reabri-la posteriormente se necessário.
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
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-16 text-center border-2 border-dashed">
          <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
            <div className="rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 p-6">
              <Briefcase className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Nenhuma vaga encontrada</h3>
              <p className="text-sm text-muted-foreground">
                {filter
                  ? 'Tente ajustar o filtro ou criar uma nova vaga.'
                  : 'Comece publicando sua primeira vaga para atrair candidatos qualificados.'}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
