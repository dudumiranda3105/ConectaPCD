import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useState, useEffect } from 'react'
import { adminService } from '@/services/adminService'
import { Clock, UserPlus, Briefcase, FileCheck, Loader2, Activity } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'candidatura':
      return <FileCheck className="h-4 w-4 text-blue-600" />
    case 'vaga':
      return <Briefcase className="h-4 w-4 text-emerald-600" />
    case 'cadastro':
      return <UserPlus className="h-4 w-4 text-violet-600" />
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />
  }
}

const getActivityStyles = (type: string) => {
  switch (type) {
    case 'candidatura':
      return {
        bg: 'bg-blue-50 dark:bg-blue-950/30',
        border: 'border-blue-200 dark:border-blue-800',
        iconBg: 'bg-blue-100 dark:bg-blue-900/50',
      }
    case 'vaga':
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/30',
        border: 'border-emerald-200 dark:border-emerald-800',
        iconBg: 'bg-emerald-100 dark:bg-emerald-900/50',
      }
    case 'cadastro':
      return {
        bg: 'bg-violet-50 dark:bg-violet-950/30',
        border: 'border-violet-200 dark:border-violet-800',
        iconBg: 'bg-violet-100 dark:bg-violet-900/50',
      }
    default:
      return {
        bg: 'bg-muted/50',
        border: 'border-border',
        iconBg: 'bg-muted',
      }
  }
}

export const RecentActivities = () => {
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setError(null)
        const data = await adminService.getRecentActivities()
        setActivities(data)
      } catch (err: any) {
        console.error('Erro ao carregar atividades:', err)
        setError(err.message || 'Erro ao carregar dados')
      } finally {
        setLoading(false)
      }
    }
    fetchActivities()
  }, [])

  return (
    <Card className="shadow-lg border-2 h-full overflow-hidden hover:shadow-xl transition-all">
      {/* Gradient top border */}
      <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
      
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl">Atividades Recentes</CardTitle>
            <CardDescription>
              Acompanhe as últimas ações na plataforma
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
            <p className="text-sm text-muted-foreground">Carregando atividades...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-3">
              <Activity className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-destructive font-medium mb-1">Erro ao carregar atividades</p>
            <p className="text-xs">{error}</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <Clock className="h-10 w-10 text-muted-foreground/30" />
            </div>
            <p className="text-muted-foreground font-medium">Nenhuma atividade recente</p>
            <p className="text-xs text-muted-foreground mt-1">As ações aparecerão aqui</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {activities.map((activity, index) => {
              const styles = getActivityStyles(activity.type)
              return (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all hover:scale-[1.02] hover:shadow-md ${styles.bg} ${styles.border}`}
                >
                  <div className={`mt-0.5 h-8 w-8 rounded-lg flex items-center justify-center ${styles.iconBg}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-relaxed">
                      <span className="font-semibold text-foreground">{activity.user}</span>{' '}
                      <span className="text-muted-foreground">{activity.action}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(activity.time), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
