import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { UsersTable } from '@/components/dashboard/admin/UsersTable'
import { Users, Search, UserCheck, UserX, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { adminService } from '@/services/adminService'

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const users = await adminService.getUsers()
        const active = users.filter((u: any) => u.status === 'Ativo').length
        setStats({
          total: users.length,
          active,
          inactive: users.length - active,
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
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 shadow-2xl">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>
        
        <div className="relative px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/20">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Gerenciamento de Usuários
                </h1>
                <p className="text-white/70 mt-1">
                  Visualize e gerencie os candidatos cadastrados
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-500 flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Usuários</p>
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                ) : (
                  <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-500 flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Usuários Ativos</p>
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                ) : (
                  <p className="text-3xl font-bold text-emerald-600">{stats.active}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-rose-500 flex items-center justify-center">
                <UserX className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Usuários Inativos</p>
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-rose-600" />
                ) : (
                  <p className="text-3xl font-bold text-rose-600">{stats.inactive}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table Card */}
      <Card className="border-2 shadow-lg overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500" />
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-xl">Candidatos Cadastrados</CardTitle>
              <CardDescription>
                Visualize e gerencie os perfis dos candidatos na plataforma.
              </CardDescription>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar usuário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <UsersTable searchTerm={searchTerm} />
        </CardContent>
      </Card>
    </div>
  )
}
