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
import { MoreHorizontal, Search, Calendar, Users, Eye, Briefcase, Edit, XCircle, FileText, MapPin, GraduationCap, Gift, Sparkles, TrendingUp, ArrowRight, Clock, CheckCircle2 } from 'lucide-react'
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
      {/* Header da seção */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-indigo-600" />
            Gerenciar Vagas
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'vaga encontrada' : 'vagas encontradas'}
          </p>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar vagas..."
            className="pl-10 h-12 rounded-xl border-2 focus:border-indigo-500/50 transition-all"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredJobs.map((job) => {
            const isActive = job.status === 'Ativa' || job.isActive
            
            return (
              <Card 
                key={job.id} 
                className={`group relative overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col ${
                  isActive 
                    ? 'bg-gradient-to-br from-background to-background/80' 
                    : 'bg-gradient-to-br from-muted/50 to-muted/30'
                }`}
              >
                {/* Decoração superior */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${
                  isActive 
                    ? 'bg-gradient-to-r from-emerald-500 via-blue-500 to-violet-500' 
                    : 'bg-gradient-to-r from-gray-400 to-gray-500'
                }`} />

                {/* Header com Gradiente */}
                <div className={`relative p-6 pb-8 ${
                  isActive 
                    ? 'bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-600' 
                    : 'bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700'
                }`}>
                  {/* Pattern overlay */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,white,transparent)]" />
                  </div>
                  
                  {/* Status Badge - Canto Superior */}
                  <div className="absolute top-4 right-4 z-10">
                    <Badge
                      className={`shadow-lg backdrop-blur-sm ${
                        isActive
                          ? 'bg-emerald-500/90 hover:bg-emerald-600 text-white border-0'
                          : 'bg-gray-500/90 hover:bg-gray-600 text-white border-0'
                      }`}
                    >
                      {isActive ? (
                        <>
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Ativa
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 mr-1" />
                          Fechada
                        </>
                      )}
                    </Badge>
                  </div>
                  
                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 mb-4 shadow-lg group-hover:scale-110 transition-transform">
                      <Briefcase className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white leading-tight mb-2 pr-20 line-clamp-2 drop-shadow-sm">
                      {getTitle(job)}
                    </h3>
                    <div className="flex items-center gap-2 text-white/70 text-sm">
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
                  <div className="space-y-2.5 pt-3 border-t border-border/50">
                    {job.type && (
                      <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                          <Briefcase className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Tipo</span>
                          <p className="font-medium text-sm">{job.type}</p>
                        </div>
                      </div>
                    )}
                    {job.regime && (
                      <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 border border-indigo-500/20">
                          <MapPin className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Regime</span>
                          <p className="font-medium text-sm">{job.regime}</p>
                        </div>
                      </div>
                    )}
                    {job.escolaridade && (
                      <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20">
                          <GraduationCap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Escolaridade</span>
                          <p className="font-medium text-xs">{job.escolaridade}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Métricas */}
                  <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-bold text-blue-700 dark:text-blue-300">{job.applications || 0}</span>
                      <span className="text-xs text-blue-600/70">candidatos</span>
                    </div>
                    {(job as any).views !== undefined && (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                        <Eye className="h-4 w-4 text-violet-600" />
                        <span className="text-sm font-bold text-violet-700 dark:text-violet-300">{(job as any).views || 0}</span>
                        <span className="text-xs text-violet-600/70">views</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer com Ações */}
                <div className="p-4 bg-muted/30 border-t border-border/50 flex items-center justify-between gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => navigate(`/dashboard/empresa/vagas/${job.id}/candidatos`)}
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-md"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Ver Candidatos
                  </Button>
                  
                  <AlertDialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="px-3 border-2 hover:border-indigo-500/50">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl border-2">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => navigate(`/dashboard/empresa/vagas/${job.id}`)}
                          className="rounded-lg"
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Ver Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(job)} className="rounded-lg">
                          <Edit className="mr-2 h-4 w-4" />
                          Editar Vaga
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem className="text-destructive focus:text-destructive rounded-lg">
                            <XCircle className="mr-2 h-4 w-4" />
                            Fechar Vaga
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialogContent className="rounded-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Fechar vaga "{getTitle(job)}"?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta vaga não aceitará mais candidaturas. Você pode reabri-la posteriormente se necessário.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onClose(job.id)} className="rounded-xl bg-destructive hover:bg-destructive/90">
                          Confirmar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="p-16 text-center border-2 border-dashed border-indigo-500/30 bg-gradient-to-br from-indigo-500/5 to-violet-500/5">
          <div className="flex flex-col items-center gap-6 max-w-md mx-auto">
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-indigo-500/20 to-violet-500/20 blur-xl" />
              <div className="relative rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-950 dark:to-violet-950 p-8">
                <Briefcase className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Nenhuma vaga encontrada</h3>
              <p className="text-muted-foreground">
                {filter
                  ? 'Tente ajustar o filtro ou criar uma nova vaga.'
                  : 'Comece publicando sua primeira vaga para atrair candidatos qualificados.'}
              </p>
            </div>
            {!filter && (
              <Button className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-lg h-12 px-6 rounded-xl">
                <Sparkles className="mr-2 h-5 w-5" />
                Publicar Primeira Vaga
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
