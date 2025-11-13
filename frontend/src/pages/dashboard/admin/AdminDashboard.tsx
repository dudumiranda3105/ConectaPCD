import { useState, useEffect } from 'react'
import { Users, Building, Briefcase, CheckCircle } from 'lucide-react'
import { RecentActivities } from '@/components/dashboard/admin/RecentActivities'
import { AccessibilityChart } from '@/components/dashboard/admin/AccessibilityChart'
import { EngagementChart } from '@/components/dashboard/admin/EngagementChart'
import { StatCard } from '@/components/dashboard/admin/StatCard'

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  const stats = [
    {
      title: 'Candidatos',
      value: '1,250',
      description: 'Total de candidatos na plataforma',
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: 'Empresas',
      value: '89',
      description: 'Total de empresas cadastradas',
      icon: <Building className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: 'Vagas Ativas',
      value: '234',
      description: 'Total de vagas publicadas',
      icon: <Briefcase className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: 'Vagas para Moderar',
      value: '12',
      description: 'Aguardando aprovação',
      icon: <CheckCircle className="h-4 w-4 text-muted-foreground" />,
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Painel do Administrador</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} loading={loading} />
        ))}
      </div>
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
