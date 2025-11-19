import { useState, useEffect } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
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
import { Shield, Loader2 } from 'lucide-react'

const chartConfig = {
  offered: {
    label: 'Vagas Oferecendo',
    color: 'hsl(262, 83%, 58%)',
  },
}

export const AccessibilityChart = () => {
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [totalOfferings, setTotalOfferings] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await adminService.getAccessibilityMetrics()
        setChartData(data)
        
        // Calcular total de ofertas
        const total = data.reduce((sum, item) => sum + item.offered, 0)
        setTotalOfferings(total)
      } catch (error) {
        console.error('Erro ao carregar métricas de acessibilidade:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <Card className="shadow-lg border-2 hover:shadow-xl transition-shadow">
      <CardHeader className="bg-gradient-to-r from-violet-500/5 to-purple-500/5 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              Métricas de Acessibilidade
            </CardTitle>
            <CardDescription className="mt-2 text-base">
              Recursos de acessibilidade mais oferecidos nas vagas
            </CardDescription>
          </div>
        </div>
        {!loading && totalOfferings > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">Total de Ofertas</p>
            <p className="text-2xl font-bold text-violet-600">{totalOfferings}</p>
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
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis
                dataKey="type"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar 
                dataKey="offered" 
                fill="var(--color-offered)" 
                radius={[8, 8, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
