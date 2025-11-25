import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  HeartHandshake,
  Building,
  UserPlus,
  Send,
  Target,
  Linkedin,
  Instagram,
  Mail,
  ArrowLeft,
  Sparkles,
  Users,
  Briefcase,
  Heart,
  Award,
  Rocket,
  Globe,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'
import { useScrollObserver } from '@/hooks/use-scroll-observer'
import { cn } from '@/lib/utils'

const AnimatedSection = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  const [ref, isVisible] = useScrollObserver<HTMLDivElement>({
    triggerOnce: true,
  })
  return (
    <section
      ref={ref}
      className={cn(
        'py-16 md:py-20 transition-all duration-700 ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
        className,
      )}
    >
      {children}
    </section>
  )
}

const teamMembers = [
  { name: 'Edson Gabriel', role: 'Q.A', initials: 'EG', color: 'from-blue-500 to-cyan-500' },
  { name: 'Eduarda Roberta', role: 'Designer UI/UX', initials: 'ER', color: 'from-pink-500 to-rose-500' },
  { name: 'Eduardo de Miranda', role: 'Desenvolvedor Fullstack', initials: 'EM', color: 'from-violet-500 to-purple-500' },
  { name: 'Rebeca Chagas', role: 'Gerente e P.O', initials: 'RC', color: 'from-emerald-500 to-teal-500' },
]

const howItWorksSteps = [
  {
    icon: UserPlus,
    title: 'Cadastro do Candidato',
    step: '01',
    color: 'blue',
    description:
      'Candidatos criam um perfil detalhado, destacando suas habilidades e necessidades de acessibilidade.',
  },
  {
    icon: Building,
    title: 'Cadastro da Empresa',
    step: '02',
    color: 'violet',
    description:
      'Empresas se cadastram e publicam vagas, especificando os recursos de acessibilidade disponíveis.',
  },
  {
    icon: HeartHandshake,
    title: 'Match de Acessibilidade',
    step: '03',
    color: 'emerald',
    description:
      'Nossa plataforma cruza informações para conectar candidatos a vagas compatíveis com suas necessidades.',
  },
  {
    icon: Send,
    title: 'Candidatura e Contato',
    step: '04',
    color: 'amber',
    description:
      'Candidatos se aplicam às vagas e as empresas entram em contato para iniciar o processo seletivo.',
  },
]

const stepColors: Record<string, { bg: string; icon: string; border: string }> = {
  blue: {
    bg: 'bg-blue-500/10',
    icon: 'text-blue-500',
    border: 'border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700'
  },
  violet: {
    bg: 'bg-violet-500/10',
    icon: 'text-violet-500',
    border: 'border-violet-200 dark:border-violet-800 hover:border-violet-300 dark:hover:border-violet-700'
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    icon: 'text-emerald-500',
    border: 'border-emerald-200 dark:border-emerald-800 hover:border-emerald-300 dark:hover:border-emerald-700'
  },
  amber: {
    bg: 'bg-amber-500/10',
    icon: 'text-amber-500',
    border: 'border-amber-200 dark:border-amber-800 hover:border-amber-300 dark:hover:border-amber-700'
  }
}

const impactData = [
  { value: '+500', label: 'Conexões Realizadas', icon: Users, color: 'text-blue-500' },
  { value: '+100', label: 'Empresas Participantes', icon: Building, color: 'text-violet-500' },
  { value: '+300', label: 'Candidatos Ativos', icon: Briefcase, color: 'text-emerald-500' },
]

const valuesData = [
  { icon: Heart, title: 'Empatia', description: 'Colocamos as pessoas em primeiro lugar', color: 'rose' },
  { icon: Globe, title: 'Acessibilidade', description: 'Ambiente inclusivo para todos', color: 'blue' },
  { icon: Award, title: 'Excelência', description: 'Comprometidos com a qualidade', color: 'amber' },
  { icon: Rocket, title: 'Inovação', description: 'Tecnologia para transformar vidas', color: 'violet' },
]

const valueColors: Record<string, { bg: string; icon: string }> = {
  rose: { bg: 'bg-rose-500/10', icon: 'text-rose-500' },
  blue: { bg: 'bg-blue-500/10', icon: 'text-blue-500' },
  amber: { bg: 'bg-amber-500/10', icon: 'text-amber-500' },
  violet: { bg: 'bg-violet-500/10', icon: 'text-violet-500' },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-violet-500/5 to-purple-500/5" />
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-purple-500/5 blur-3xl" />
        
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-8 pb-20 relative">
          {/* Back Link */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Voltar ao início
          </Link>

          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl blur-xl opacity-50 animate-pulse" />
                <div className="relative h-24 w-24 rounded-3xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 flex items-center justify-center shadow-2xl">
                  <Target className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-200 dark:border-indigo-800 mb-6">
              <Sparkles className="h-4 w-4 text-indigo-500" />
              <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Conectando pessoas, transformando vidas</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                Sobre o ConectaPCD
              </span>
            </h1>
            
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Nossa jornada para um mercado de trabalho mais inclusivo e acessível, 
              onde cada pessoa tem a oportunidade de brilhar.
            </p>

            {/* Quick Stats Preview */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-10">
              {impactData.map((item) => (
                <div key={item.label} className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white dark:bg-slate-800/50 shadow-lg border border-slate-200 dark:border-slate-700">
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                  <div className="text-left">
                    <p className="text-2xl font-bold text-foreground">{item.value}</p>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16">
        {/* Mission Section */}
        <AnimatedSection>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-purple-500/10 border border-indigo-200 dark:border-indigo-800 p-8 md:p-12">
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-indigo-500/10 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-violet-500/10 blur-3xl" />
            
            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-300 dark:border-indigo-700 mb-4">
                  <Target className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">Nossa Missão</span>
                </div>
                
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                    Missão e Propósito
                  </span>
                </h2>
                
                <div className="space-y-4 text-muted-foreground text-base sm:text-lg leading-relaxed">
                  <p>
                    O <strong className="text-foreground">ConectaPCD</strong> é uma iniciativa voltada à inclusão profissional
                    de pessoas com deficiência (PCDs), conectando candidatos e
                    empresas que oferecem vagas acessíveis.
                  </p>
                  <p>
                    Nossa missão é eliminar barreiras de acesso ao
                    mercado de trabalho, incentivar a diversidade nas contratações
                    e promover a autonomia através da tecnologia.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {valuesData.map((value) => {
                  const colors = valueColors[value.color]
                  return (
                    <div 
                      key={value.title}
                      className="p-5 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className={`h-12 w-12 rounded-xl ${colors.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <value.icon className={`h-6 w-6 ${colors.icon}`} />
                      </div>
                      <h3 className="font-bold text-foreground">{value.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{value.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* How It Works Section */}
        <AnimatedSection>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-200 dark:border-violet-800 mb-4">
              <CheckCircle2 className="h-4 w-4 text-violet-500" />
              <span className="text-sm font-medium text-violet-700 dark:text-violet-300">Processo Simplificado</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold">
              <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Como Funciona
              </span>
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
              Quatro passos simples para conectar talentos às oportunidades certas
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {howItWorksSteps.map((step) => {
              const colors = stepColors[step.color]
              return (
                <Card 
                  key={step.step}
                  className={`border-2 ${colors.border} bg-white dark:bg-slate-900/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className={`h-14 w-14 rounded-2xl ${colors.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <step.icon className={`h-7 w-7 ${colors.icon}`} />
                      </div>
                      <span className={`text-5xl font-bold ${colors.icon} opacity-20`}>{step.step}</span>
                    </div>
                    <CardTitle className="text-xl mt-4">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </AnimatedSection>

        {/* Impact Section */}
        <AnimatedSection className="relative">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-8 md:p-16 text-white shadow-2xl">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTRoLTJ2NGgyem0tNiA2aC0ydi00aDJ2NHptMC02di00aC0ydjRoMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
            <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
            
            <div className="relative z-10">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-medium">Fazendo a diferença</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">Nosso Impacto Social</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {impactData.map((item) => (
                  <div 
                    key={item.label} 
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-white/10 rounded-2xl blur group-hover:bg-white/20 transition-all" />
                    <div className="relative backdrop-blur-sm bg-white/10 rounded-2xl p-8 border border-white/20 text-center hover:bg-white/15 transition-all">
                      <item.icon className="h-10 w-10 mx-auto mb-4 opacity-80" />
                      <p className="text-5xl sm:text-6xl font-bold mb-2">{item.value}</p>
                      <p className="text-indigo-100 text-lg">{item.label}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <p className="mt-12 text-center max-w-3xl mx-auto text-indigo-100 text-lg leading-relaxed">
                O ConectaPCD reforça seu compromisso em tornar o mercado de
                trabalho mais inclusivo, facilitando a comunicação e valorizando
                competências únicas de cada pessoa.
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* Team Section */}
        <AnimatedSection>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-200 dark:border-emerald-800 mb-4">
              <Users className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Conheça o Time</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold">
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Nossa Equipe
              </span>
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
              Estudantes de Engenharia de Software do Uni-FACEF, unidos pelo propósito 
              de usar a tecnologia para a inclusão social.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="group"
              >
                <div className="relative p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24 mb-4">
                    <div className={`absolute inset-0 bg-gradient-to-br ${member.color} rounded-full blur-lg opacity-50 group-hover:opacity-100 transition-opacity`} />
                    <div className={`relative w-full h-full rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center shadow-xl border-4 border-white dark:border-slate-700`}>
                      <span className="text-2xl sm:text-3xl font-bold text-white">{member.initials}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-foreground text-lg">{member.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">{member.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-200 dark:border-emerald-800 text-center">
            <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
              <strong className="text-foreground">Acreditamos que tecnologia e empatia podem mudar realidades.</strong> O
              ConectaPCD é nossa contribuição para uma sociedade mais justa e acessível.
            </p>
          </div>
        </AnimatedSection>

        {/* Contact Section */}
        <AnimatedSection>
          <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-700 shadow-xl">
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-indigo-500/5 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-violet-500/5 blur-3xl" />
            
            <div className="relative p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-200 dark:border-indigo-800 mb-4">
                  <Mail className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Entre em Contato</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold">
                  <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                    Contato e Agradecimentos
                  </span>
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Agradecemos ao <strong className="text-foreground">Uni-FACEF</strong> por incentivar a inovação e 
                    apoiar soluções com propósito social que fazem a diferença na vida das pessoas.
                  </p>
                  
                  <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-200 dark:border-indigo-800">
                    <p className="font-semibold text-foreground mb-2">Fale conosco:</p>
                    <a
                      href="mailto:contato@conectapcd.com"
                      className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-2 text-lg font-medium"
                    >
                      <Mail className="w-5 h-5" />
                      contato@conectapcd.com
                    </a>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="h-12 px-6 rounded-xl border-2 hover:bg-gradient-to-br hover:from-blue-600 hover:to-blue-700 hover:text-white hover:border-transparent transition-all" 
                      asChild
                    >
                      <a href="#" className="flex items-center gap-2">
                        <Linkedin className="h-5 w-5" />
                        LinkedIn
                      </a>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="h-12 px-6 rounded-xl border-2 hover:bg-gradient-to-br hover:from-pink-600 hover:to-rose-600 hover:text-white hover:border-transparent transition-all" 
                      asChild
                    >
                      <a href="#" className="flex items-center gap-2">
                        <Instagram className="h-5 w-5" />
                        Instagram
                      </a>
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Button 
                    size="lg"
                    className="w-full h-14 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-lg group" 
                    asChild
                  >
                    <Link to="/privacidade" className="flex items-center justify-center gap-2">
                      Política de Privacidade
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button 
                    size="lg"
                    className="w-full h-14 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-lg group" 
                    asChild
                  >
                    <Link to="/termos" className="flex items-center justify-center gap-2">
                      Termos de Uso
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
