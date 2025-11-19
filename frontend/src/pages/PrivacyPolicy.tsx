import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Link } from 'react-router-dom'

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-gradient-to-b from-background via-indigo-50/30 to-background dark:from-background dark:via-indigo-950/10 dark:to-background text-foreground">
      <div className="container mx-auto max-w-4xl py-16 px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16 relative">
          <div className="inline-flex h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-600 to-purple-700 items-center justify-center shadow-2xl mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
            Política de Privacidade
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Como tratamos e protegemos seus dados
          </p>
        </header>

        <main>
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="border-2 border-indigo-100 dark:border-indigo-900 rounded-xl px-6 bg-gradient-to-r from-background to-indigo-50/30 dark:to-indigo-950/20">
              <AccordionTrigger className="text-xl font-bold hover:text-indigo-600 dark:hover:text-indigo-400">
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

            <AccordionItem value="item-2" className="border-2 border-indigo-100 dark:border-indigo-900 rounded-xl px-6 bg-gradient-to-r from-background to-indigo-50/30 dark:to-indigo-950/20">
              <AccordionTrigger className="text-xl font-bold hover:text-indigo-600 dark:hover:text-indigo-400">
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

            <AccordionItem value="item-3" className="border-2 border-indigo-100 dark:border-indigo-900 rounded-xl px-6 bg-gradient-to-r from-background to-indigo-50/30 dark:to-indigo-950/20">
              <AccordionTrigger className="text-xl font-bold hover:text-indigo-600 dark:hover:text-indigo-400">
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

            <AccordionItem value="item-4" className="border-2 border-indigo-100 dark:border-indigo-900 rounded-xl px-6 bg-gradient-to-r from-background to-indigo-50/30 dark:to-indigo-950/20">
              <AccordionTrigger className="text-xl font-bold hover:text-indigo-600 dark:hover:text-indigo-400">
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

            <AccordionItem value="item-5" className="border-2 border-indigo-100 dark:border-indigo-900 rounded-xl px-6 bg-gradient-to-r from-background to-indigo-50/30 dark:to-indigo-950/20">
              <AccordionTrigger className="text-xl font-bold hover:text-indigo-600 dark:hover:text-indigo-400">
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

            <AccordionItem value="item-6" className="border-2 border-indigo-100 dark:border-indigo-900 rounded-xl px-6 bg-gradient-to-r from-background to-indigo-50/30 dark:to-indigo-950/20">
              <AccordionTrigger className="text-xl font-bold hover:text-indigo-600 dark:hover:text-indigo-400">
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

        <footer className="mt-16 text-center">
          <div className="inline-block bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/50 dark:to-violet-950/50 rounded-2xl p-6 border-2 border-indigo-100 dark:border-indigo-900">
            <p className="text-muted-foreground font-semibold">Última atualização: 10 de Novembro de 2025</p>
            <p className="mt-3 text-muted-foreground">
              Consulte também nossos{' '}
              <Link to="/termos" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                Termos de Uso
              </Link>
              .
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
