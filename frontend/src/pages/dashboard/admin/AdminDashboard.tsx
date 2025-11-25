import { useState, useEffect } from 'react'
import { 
  Users, 
  Building, 
  Briefcase, 
  CheckCircle, 
  Activity, 
  Sparkles,
  ArrowUpRight,
  Shield,
  Zap,
  BarChart3
} from 'lucide-react'
import { RecentActivities } from '@/components/dashboard/admin/RecentActivities'
import { AccessibilityChart } from '@/components/dashboard/admin/AccessibilityChart'
import { EngagementChart } from '@/components/dashboard/admin/EngagementChart'
import { StatCard } from '@/components/dashboard/admin/StatCard'
import { adminService } from '@/services/adminService'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [stats, setStats] = useState([
    {
      title: 'Candidatos',
      value: '0',
      description: 'Total de candidatos cadastrados',
      icon: <Users className="h-5 w-5" />,
      trend: null,
      color: 'blue' as const,
    },
    {
      title: 'Empresas',
      value: '0',
      description: 'Total de empresas cadastradas',
      icon: <Building className="h-5 w-5" />,
      trend: null,
      color: 'violet' as const,
    },
    {
      title: 'Vagas Ativas',
      value: '0',
      description: 'Vagas disponíveis atualmente',
      icon: <Briefcase className="h-5 w-5" />,
      trend: null,
      color: 'emerald' as const,
    },
    {
      title: 'Vagas para Moderar',
      value: '0',
      description: 'Aguardando aprovação',
      icon: <CheckCircle className="h-5 w-5" />,
      trend: null,
      color: 'amber' as const,
    },
  ])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getDashboardStats()
        setStats([
          {
            title: 'Candidatos',
            value: data.candidates.toString(),
            description: 'Total de candidatos cadastrados',
            icon: <Users className="h-5 w-5" />,
            trend: null,
            color: 'blue' as const,
          },
          {
            title: 'Empresas',
            value: data.companies.toString(),
            description: 'Total de empresas cadastradas',
            icon: <Building className="h-5 w-5" />,
            trend: null,
            color: 'violet' as const,
          },
          {
            title: 'Vagas Ativas',
            value: data.activeJobs.toString(),
            description: 'Vagas disponíveis atualmente',
            icon: <Briefcase className="h-5 w-5" />,
            trend: null,
            color: 'emerald' as const,
          },
          {
            title: 'Vagas para Moderar',
            value: data.jobsToModerate.toString(),
            description: 'Aguardando aprovação',
            icon: <CheckCircle className="h-5 w-5" />,
            trend: null,
            color: 'amber' as const,
          },
        ])
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="space-y-8 pb-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 shadow-2xl">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/10 blur-3xl animate-pulse" />
          <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-pink-500/20 blur-3xl animate-pulse delay-700" />
          <div className="absolute right-1/3 top-1/2 h-64 w-64 rounded-full bg-blue-400/10 blur-2xl animate-pulse delay-1000" />
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>
        
        <div className="relative px-8 py-10 md:py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/20">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium backdrop-blur-sm">
                      Admin Panel
                    </span>
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-100 text-xs font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Online
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                  Painel de Controle
                </h1>
                <p className="text-white/70 mt-2 text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-300" />
                  Gerencie a plataforma ConectaPCD
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={() => navigate('/admin/jobs')}
                className="bg-white/20 hover:bg-white/30 text-white border border-white/20 backdrop-blur-sm shadow-lg"
              >
                <Briefcase className="h-4 w-4 mr-2" />
                Moderar Vagas
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
              <Button 
                onClick={() => navigate('/admin/users')}
                variant="secondary"
                className="bg-white text-purple-700 hover:bg-white/90 shadow-lg"
              >
                <Users className="h-4 w-4 mr-2" />
                Ver Usuários
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} loading={loading} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-5 md:grid-cols-3">
        <Card className="group relative overflow-hidden border-2 border-dashed border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all hover:shadow-lg cursor-pointer bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/30 dark:to-background"
          onClick={() => navigate('/admin/admins')}
        >
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Administradores</h3>
              <p className="text-sm text-muted-foreground">Gerenciar acessos</p>
            </div>
            <ArrowUpRight className="h-5 w-5 ml-auto text-muted-foreground group-hover:text-purple-600 transition-colors" />
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-2 border-dashed border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all hover:shadow-lg cursor-pointer bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/30 dark:to-background"
          onClick={() => navigate('/admin/companies')}
        >
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Building className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Empresas</h3>
              <p className="text-sm text-muted-foreground">Gerenciar empresas</p>
            </div>
            <ArrowUpRight className="h-5 w-5 ml-auto text-muted-foreground group-hover:text-emerald-600 transition-colors" />
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-2 border-dashed border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all hover:shadow-lg cursor-pointer bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-background"
          onClick={() => navigate('/admin/disabilities')}
        >
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Zap className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Sistema</h3>
              <p className="text-sm text-muted-foreground">Configurações</p>
            </div>
            <ArrowUpRight className="h-5 w-5 ml-auto text-muted-foreground group-hover:text-blue-600 transition-colors" />
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-purple-600" />
          <h2 className="text-xl font-semibold">Análises e Métricas</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-7">
          <div className="lg:col-span-4 space-y-6">
            <EngagementChart />
            <AccessibilityChart />
          </div>
          <div className="lg:col-span-3">
            <RecentActivities />
          </div>
        </div>
      </div>
    </div>
  )
}
