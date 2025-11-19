import { useState, useEffect } from 'react'
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { adminService } from '@/services/adminService'
import { TrendingUp, Loader2 } from 'lucide-react'

const chartConfig = {
  applications: {
    label: 'Candidaturas',
    color: 'hsl(217, 91%, 60%)',
  },
  newUsers: {
    label: 'Novos Usuários',
    color: 'hsl(142, 71%, 45%)',
  },
}

export const EngagementChart = () => {
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [totalApplications, setTotalApplications] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await adminService.getEngagementMetrics()
        setChartData(data)
        
        // Calcular totais
        const apps = data.reduce((sum, item) => sum + item.applications, 0)
        const users = data.reduce((sum, item) => sum + item.newUsers, 0)
        setTotalApplications(apps)
        setTotalUsers(users)
      } catch (error) {
        console.error('Erro ao carregar métricas de engajamento:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <Card className="shadow-lg border-2 hover:shadow-xl transition-shadow">
      <CardHeader className="bg-gradient-to-r from-blue-500/5 to-emerald-500/5 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              Métricas de Engajamento
            </CardTitle>
            <CardDescription className="mt-2 text-base">
              Candidaturas e novos usuários nos últimos 6 meses
            </CardDescription>
          </div>
        </div>
        {!loading && (
          <div className="flex gap-6 mt-4 pt-4 border-t">
            <div>
              <p className="text-sm text-muted-foreground">Total Candidaturas</p>
              <p className="text-2xl font-bold text-blue-600">{totalApplications}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Novos Usuários</p>
              <p className="text-2xl font-bold text-emerald-600">{totalUsers}</p>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-6">
        {loading ? (
          <div className="flex items-center justify-center h-[250px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[250px] text-muted-foreground">
            Nenhum dado disponível
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
            <LineChart accessibilityLayer data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                dataKey="applications"
                type="monotone"
                stroke="var(--color-applications)"
                strokeWidth={3}
                dot={{ fill: 'var(--color-applications)', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                dataKey="newUsers"
                type="monotone"
                stroke="var(--color-newUsers)"
                strokeWidth={3}
                dot={{ fill: 'var(--color-newUsers)', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
