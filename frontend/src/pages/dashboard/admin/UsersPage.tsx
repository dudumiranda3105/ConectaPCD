import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { UsersTable } from '@/components/dashboard/admin/UsersTable'

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gerenciamento de Usuários</h1>
      <Card>
        <CardHeader>
          <CardTitle>Candidatos Cadastrados</CardTitle>
          <CardDescription>
            Visualize e gerencie os perfis dos candidatos na plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UsersTable />
        </CardContent>
      </Card>
    </div>
  )
}
