import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { JobsModerationTable } from '@/components/dashboard/admin/JobsModerationTable'
import { Briefcase, Search, CheckCircle2, Clock, XCircle, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { adminService } from '@/services/adminService'

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const jobs = await adminService.getJobsForModeration()
        const approved = jobs.filter((j: any) => j.status === 'Aprovada').length
        const pending = jobs.filter((j: any) => j.status === 'Pendente').length
        const rejected = jobs.filter((j: any) => j.status === 'Reprovada').length
        setStats({
          total: jobs.length,
          approved,
          pending,
          rejected,
        })
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 shadow-2xl">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-purple-300/20 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>
        
        <div className="relative px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/20">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Moderação de Vagas
                </h1>
                <p className="text-white/70 mt-1">
                  Aprove ou reprove as vagas enviadas pelas empresas
                </p>
              </div>
            </div>
            
            {stats.pending > 0 && (
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-300" />
                  <span className="text-white font-medium">
                    {stats.pending} vaga{stats.pending > 1 ? 's' : ''} aguardando
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2 border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-purple-500 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                ) : (
                  <p className="text-3xl font-bold text-purple-600">{stats.total}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-500 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Aprovadas</p>
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                ) : (
                  <p className="text-3xl font-bold text-emerald-600">{stats.approved}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-amber-500 flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
                ) : (
                  <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-rose-500 flex items-center justify-center">
                <XCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reprovadas</p>
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-rose-600" />
                ) : (
                  <p className="text-3xl font-bold text-rose-600">{stats.rejected}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table Card */}
      <Card className="border-2 shadow-lg overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500" />
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-xl">Vagas Publicadas</CardTitle>
              <CardDescription>
                Aprove ou reprove as vagas enviadas pelas empresas.
              </CardDescription>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar vaga..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <JobsModerationTable searchTerm={searchTerm} />
        </CardContent>
      </Card>
    </div>
  )
}
