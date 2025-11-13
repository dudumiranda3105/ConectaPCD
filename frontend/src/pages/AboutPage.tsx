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
  { name: 'Edson Gabriel', seed: 'edson' },
  { name: 'Eduarda Roberta', seed: 'eduarda' },
  { name: 'Eduardo de Miranda', seed: 'eduardo' },
  { name: 'Rebeca Chagas', seed: 'rebeca' },
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
    <div className="bg-background text-foreground">
      <div className="container mx-auto max-w-4xl py-16 px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Sobre o ConectaPCD
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Nossa jornada para um mercado de trabalho mais inclusivo e
            acessível.
          </p>
        </header>

        <main className="space-y-12">
          <AnimatedSection>
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Target className="w-8 h-8 text-primary" />
                  Missão e Propósito
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
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
            <h2 className="text-3xl font-bold text-center mb-10">
              Como Funciona
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {howItWorksSteps.map((step, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <step.icon className="w-10 h-10 text-primary" />
                      <CardTitle>{step.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection className="bg-secondary rounded-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center mb-10">
              Impacto Social
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              {impactData.map((item) => (
                <div key={item.label}>
                  <p className="text-4xl font-bold text-primary">
                    {item.value}
                  </p>
                  <p className="text-muted-foreground mt-2">{item.label}</p>
                </div>
              ))}
            </div>
            <p className="mt-10 text-center max-w-2xl mx-auto text-muted-foreground">
              O ConectaPCD reforça seu compromisso em tornar o mercado de
              trabalho mais inclusivo, facilitando a comunicação e valorizando
              competências.
            </p>
          </AnimatedSection>

          <AnimatedSection>
            <h2 className="text-3xl font-bold text-center mb-10">
              Nossa Equipe
            </h2>
            <p className="text-center max-w-3xl mx-auto text-muted-foreground mb-10">
              ConectaPCD é um projeto acadêmico desenvolvido por estudantes de
              Engenharia de Software do Uni-FACEF, com o objetivo de utilizar a
              tecnologia para a inclusão social.
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              {teamMembers.map((member) => (
                <div
                  key={member.name}
                  className="flex flex-col items-center gap-2"
                >
                  <Avatar className="w-24 h-24">
                    <AvatarImage
                      src={`https://img.usecurling.com/ppl/medium?seed=${member.seed}`}
                      alt={member.name}
                    />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <p className="font-semibold">{member.name}</p>
                </div>
              ))}
            </div>
            <p className="mt-10 text-center max-w-2xl mx-auto text-muted-foreground">
              Acreditamos que tecnologia e empatia podem mudar realidades. O
              ConectaPCD é nossa contribuição para uma sociedade mais justa e
              acessível.
            </p>
          </AnimatedSection>

          <AnimatedSection>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  Contato e Agradecimentos
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <p className="text-muted-foreground">
                  Agradecemos ao Uni-FACEF por incentivar a inovação e soluções
                  com propósito social.
                </p>
                <div>
                  <p className="font-semibold">Fale conosco:</p>
                  <a
                    href="mailto:contato@conectapcd.com"
                    className="text-primary hover:underline flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    contato@conectapcd.com
                  </a>
                </div>
                <div className="flex justify-center gap-4">
                  <Button variant="outline" size="icon" asChild>
                    <a href="#">
                      <Linkedin />
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <a href="#">
                      <Instagram />
                    </a>
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
                  <Button asChild>
                    <Link to="/privacidade">Política de Privacidade</Link>
                  </Button>
                  <Button asChild>
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
