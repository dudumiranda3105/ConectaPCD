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

const chartData = [
  { month: 'Janeiro', applications: 186, newUsers: 80 },
  { month: 'Fevereiro', applications: 305, newUsers: 200 },
  { month: 'Março', applications: 237, newUsers: 120 },
  { month: 'Abril', applications: 273, newUsers: 190 },
  { month: 'Maio', applications: 209, newUsers: 130 },
  { month: 'Junho', applications: 214, newUsers: 140 },
]

const chartConfig = {
  applications: {
    label: 'Candidaturas',
    color: 'hsl(var(--chart-1))',
  },
  newUsers: {
    label: 'Novos Usuários',
    color: 'hsl(var(--chart-2))',
  },
}

export const EngagementChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Métricas de Engajamento</CardTitle>
        <CardDescription>
          Candidaturas e novos usuários nos últimos 6 meses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <LineChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              dataKey="applications"
              type="monotone"
              stroke="var(--color-applications)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="newUsers"
              type="monotone"
              stroke="var(--color-newUsers)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
