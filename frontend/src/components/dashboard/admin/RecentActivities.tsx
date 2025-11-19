import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useState, useEffect } from 'react'
import { adminService } from '@/services/adminService'
import { Clock, UserPlus, Briefcase, FileCheck, Loader2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'candidatura':
      return <FileCheck className="h-4 w-4 text-blue-500" />
    case 'vaga':
      return <Briefcase className="h-4 w-4 text-emerald-500" />
    case 'cadastro':
      return <UserPlus className="h-4 w-4 text-violet-500" />
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />
  }
}

const getActivityColor = (type: string) => {
  switch (type) {
    case 'candidatura':
      return 'bg-blue-500/10 border-blue-200 dark:border-blue-800'
    case 'vaga':
      return 'bg-emerald-500/10 border-emerald-200 dark:border-emerald-800'
    case 'cadastro':
      return 'bg-violet-500/10 border-violet-200 dark:border-violet-800'
    default:
      return 'bg-muted/50 border-border'
  }
}

export const RecentActivities = () => {
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await adminService.getRecentActivities()
        setActivities(data)
      } catch (error) {
        console.error('Erro ao carregar atividades:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchActivities()
  }, [])

  return (
    <Card className="shadow-lg border-2 h-full">
      <CardHeader className="bg-gradient-to-r from-indigo-500/5 to-blue-500/5 border-b">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
            <Clock className="h-4 w-4 text-white" />
          </div>
          Atividades Recentes
        </CardTitle>
        <CardDescription className="text-base">
          Acompanhe as últimas ações na plataforma
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">Nenhuma atividade recente</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-4 rounded-lg border transition-all hover:shadow-md ${getActivityColor(activity.type)}`}
              >
                <div className="mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-relaxed">
                    <span className="font-semibold text-foreground">{activity.user}</span>{' '}
                    <span className="text-muted-foreground">{activity.action}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(activity.time), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
