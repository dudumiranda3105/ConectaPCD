import { useState, useEffect } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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
import { Accessibility, Loader2, Award } from 'lucide-react'

export const AccessibilityChart = () => {
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalOfferings, setTotalOfferings] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null)
        const data = await adminService.getAccessibilityMetrics()
        setChartData(data)
        
        // Calcular total de ofertas
        const total = data.reduce((sum: number, item: any) => sum + item.offered, 0)
        setTotalOfferings(total)
      } catch (err: any) {
        console.error('Erro ao carregar métricas de acessibilidade:', err)
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
      <div className="h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500" />
      
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Accessibility className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Métricas de Acessibilidade</CardTitle>
              <CardDescription>
                Recursos de acessibilidade mais oferecidos nas vagas
              </CardDescription>
            </div>
          </div>
        </div>
        
        {!loading && !error && totalOfferings > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-violet-50 dark:bg-violet-950/30 w-fit">
              <div className="h-10 w-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                <Award className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total de Recursos Oferecidos</p>
                <p className="text-2xl font-bold text-violet-600">{totalOfferings}</p>
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[250px] gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-violet-500" />
            <p className="text-sm text-muted-foreground">Carregando métricas...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-[250px] text-muted-foreground">
            <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-3">
              <Accessibility className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-destructive font-medium mb-1">Erro ao carregar dados</p>
            <p className="text-xs">{error}</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[250px] text-muted-foreground">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-3">
              <Accessibility className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <p>Nenhum dado disponível</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <defs>
                <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#a855f7" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="type"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={80}
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
                cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }}
              />
              <Bar
                name="Ofertas"
                dataKey="offered"
                fill="url(#colorBar)"
                radius={[8, 8, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
