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
          <CardTitle>Configurações da Conta</CardTitle>
          <CardDescription>
            Gerencie suas preferências de notificação e configurações de
            privacidade.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Página em construção.</p>
        </CardContent>
      </Card>
    </div>
  )
}
