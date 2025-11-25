import { Link } from 'react-router-dom'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { 
  FileText, 
  CheckCircle2, 
  UserCheck, 
  Monitor, 
  Copyright, 
  AlertTriangle, 
  RefreshCw,
  ArrowLeft,
  Shield,
  Scale,
  Handshake
} from 'lucide-react'

const termsSections = [
  {
    id: 'acceptance',
    title: 'Aceitação dos Termos',
    icon: CheckCircle2,
    color: 'emerald',
    content:
      'Ao acessar e utilizar a plataforma ConectaPCD, você concorda em cumprir e estar sujeito a estes Termos de Uso e à nossa Política de Privacidade. Se você não concordar com qualquer parte dos termos, não poderá utilizar nossos serviços. O uso contínuo da plataforma após quaisquer alterações constitui sua aceitação dos novos termos.',
  },
  {
    id: 'registration',
    title: 'Cadastro e Responsabilidade',
    icon: UserCheck,
    color: 'blue',
    content:
      'Você concorda em fornecer informações verdadeiras, precisas, atuais e completas durante o processo de registro. Você é o único responsável pela confidencialidade de sua senha e por todas as atividades que ocorrem em sua conta. Notifique-nos imediatamente sobre qualquer uso não autorizado de sua conta.',
  },
  {
    id: 'platform-use',
    title: 'Uso da Plataforma',
    icon: Monitor,
    color: 'violet',
    content:
      'É estritamente proibido publicar qualquer conteúdo que seja discriminatório, ofensivo, ilegal, fraudulento ou que viole os direitos de terceiros. Você concorda em não usar a plataforma para qualquer finalidade ilegal ou não autorizada. O conteúdo das vagas e dos perfis é de responsabilidade exclusiva de quem os publica.',
  },
  {
    id: 'copyright',
    title: 'Direitos Autorais e Propriedade Intelectual',
    icon: Copyright,
    color: 'amber',
    content:
      'Todo o conteúdo presente na plataforma ConectaPCD, incluindo textos, gráficos, logos, ícones, imagens, e o software utilizado, é de propriedade da ConectaPCD ou de seus fornecedores de conteúdo e protegido pelas leis de direitos autorais. É proibida a cópia, reprodução, modificação ou distribuição de qualquer conteúdo ou código da plataforma sem nossa permissão expressa por escrito.',
  },
  {
    id: 'liability',
    title: 'Limitação de Responsabilidade',
    icon: AlertTriangle,
    color: 'rose',
    content:
      'A ConectaPCD atua como uma ponte entre candidatos e empresas. Não garantimos a contratação, o sucesso profissional, a veracidade das vagas publicadas ou a qualificação dos candidatos. Não nos responsabilizamos por quaisquer danos diretos ou indiretos resultantes do uso ou da incapacidade de usar a plataforma.',
  },
  {
    id: 'terms-changes',
    title: 'Alterações nos Termos',
    icon: RefreshCw,
    color: 'indigo',
    content:
      'Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação na plataforma. Notificaremos sobre alterações significativas através do site ou por e-mail. É sua responsabilidade revisar os termos periodicamente.',
  },
]

const colorClasses: Record<string, { bg: string; icon: string; border: string; hover: string }> = {
  emerald: {
    bg: 'bg-emerald-500/10',
    icon: 'text-emerald-500',
    border: 'border-emerald-200 dark:border-emerald-800',
    hover: 'hover:border-emerald-300 dark:hover:border-emerald-700'
  },
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

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-purple-500/5 to-pink-500/5" />
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />
        
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
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl blur-xl opacity-50" />
                <div className="relative h-20 w-20 rounded-3xl bg-gradient-to-br from-violet-500 via-purple-500 to-pink-600 flex items-center justify-center shadow-2xl">
                  <FileText className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Termos de Uso
              </span>
            </h1>
            
            <p className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Regras e responsabilidades para uma experiência segura e justa na plataforma ConectaPCD.
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-200 dark:border-violet-800">
                <Scale className="h-4 w-4 text-violet-500" />
                <span className="text-sm font-medium text-violet-700 dark:text-violet-300">Termos Claros</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-200 dark:border-emerald-800">
                <Handshake className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Uso Responsável</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-200 dark:border-blue-800">
                <Shield className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Proteção Legal</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-16">
        <Accordion type="single" collapsible className="w-full space-y-4">
          {termsSections.map((section) => {
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
                      {section.content}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>

        {/* Footer */}
        <div className="mt-12">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-pink-500/10 border border-violet-200 dark:border-violet-800 p-8">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-violet-500/10 blur-2xl" />
            <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-purple-500/10 blur-2xl" />
            
            <div className="relative text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-violet-100 dark:border-violet-900 mb-4">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-medium text-muted-foreground">Documento Atualizado</span>
              </div>
              
              <p className="text-lg font-semibold text-foreground">
                Última atualização: 10 de Novembro de 2025
              </p>
              
              <p className="mt-4 text-muted-foreground">
                Consulte também nossa{' '}
                <Link 
                  to="/privacidade" 
                  className="font-semibold text-violet-600 dark:text-violet-400 hover:underline inline-flex items-center gap-1"
                >
                  Política de Privacidade
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
