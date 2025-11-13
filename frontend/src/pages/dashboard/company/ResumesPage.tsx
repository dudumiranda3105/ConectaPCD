import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'

export default function ResumesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Currículos</h1>
      <Card>
        <CardHeader>
          <CardTitle>Banco de Talentos</CardTitle>
          <CardDescription>
            Explore os perfis dos candidatos que se aplicaram às suas vagas.
            (Página em construção)
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
