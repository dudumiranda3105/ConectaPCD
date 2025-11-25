import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { adminService } from '@/services/adminService'
import { TrendingUp, Loader2, Users, FileCheck } from 'lucide-react'

export const EngagementChart = () => {
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalApplications, setTotalApplications] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null)
        const data = await adminService.getEngagementMetrics()
        setChartData(data)

        // Calcular totais
        const apps = data.reduce(
          (sum: number, item: any) => sum + item.applications,
          0,
        )
        const users = data.reduce(
          (sum: number, item: any) => sum + item.newUsers,
          0,
        )
        setTotalApplications(apps)
        setTotalUsers(users)
      } catch (err: any) {
        console.error('Erro ao carregar métricas de engajamento:', err)
        setError(err.message || 'Erro ao carregar dados')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <Card className="shadow-lg border-2 hover:shadow-xl transition-all overflow-hidden">
      {/* Gradient top border */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500" />
      
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Métricas de Engajamento</CardTitle>
              <CardDescription>
                Candidaturas e novos usuários nos últimos 6 meses
              </CardDescription>
            </div>
          </div>
        </div>
        
        {!loading && !error && (
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30">
              <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <FileCheck className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Candidaturas</p>
                <p className="text-2xl font-bold text-blue-600">{totalApplications}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Novos Usuários</p>
                <p className="text-2xl font-bold text-emerald-600">{totalUsers}</p>
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[250px] gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            <p className="text-sm text-muted-foreground">Carregando métricas...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-[250px] text-muted-foreground">
            <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-3">
              <TrendingUp className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-destructive font-medium mb-1">Erro ao carregar dados</p>
            <p className="text-xs">{error}</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[250px] text-muted-foreground">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-3">
              <TrendingUp className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <p>Nenhum dado disponível</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <defs>
                <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                }}
              />
              <Legend />
              <Line
                name="Candidaturas"
                dataKey="applications"
                type="monotone"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 4, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2, fill: '#fff' }}
              />
              <Line
                name="Novos Usuários"
                dataKey="newUsers"
                type="monotone"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ fill: '#22c55e', r: 4, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 8, stroke: '#22c55e', strokeWidth: 2, fill: '#fff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
