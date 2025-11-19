import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  description: string
  icon: React.ReactNode
  loading?: boolean
  trend?: string | null
  color?: 'blue' | 'violet' | 'emerald' | 'amber' | 'rose'
}

const colorClasses = {
  blue: {
    gradient: 'from-blue-500/10 to-blue-500/5',
    icon: 'bg-blue-500/10',
    iconColor: 'text-blue-600',
    border: 'border-blue-500/20',
  },
  violet: {
    gradient: 'from-violet-500/10 to-violet-500/5',
    icon: 'bg-violet-500/10',
    iconColor: 'text-violet-600',
    border: 'border-violet-500/20',
  },
  emerald: {
    gradient: 'from-emerald-500/10 to-emerald-500/5',
    icon: 'bg-emerald-500/10',
    iconColor: 'text-emerald-600',
    border: 'border-emerald-500/20',
  },
  amber: {
    gradient: 'from-amber-500/10 to-amber-500/5',
    icon: 'bg-amber-500/10',
    iconColor: 'text-amber-600',
    border: 'border-amber-500/20',
  },
  rose: {
    gradient: 'from-rose-500/10 to-rose-500/5',
    icon: 'bg-rose-500/10',
    iconColor: 'text-rose-600',
    border: 'border-rose-500/20',
  },
}

export const StatCard = ({
  title,
  value,
  description,
  icon,
  loading,
  trend,
  color = 'blue',
}: StatCardProps) => {
  if (loading) {
    return (
      <Card className="border-border/50 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-10 rounded-lg" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-20 mb-2" />
          <Skeleton className="h-3 w-full" />
        </CardContent>
      </Card>
    )
  }

  const colors = colorClasses[color]
  const isPositiveTrend = trend && trend.startsWith('+')

  return (
    <Card className={cn(
      'relative overflow-hidden border-border/50 shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] group',
      'bg-gradient-to-br',
      colors.gradient
    )}>
      {/* Elemento decorativo */}
      <div className={cn(
        'absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity',
        colors.icon
      )} />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-semibold text-muted-foreground">{title}</CardTitle>
        <div className={cn(
          'h-10 w-10 rounded-lg flex items-center justify-center transition-all group-hover:scale-110',
          colors.icon
        )}>
          <div className={colors.iconColor}>
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-bold tracking-tight">{value}</div>
          {trend && (
            <div className={cn(
              'flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md',
              isPositiveTrend 
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' 
                : 'bg-rose-500/10 text-rose-700 dark:text-rose-300'
            )}>
              {isPositiveTrend ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {trend}
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  )
}
