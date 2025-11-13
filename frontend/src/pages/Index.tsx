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
      <section className="w-full py-20 md:py-32 lg:py-40 bg-secondary">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 animate-fade-in-up">
            Conectando talentos, promovendo inclusão.
          </h1>
          <p
            className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            A ponte direta entre profissionais com deficiência e empresas que
            valorizam a diversidade e a acessibilidade.
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            <Button size="lg" asChild>
              <Link to="/login">Encontrar Vagas</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">Anunciar uma Vaga</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="features" className="w-full py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Uma plataforma para todos
            </h2>
            <p className="max-w-2xl mx-auto text-muted-foreground mt-4">
              Descubra como o ConectaPCD pode impulsionar sua carreira ou sua
              empresa.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card
              className="animate-fade-in-up"
              style={{ animationDelay: '0.1s' }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-primary" />
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
            <Card
              className="animate-fade-in-up"
              style={{ animationDelay: '0.3s' }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Building className="w-8 h-8 text-primary" />
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
      <section id="accessibility" className="w-full py-20 md:py-28 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2 text-center md:text-left">
              <Accessibility className="w-24 h-24 text-primary mx-auto md:mx-0 mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold">
                Compromisso com a Acessibilidade
              </h2>
              <p className="text-lg text-muted-foreground mt-4">
                Nossa plataforma é desenvolvida seguindo as diretrizes WCAG 2.1
                AA, garantindo uma experiência de uso inclusiva para todos,
                independente de suas habilidades.
              </p>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://img.usecurling.com/p/600/400?q=people%20working%20on%20computer"
                alt="Pessoas diversas trabalhando juntas em um escritório"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Index
