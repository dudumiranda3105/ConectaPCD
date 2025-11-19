import { Link } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Building, Sparkles } from 'lucide-react'

export default function ProfileSelectorPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-purple-500/10 blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
      </div>
      
      <div className="w-full max-w-5xl space-y-10">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-600 to-purple-700 flex items-center justify-center shadow-2xl animate-in zoom-in duration-500">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
            Junte-se à ConectaPCD
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Escolha o tipo de perfil que melhor descreve você e faça parte dessa transformação.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <Link to="/cadastro/candidato" className="no-underline">
            <Card className="group flex flex-col text-center border-2 shadow-2xl hover:shadow-[0_20px_60px_rgba(99,102,241,0.3)] transition-all duration-300 hover:-translate-y-2 hover:border-indigo-500/50 bg-gradient-to-br from-background to-muted/20 overflow-hidden h-full cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <CardHeader className="items-center relative z-10 pt-8">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl mb-4 group-hover:scale-110 transition-transform">
                  <User className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold">Candidato</CardTitle>
                <CardDescription className="text-base mt-3">
                  Estou procurando por oportunidades de emprego inclusivas e acessíveis.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-end pb-8 relative z-10">
                <div className="w-full h-12 flex items-center justify-center text-base font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 group-hover:from-blue-600 group-hover:to-indigo-700 shadow-lg rounded-md text-white transition-all">
                  Criar perfil de candidato
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link to="/cadastro/empresa" className="no-underline">
            <Card className="group flex flex-col text-center border-2 shadow-2xl hover:shadow-[0_20px_60px_rgba(124,58,237,0.3)] transition-all duration-300 hover:-translate-y-2 hover:border-violet-500/50 bg-gradient-to-br from-background to-muted/20 overflow-hidden h-full cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <CardHeader className="items-center relative z-10 pt-8">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-xl mb-4 group-hover:scale-110 transition-transform">
                  <Building className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold">Empresa</CardTitle>
                <CardDescription className="text-base mt-3">
                  Quero contratar talentos diversos, qualificados e comprometidos.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-end pb-8 relative z-10">
                <div className="w-full h-12 flex items-center justify-center text-base font-semibold bg-gradient-to-r from-violet-500 to-purple-600 group-hover:from-violet-600 group-hover:to-purple-700 shadow-lg rounded-md text-white transition-all">
                  Cadastrar minha empresa
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
