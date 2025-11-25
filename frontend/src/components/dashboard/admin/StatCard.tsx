import { Card, CardContent } from '@/components/ui/card'
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
    gradient: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-600 dark:text-blue-400',
    ring: 'ring-blue-500/20',
  },
  violet: {
    gradient: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50 dark:bg-violet-950/30',
    border: 'border-violet-200 dark:border-violet-800',
    text: 'text-violet-600 dark:text-violet-400',
    ring: 'ring-violet-500/20',
  },
  emerald: {
    gradient: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-800',
    text: 'text-emerald-600 dark:text-emerald-400',
    ring: 'ring-emerald-500/20',
  },
  amber: {
    gradient: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-800',
    text: 'text-amber-600 dark:text-amber-400',
    ring: 'ring-amber-500/20',
  },
  rose: {
    gradient: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-50 dark:bg-rose-950/30',
    border: 'border-rose-200 dark:border-rose-800',
    text: 'text-rose-600 dark:text-rose-400',
    ring: 'ring-rose-500/20',
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
      <Card className="border-2 shadow-md overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-14 w-14 rounded-2xl" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const colors = colorClasses[color]
  const isPositiveTrend = trend && trend.startsWith('+')

  return (
    <Card className={cn(
      'group relative overflow-hidden border-2 transition-all duration-300',
      'hover:shadow-xl hover:-translate-y-1 hover:ring-4',
      colors.border,
      colors.bg,
      colors.ring
    )}>
      {/* Decorative gradient line at top */}
      <div className={cn(
        'absolute top-0 left-0 right-0 h-1 bg-gradient-to-r',
        colors.gradient
      )} />
      
      {/* Decorative blur */}
      <div className={cn(
        'absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity bg-gradient-to-br',
        colors.gradient
      )} />
      
      <CardContent className="p-6 relative">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-3">
              <span className={cn(
                'text-4xl font-bold tracking-tight',
                colors.text
              )}>
                {value}
              </span>
              {trend && (
                <span className={cn(
                  'flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full',
                  isPositiveTrend 
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' 
                    : 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300'
                )}>
                  {isPositiveTrend ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {trend}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          
          <div className={cn(
            'h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg text-white bg-gradient-to-br transition-transform group-hover:scale-110 group-hover:rotate-3',
            colors.gradient
          )}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
