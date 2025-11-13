import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Link } from 'react-router-dom'

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto max-w-4xl py-16 px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Política de Privacidade
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Como tratamos e protegemos seus dados
          </p>
        </header>

        <main>
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-semibold">
                Coleta de Dados
              </AccordionTrigger>
              <AccordionContent className="text-base md:text-lg text-muted-foreground text-justify leading-relaxed">
                Coletamos informações que você nos fornece diretamente ao se
                cadastrar e utilizar nossa plataforma. Isso inclui, mas não se
                limita a: nome completo, CPF, e-mail, endereço, informações de
                contato, dados sobre sua formação acadêmica e experiências
                profissionais. Para candidatos com deficiência, coletamos também
                informações sobre o tipo de deficiência e necessidades de
                acessibilidade, com o objetivo de conectar você às vagas mais
                adequadas.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-semibold">
                Uso das Informações
              </AccordionTrigger>
              <AccordionContent className="text-base md:text-lg text-muted-foreground text-justify leading-relaxed">
                As informações coletadas são utilizadas para: (a) criar e gerir
                sua conta; (b) personalizar sua experiência na plataforma; (c)
                permitir que empresas encontrem seu perfil com base em suas
                habilidades e necessidades de acessibilidade; (d) facilitar o
                processo de candidatura a vagas; (e) comunicar-se com você sobre
                sua conta ou oportunidades de emprego; e (f) melhorar a
                segurança e a funcionalidade de nossos serviços.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-semibold">
                Compartilhamento
              </AccordionTrigger>
              <AccordionContent className="text-base md:text-lg text-muted-foreground text-justify leading-relaxed">
                Seu perfil e as informações relevantes para a candidatura
                (excluindo dados sensíveis não autorizados) são compartilhados
                com as empresas nas quais você se candidata. Informações
                agregadas e anonimizadas podem ser utilizadas para fins de
                análise e pesquisa. Não vendemos suas informações pessoais a
                terceiros. O compartilhamento de dados com a equipe do projeto
                ocorre apenas para fins de suporte, manutenção e melhoria da
                plataforma.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-semibold">
                Segurança e Armazenamento
              </AccordionTrigger>
              <AccordionContent className="text-base md:text-lg text-muted-foreground text-justify leading-relaxed">
                Levamos a segurança dos seus dados a sério. Implementamos
                medidas de segurança técnicas e organizacionais para proteger
                suas informações contra acesso não autorizado, alteração,
                divulgação ou destruição. Isso inclui o uso de criptografia para
                dados em trânsito e em repouso, além de controles de acesso
                restritos e autenticação de múltiplos fatores para nossa equipe.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg font-semibold">
                Direitos do Usuário (LGPD)
              </AccordionTrigger>
              <AccordionContent className="text-base md:text-lg text-muted-foreground text-justify leading-relaxed">
                De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem
                o direito de: (a) acessar seus dados pessoais; (b) solicitar a
                retificação de dados incorretos ou desatualizados; (c) pedir a
                exclusão de seus dados; (d) opor-se ao processamento de seus
                dados; e (e) solicitar a portabilidade de seus dados para outro
                fornecedor de serviço. Para exercer esses direitos, entre em
                contato conosco.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger className="text-lg font-semibold">
                Contato
              </AccordionTrigger>
              <AccordionContent className="text-base md:text-lg text-muted-foreground text-justify leading-relaxed">
                Se você tiver alguma dúvida sobre esta Política de Privacidade
                ou desejar exercer seus direitos, entre em contato conosco pelo
                e-mail:{' '}
                <a
                  href="mailto:privacidade@conectapcd.com.br"
                  className="text-primary hover:underline"
                >
                  privacidade@conectapcd.com.br
                </a>
                .
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </main>

        <footer className="mt-12 text-center text-muted-foreground">
          <p>Última atualização: 10 de Novembro de 2025</p>
          <p className="mt-2">
            Consulte também nossos{' '}
            <Link to="/termos" className="text-primary hover:underline">
              Termos de Uso
            </Link>
            .
          </p>
        </footer>
      </div>
    </div>
  )
}
