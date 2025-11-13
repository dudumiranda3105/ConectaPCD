import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Configurações</h1>
      <Card>
        <CardHeader>
          <CardTitle>Configurações da Conta</CardTitle>
          <CardDescription>
            Gerencie as informações da sua empresa e as configurações da conta.
            (Página em construção)
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
