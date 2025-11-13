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

const chartData = [
  { type: 'Rampas', offered: 120 },
  { type: 'Libras', offered: 90 },
  { type: 'Leitores de Tela', offered: 75 },
  { type: 'Piso Tátil', offered: 60 },
  { type: 'Mobiliário', offered: 110 },
]

const chartConfig = {
  offered: {
    label: 'Vagas Oferecendo',
    color: 'hsl(var(--chart-1))',
  },
}

export const AccessibilityChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Métricas de Acessibilidade</CardTitle>
        <CardDescription>
          Recursos de acessibilidade mais oferecidos nas vagas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="type"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="offered" fill="var(--color-offered)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
