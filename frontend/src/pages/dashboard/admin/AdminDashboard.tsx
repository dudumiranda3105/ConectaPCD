import { useState, useEffect } from 'react'
import { Users, Building, Briefcase, CheckCircle, TrendingUp, Activity } from 'lucide-react'
import { RecentActivities } from '@/components/dashboard/admin/RecentActivities'
import { AccessibilityChart } from '@/components/dashboard/admin/AccessibilityChart'
import { EngagementChart } from '@/components/dashboard/admin/EngagementChart'
import { StatCard } from '@/components/dashboard/admin/StatCard'
import { adminService } from '@/services/adminService'

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState([
    {
      title: 'Candidatos',
      value: '0',
      description: 'Total de candidatos cadastrados',
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      trend: null,
      color: 'blue' as const,
    },
    {
      title: 'Empresas',
      value: '0',
      description: 'Total de empresas cadastradas',
      icon: <Building className="h-4 w-4 text-muted-foreground" />,
      trend: null,
      color: 'violet' as const,
    },
    {
      title: 'Vagas Ativas',
      value: '0',
      description: 'Vagas disponíveis atualmente',
      icon: <Briefcase className="h-4 w-4 text-muted-foreground" />,
      trend: null,
      color: 'emerald' as const,
    },
    {
      title: 'Vagas para Moderar',
      value: '0',
      description: 'Aguardando aprovação',
      icon: <CheckCircle className="h-4 w-4 text-muted-foreground" />,
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
            icon: <Users className="h-4 w-4 text-muted-foreground" />,
            trend: null,
            color: 'blue' as const,
          },
          {
            title: 'Empresas',
            value: data.companies.toString(),
            description: 'Total de empresas cadastradas',
            icon: <Building className="h-4 w-4 text-muted-foreground" />,
            trend: null,
            color: 'violet' as const,
          },
          {
            title: 'Vagas Ativas',
            value: data.activeJobs.toString(),
            description: 'Vagas disponíveis atualmente',
            icon: <Briefcase className="h-4 w-4 text-muted-foreground" />,
            trend: null,
            color: 'emerald' as const,
          },
          {
            title: 'Vagas para Moderar',
            value: data.jobsToModerate.toString(),
            description: 'Aguardando aprovação',
            icon: <CheckCircle className="h-4 w-4 text-muted-foreground" />,
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
    <div className="space-y-8">
      {/* Header aprimorado */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-violet-500/10 shadow-xl">
        {/* Elementos decorativos */}
        <div className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-violet-500/10 blur-2xl" />
        
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Painel do Administrador
              </h1>
              <p className="text-muted-foreground mt-2 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Visão geral da plataforma ConectaPCD
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <div className="px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-sm font-medium">
                <span className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Sistema Online
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} loading={loading} />
        ))}
      </div>

      {/* Gráficos e atividades */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4 space-y-6">
          <EngagementChart />
          <AccessibilityChart />
        </div>
        <div className="lg:col-span-3">
          <RecentActivities />
        </div>
      </div>
    </div>
  )
}
