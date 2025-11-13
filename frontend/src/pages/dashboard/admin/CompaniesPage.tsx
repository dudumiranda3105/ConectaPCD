import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CompaniesTable } from '@/components/dashboard/admin/CompaniesTable'

export default function CompaniesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gerenciamento de Empresas</h1>
      <Card>
        <CardHeader>
          <CardTitle>Empresas Cadastradas</CardTitle>
          <CardDescription>
            Visualize e gerencie os perfis das empresas parceiras.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CompaniesTable />
        </CardContent>
      </Card>
    </div>
  )
}
