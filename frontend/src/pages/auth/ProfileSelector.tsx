import { Link } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { User, Building, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function ProfileSelectorPage() {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* Left Side - Decorative (Hidden on mobile/tablet) */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-900 overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 opacity-90" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

        {/* Animated Shapes */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />

        <div className="relative z-10 p-12 text-white max-w-xl">
          <div className="mb-8 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Comece sua jornada de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">transformação</span>
          </h1>
          <p className="text-lg text-indigo-100 mb-8 leading-relaxed">
            Seja você um talento em busca de oportunidades ou uma empresa buscando diversidade, seu lugar é aqui.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-indigo-100">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>Cadastro 100% gratuito para candidatos</span>
            </div>
            <div className="flex items-center gap-3 text-indigo-100">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>Conexão direta com recrutadores</span>
            </div>
            <div className="flex items-center gap-3 text-indigo-100">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>Ambiente seguro e inclusivo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-background overflow-y-auto min-h-screen lg:min-h-0">
        <div className="w-full max-w-md space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Mobile header with gradient */}
          <div className="lg:hidden text-center mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg mb-4">
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
          </div>
          
          <div className="text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Crie sua conta</h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Escolha como você deseja participar da plataforma
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6">
            {/* Candidate Option */}
            <Link to="/cadastro/candidato" className="group no-underline outline-none">
              <Card className="relative overflow-hidden border-2 transition-all duration-300 hover:border-indigo-500/50 hover:shadow-lg hover:-translate-y-1 cursor-pointer active:scale-[0.98]">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardContent className="p-4 sm:p-6 flex items-center gap-3 sm:gap-4">
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg sm:rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <User className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base sm:text-lg text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Sou Candidato</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">Busco vagas e oportunidades de carreira</p>
                  </div>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-indigo-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </CardContent>
              </Card>
            </Link>

            {/* Company Option */}
            <Link to="/cadastro/empresa" className="group no-underline outline-none">
              <Card className="relative overflow-hidden border-2 transition-all duration-300 hover:border-violet-500/50 hover:shadow-lg hover:-translate-y-1 cursor-pointer active:scale-[0.98]">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardContent className="p-4 sm:p-6 flex items-center gap-3 sm:gap-4">
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg sm:rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <Building className="w-6 h-6 sm:w-7 sm:h-7 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base sm:text-lg text-foreground group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">Sou Empresa</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">Quero divulgar vagas e contratar</p>
                  </div>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-violet-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="text-center space-y-3 sm:space-y-4 pt-2 sm:pt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Já tem uma conta?
                </span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              <Link
                to="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline transition-all"
              >
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
