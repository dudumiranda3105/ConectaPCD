import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'

export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Análises</h1>
      <Card>
        <CardHeader>
          <CardTitle>Métricas de Recrutamento</CardTitle>
          <CardDescription>
            Acompanhe o desempenho das suas vagas e o perfil dos candidatos.
            (Página em construção)
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
