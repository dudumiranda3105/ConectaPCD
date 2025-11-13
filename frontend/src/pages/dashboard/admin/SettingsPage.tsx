import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Configurações</h1>
      <Card>
        <CardHeader>
          <CardTitle>Configurações Gerais</CardTitle>
          <CardDescription>
            Gerencie as configurações da plataforma. (Página em construção)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Em breve...</p>
        </CardContent>
      </Card>
    </div>
  )
}
