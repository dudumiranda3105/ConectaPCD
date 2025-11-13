import { Link } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Building } from 'lucide-react'

export default function ProfileSelectorPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Junte-se à ConectaPCD
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            Escolha o tipo de perfil que melhor descreve você.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="flex flex-col text-center hover:shadow-lg transition-shadow">
            <CardHeader className="items-center">
              <User className="w-12 h-12 mb-4 text-primary" />
              <CardTitle className="text-2xl">Candidato</CardTitle>
              <CardDescription>
                Estou procurando por oportunidades de emprego inclusivas.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-end">
              <Button className="w-full" asChild>
                <Link to="/cadastro/candidato">Criar perfil de candidato</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="flex flex-col text-center hover:shadow-lg transition-shadow">
            <CardHeader className="items-center">
              <Building className="w-12 h-12 mb-4 text-primary" />
              <CardTitle className="text-2xl">Empresa</CardTitle>
              <CardDescription>
                Quero contratar talentos diversos e qualificados.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-end">
              <Button className="w-full" asChild>
                <Link to="/cadastro/empresa">Cadastrar minha empresa</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        {/* Área administrativa removida daqui, agora está no Header */}
      </div>
    </div>
  )
}
