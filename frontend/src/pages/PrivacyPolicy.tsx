import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Link } from 'react-router-dom'
import { Shield, Database, Share2, Lock, Scale, Mail, ArrowLeft, FileText } from 'lucide-react'

const sections = [
  {
    id: 'item-1',
    icon: Database,
    title: 'Coleta de Dados',
    color: 'blue',
    content: `Coletamos informações que você nos fornece diretamente ao se cadastrar e utilizar nossa plataforma. Isso inclui, mas não se limita a: nome completo, CPF, e-mail, endereço, informações de contato, dados sobre sua formação acadêmica e experiências profissionais. Para candidatos com deficiência, coletamos também informações sobre o tipo de deficiência e necessidades de acessibilidade, com o objetivo de conectar você às vagas mais adequadas.`
  },
  {
    id: 'item-2',
    icon: FileText,
    title: 'Uso das Informações',
    color: 'violet',
    content: `As informações coletadas são utilizadas para: (a) criar e gerir sua conta; (b) personalizar sua experiência na plataforma; (c) permitir que empresas encontrem seu perfil com base em suas habilidades e necessidades de acessibilidade; (d) facilitar o processo de candidatura a vagas; (e) comunicar-se com você sobre sua conta ou oportunidades de emprego; e (f) melhorar a segurança e a funcionalidade de nossos serviços.`
  },
  {
    id: 'item-3',
    icon: Share2,
    title: 'Compartilhamento',
    color: 'emerald',
    content: `Seu perfil e as informações relevantes para a candidatura (excluindo dados sensíveis não autorizados) são compartilhados com as empresas nas quais você se candidata. Informações agregadas e anonimizadas podem ser utilizadas para fins de análise e pesquisa. Não vendemos suas informações pessoais a terceiros. O compartilhamento de dados com a equipe do projeto ocorre apenas para fins de suporte, manutenção e melhoria da plataforma.`
  },
  {
    id: 'item-4',
    icon: Lock,
    title: 'Segurança e Armazenamento',
    color: 'amber',
    content: `Levamos a segurança dos seus dados a sério. Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição. Isso inclui o uso de criptografia para dados em trânsito e em repouso, além de controles de acesso restritos e autenticação de múltiplos fatores para nossa equipe.`
  },
  {
    id: 'item-5',
    icon: Scale,
    title: 'Direitos do Usuário (LGPD)',
    color: 'rose',
    content: `De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem o direito de: (a) acessar seus dados pessoais; (b) solicitar a retificação de dados incorretos ou desatualizados; (c) pedir a exclusão de seus dados; (d) opor-se ao processamento de seus dados; e (e) solicitar a portabilidade de seus dados para outro fornecedor de serviço. Para exercer esses direitos, entre em contato conosco.`
  },
  {
    id: 'item-6',
    icon: Mail,
    title: 'Contato',
    color: 'indigo',
    content: `Se você tiver alguma dúvida sobre esta Política de Privacidade ou desejar exercer seus direitos, entre em contato conosco pelo e-mail: privacidade@conectapcd.com.br`
  }
]

const colorClasses: Record<string, { bg: string; icon: string; border: string; hover: string }> = {
  blue: {
    bg: 'bg-blue-500/10',
    icon: 'text-blue-500',
    border: 'border-blue-200 dark:border-blue-800',
    hover: 'hover:border-blue-300 dark:hover:border-blue-700'
  },
  violet: {
    bg: 'bg-violet-500/10',
    icon: 'text-violet-500',
    border: 'border-violet-200 dark:border-violet-800',
    hover: 'hover:border-violet-300 dark:hover:border-violet-700'
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    icon: 'text-emerald-500',
    border: 'border-emerald-200 dark:border-emerald-800',
    hover: 'hover:border-emerald-300 dark:hover:border-emerald-700'
  },
  amber: {
    bg: 'bg-amber-500/10',
    icon: 'text-amber-500',
    border: 'border-amber-200 dark:border-amber-800',
    hover: 'hover:border-amber-300 dark:hover:border-amber-700'
  },
  rose: {
    bg: 'bg-rose-500/10',
    icon: 'text-rose-500',
    border: 'border-rose-200 dark:border-rose-800',
    hover: 'hover:border-rose-300 dark:hover:border-rose-700'
  },
  indigo: {
    bg: 'bg-indigo-500/10',
    icon: 'text-indigo-500',
    border: 'border-indigo-200 dark:border-indigo-800',
    hover: 'hover:border-indigo-300 dark:hover:border-indigo-700'
  }
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-violet-500/5 to-purple-500/5" />
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
        
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-8 pb-16 relative">
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
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl blur-xl opacity-50" />
                <div className="relative h-20 w-20 rounded-3xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 flex items-center justify-center shadow-2xl">
                  <Shield className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                Política de Privacidade
              </span>
            </h1>
            
            <p className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Sua privacidade é nossa prioridade. Saiba como coletamos, usamos e protegemos seus dados.
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-200 dark:border-emerald-800">
                <Lock className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Dados Criptografados</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-200 dark:border-blue-800">
                <Scale className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Conforme LGPD</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-200 dark:border-violet-800">
                <Shield className="h-4 w-4 text-violet-500" />
                <span className="text-sm font-medium text-violet-700 dark:text-violet-300">100% Seguro</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-16">
        <Accordion type="single" collapsible className="w-full space-y-4">
          {sections.map((section) => {
            const Icon = section.icon
            const colors = colorClasses[section.color]
            
            return (
              <AccordionItem 
                key={section.id}
                value={section.id} 
                className={`border-2 ${colors.border} ${colors.hover} rounded-2xl px-6 bg-white dark:bg-slate-900/50 shadow-sm hover:shadow-md transition-all duration-300`}
              >
                <AccordionTrigger className="py-5 hover:no-underline group">
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-xl ${colors.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                      <Icon className={`h-6 w-6 ${colors.icon}`} />
                    </div>
                    <span className="text-lg sm:text-xl font-bold text-left group-hover:text-foreground transition-colors">
                      {section.title}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <div className="pl-16">
                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-justify">
                      {section.id === 'item-6' ? (
                        <>
                          Se você tiver alguma dúvida sobre esta Política de Privacidade ou desejar exercer seus direitos, entre em contato conosco pelo e-mail:{' '}
                          <a
                            href="mailto:privacidade@conectapcd.com.br"
                            className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            privacidade@conectapcd.com.br
                          </a>
                        </>
                      ) : (
                        section.content
                      )}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>

        {/* Footer */}
        <div className="mt-12">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-purple-500/10 border border-indigo-200 dark:border-indigo-800 p-8">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-2xl" />
            <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-violet-500/10 blur-2xl" />
            
            <div className="relative text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-indigo-100 dark:border-indigo-900 mb-4">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-medium text-muted-foreground">Documento Atualizado</span>
              </div>
              
              <p className="text-lg font-semibold text-foreground">
                Última atualização: 10 de Novembro de 2025
              </p>
              
              <p className="mt-4 text-muted-foreground">
                Consulte também nossos{' '}
                <Link 
                  to="/termos" 
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                >
                  Termos de Uso
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
