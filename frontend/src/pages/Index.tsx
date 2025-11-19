import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Accessibility, Building, Users, CheckCircle } from 'lucide-react'

const Index = () => {
  const featuredJobs = [
    {
      title: 'Desenvolvedor Frontend Acessível',
      company: 'InovaTech',
      location: 'São Paulo, SP',
      logo: 'https://img.usecurling.com/i?q=tech&color=azure',
    },
    {
      title: 'Analista de Dados Inclusivo',
      company: 'DataMind',
      location: 'Remoto',
      logo: 'https://img.usecurling.com/i?q=data&color=violet',
    },
    {
      title: 'UX Designer com Foco em Acessibilidade',
      company: 'Creative Solutions',
      location: 'Rio de Janeiro, RJ',
      logo: 'https://img.usecurling.com/i?q=design&color=rose',
    },
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden">
        {/* Background com gradiente animado */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-gray-950 dark:via-indigo-950/20 dark:to-violet-950/20" />
        <div className="pointer-events-none absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-indigo-400/30 to-violet-400/30 blur-3xl animate-pulse" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-blue-400/20 to-purple-400/20 blur-3xl animate-pulse" style={{animationDelay: '1s'}} />

        <div className="container mx-auto text-center px-4 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-violet-500/10 backdrop-blur-sm px-4 py-2 text-sm border border-indigo-200/50 dark:border-indigo-800/50 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 animate-pulse" />
            Plataforma inclusiva para candidatos e empresas
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-700">
            Conectando talentos,<br />promovendo inclusão.
          </h1>
          <p className="max-w-3xl mx-auto text-lg sm:text-xl md:text-2xl text-muted-foreground mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 px-4">
            A ponte direta entre profissionais com deficiência e empresas que
            valorizam a diversidade e a acessibilidade.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 px-4">
            <Button size="lg" className="h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-xl hover:shadow-2xl transition-all" asChild>
              <Link to="/cadastro">Começar agora →</Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-semibold border-2 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-violet-50 dark:hover:from-indigo-950/50 dark:hover:to-violet-950/50 transition-all" asChild>
              <Link to="/login">Já tenho conta</Link>
            </Button>
          </div>

          {/* Stats strip */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 px-4">
            <div className="rounded-2xl border-2 border-indigo-100 dark:border-indigo-900 bg-gradient-to-br from-background to-indigo-50/50 dark:to-indigo-950/20 p-6 sm:p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">5k+</p>
              <p className="text-sm text-muted-foreground mt-2">Candidatos cadastrados</p>
            </div>
            <div className="rounded-2xl border-2 border-violet-100 dark:border-violet-900 bg-gradient-to-br from-background to-violet-50/50 dark:to-violet-950/20 p-6 sm:p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">800+</p>
              <p className="text-sm text-muted-foreground mt-2">Vagas inclusivas</p>
            </div>
            <div className="rounded-2xl border-2 border-purple-100 dark:border-purple-900 bg-gradient-to-br from-background to-purple-50/50 dark:to-purple-950/20 p-6 sm:p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">120+</p>
              <p className="text-sm text-muted-foreground mt-2">Empresas parceiras</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="w-full py-20 md:py-28 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Uma plataforma para todos
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Descubra como o ConectaPCD pode impulsionar sua carreira ou sua
              empresa.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="shadow-2xl border-2 border-indigo-100 dark:border-indigo-900 transition-all hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(99,102,241,0.3)] bg-gradient-to-br from-background to-indigo-50/30 dark:to-indigo-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  Para Candidatos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />{' '}
                  <span>
                    Encontre vagas em empresas que realmente valorizam a
                    inclusão.
                  </span>
                </p>
                <p className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />{' '}
                  <span>
                    Crie um perfil detalhado destacando suas habilidades e
                    necessidades de acessibilidade.
                  </span>
                </p>
                <p className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />{' '}
                  <span>
                    Candidate-se de forma simplificada e transparente.
                  </span>
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-2xl border-2 border-violet-100 dark:border-violet-900 transition-all hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(124,58,237,0.3)] bg-gradient-to-br from-background to-violet-50/30 dark:to-violet-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  Para Empresas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />{' '}
                  <span>
                    Acesse um banco de talentos qualificados e diversos.
                  </span>
                </p>
                <p className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />{' '}
                  <span>
                    Publique vagas com informações claras sobre acessibilidade.
                  </span>
                </p>
                <p className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />{' '}
                  <span>
                    Fortaleça sua marca empregadora e cultura de inclusão.
                  </span>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* Accessibility */}
      <section id="accessibility" className="w-full py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-cyan-950/20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto">
            <div className="md:w-1/2 text-center md:text-left">
              <div className="inline-flex h-20 w-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 items-center justify-center shadow-2xl mx-auto md:mx-0 mb-6">
                <Accessibility className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6">
                Compromisso com a Acessibilidade
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Nossa plataforma é desenvolvida seguindo as diretrizes WCAG 2.1
                AA, garantindo uma experiência de uso inclusiva para todos,
                independente de suas habilidades.
              </p>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400/50 to-teal-400/50 rounded-2xl blur-2xl" />
                <img
                  src="https://img.usecurling.com/p/600/400?q=people%20working%20on%20computer"
                  alt="Pessoas diversas trabalhando juntas em um escritório"
                  className="rounded-2xl shadow-2xl relative z-10 border-4 border-white dark:border-gray-900"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="w-full py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 p-12 md:p-16 shadow-2xl">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,white)]"></div>
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">Pronto para começar?</h3>
                <p className="text-indigo-100 text-lg">
                  Crie sua conta gratuitamente e faça parte da mudança.
                </p>
              </div>
              <div className="flex gap-4">
                <Button size="lg" className="h-14 px-8 bg-white text-indigo-600 hover:bg-indigo-50 font-semibold shadow-xl" asChild>
                  <Link to="/cadastro">Criar conta</Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 border-2 border-white text-white hover:bg-white/10 font-semibold" asChild>
                  <Link to="/login">Entrar</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Index
