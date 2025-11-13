import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { JobsModerationTable } from '@/components/dashboard/admin/JobsModerationTable'

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Moderação de Vagas</h1>
      <Card>
        <CardHeader>
          <CardTitle>Vagas Publicadas</CardTitle>
          <CardDescription>
            Aprove ou reprove as vagas enviadas pelas empresas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <JobsModerationTable />
        </CardContent>
      </Card>
    </div>
  )
}
