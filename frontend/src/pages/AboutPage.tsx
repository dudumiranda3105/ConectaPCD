import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  HeartHandshake,
  Building,
  UserPlus,
  Send,
  Target,
  Linkedin,
  Instagram,
  Mail,
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
  { name: 'Edson Gabriel', role: 'Q.A', initials: 'EG' },
  { name: 'Eduarda Roberta', role: 'Designer UI/UX', initials: 'ER' },
  { name: 'Eduardo de Miranda', role: 'Desenvolvedor Fullstack', initials: 'EM' },
  { name: 'Rebeca Chagas', role: 'Gerente e P.O', initials: 'RC' },
]

const howItWorksSteps = [
  {
    icon: UserPlus,
    title: '1️⃣ Cadastro do Candidato',
    description:
      'Candidatos criam um perfil detalhado, destacando suas habilidades e necessidades de acessibilidade.',
  },
  {
    icon: Building,
    title: '2️⃣ Cadastro da Empresa',
    description:
      'Empresas se cadastram e publicam vagas, especificando os recursos de acessibilidade disponíveis.',
  },
  {
    icon: HeartHandshake,
    title: '3️⃣ Match de Acessibilidade',
    description:
      'Nossa plataforma cruza informações para conectar candidatos a vagas compatíveis com suas necessidades.',
  },
  {
    icon: Send,
    title: '4️⃣ Candidatura e Contato Direto',
    description:
      'Candidatos se aplicam às vagas e as empresas entram em contato para iniciar o processo seletivo.',
  },
]

const impactData = [
  { value: '+500', label: 'Conexões Realizadas' },
  { value: '+100', label: 'Empresas Participantes' },
  { value: '+300', label: 'Candidatos Ativos' },
]

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-b from-background via-indigo-50/30 to-background dark:from-background dark:via-indigo-950/10 dark:to-background text-foreground">
      <div className="container mx-auto max-w-5xl py-16 px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16 animate-fade-in-up relative">
          <div className="inline-flex h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-600 to-purple-700 items-center justify-center shadow-2xl mx-auto mb-6">
            <Target className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
            Sobre o ConectaPCD
          </h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
            Nossa jornada para um mercado de trabalho mais inclusivo e
            acessível.
          </p>
        </header>

        <main className="space-y-12">
          <AnimatedSection>
            <Card className="overflow-hidden border-2 border-indigo-100 dark:border-indigo-900 shadow-2xl bg-gradient-to-br from-background to-indigo-50/30 dark:to-indigo-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-3xl">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  Missão e Propósito
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                <p>
                  O ConectaPCD é uma iniciativa voltada à inclusão profissional
                  de pessoas com deficiência (PCDs), conectando candidatos e
                  empresas que oferecem vagas acessíveis.
                </p>
                <p>
                  A plataforma tem como missão eliminar barreiras de acesso ao
                  mercado de trabalho, incentivar a diversidade nas contratações
                  e promover a autonomia de pessoas com deficiência por meio da
                  tecnologia.
                </p>
                <p>
                  O projeto busca criar um ambiente onde acessibilidade, empatia
                  e oportunidade caminham juntas.
                </p>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection>
            <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Como Funciona
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {howItWorksSteps.map((step, index) => (
                <Card key={index} className="border-2 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all hover:shadow-xl hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
                        <step.icon className="w-7 h-7 text-white" />
                      </div>
                      <CardTitle className="text-xl">{step.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-base leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection className="bg-gradient-to-r from-indigo-500 via-violet-600 to-purple-700 rounded-3xl p-12 md:p-16 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,white)]"></div>
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-center mb-12">
                Impacto Social
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                {impactData.map((item) => (
                  <div key={item.label} className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20">
                    <p className="text-5xl font-bold">
                      {item.value}
                    </p>
                    <p className="text-indigo-100 mt-3 text-lg">{item.label}</p>
                  </div>
                ))}
              </div>
              <p className="mt-12 text-center max-w-3xl mx-auto text-indigo-100 text-lg leading-relaxed">
                O ConectaPCD reforça seu compromisso em tornar o mercado de
                trabalho mais inclusivo, facilitando a comunicação e valorizando
                competências.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Nossa Equipe
            </h2>
            <p className="text-center max-w-3xl mx-auto text-muted-foreground mb-12 text-lg leading-relaxed">
              ConectaPCD é um projeto acadêmico desenvolvido por estudantes de
              Engenharia de Software do Uni-FACEF, com o objetivo de utilizar a
              tecnologia para a inclusão social.
            </p>
            <div className="flex flex-wrap justify-center gap-10">
              {teamMembers.map((member) => (
                <div
                  key={member.name}
                  className="flex flex-col items-center gap-3 group"
                >
                  <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full blur opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    <div className="w-28 h-28 relative rounded-full border-4 border-white dark:border-gray-900 shadow-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
                      <span className="text-4xl font-bold text-white">{member.initials}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-lg">{member.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-12 text-center max-w-3xl mx-auto text-muted-foreground text-lg leading-relaxed">
              Acreditamos que tecnologia e empatia podem mudar realidades. O
              ConectaPCD é nossa contribuição para uma sociedade mais justa e
              acessível.
            </p>
          </AnimatedSection>

          <AnimatedSection>
            <Card className="border-2 border-indigo-100 dark:border-indigo-900 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-3xl text-center bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  Contato e Agradecimentos
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <p className="text-muted-foreground text-lg">
                  Agradecemos ao Uni-FACEF por incentivar a inovação e soluções
                  com propósito social.
                </p>
                <div>
                  <p className="font-semibold text-lg mb-2">Fale conosco:</p>
                  <a
                    href="mailto:contato@conectapcd.com"
                    className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center justify-center gap-2 text-lg"
                  >
                    <Mail className="w-5 h-5" />
                    contato@conectapcd.com
                  </a>
                </div>
                <div className="flex justify-center gap-4">
                  <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-2 hover:bg-gradient-to-br hover:from-indigo-600 hover:to-violet-600 hover:text-white hover:border-transparent transition-all" asChild>
                    <a href="#">
                      <Linkedin className="h-5 w-5" />
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-2 hover:bg-gradient-to-br hover:from-indigo-600 hover:to-violet-600 hover:text-white hover:border-transparent transition-all" asChild>
                    <a href="#">
                      <Instagram className="h-5 w-5" />
                    </a>
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                  <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700" asChild>
                    <Link to="/privacidade">Política de Privacidade</Link>
                  </Button>
                  <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700" asChild>
                    <Link to="/termos">Termos de Uso</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </main>
      </div>
    </div>
  )
}
