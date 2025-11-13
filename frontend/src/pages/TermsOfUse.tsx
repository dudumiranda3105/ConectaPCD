import { Link } from 'react-router-dom'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

const termsSections = [
  {
    id: 'acceptance',
    title: 'Aceitação dos Termos',
    content:
      'Ao acessar e utilizar a plataforma ConectaPCD, você concorda em cumprir e estar sujeito a estes Termos de Uso e à nossa Política de Privacidade. Se você não concordar com qualquer parte dos termos, não poderá utilizar nossos serviços. O uso contínuo da plataforma após quaisquer alterações constitui sua aceitação dos novos termos.',
  },
  {
    id: 'registration',
    title: 'Cadastro e Responsabilidade',
    content:
      'Você concorda em fornecer informações verdadeiras, precisas, atuais e completas durante o processo de registro. Você é o único responsável pela confidencialidade de sua senha e por todas as atividades que ocorrem em sua conta. Notifique-nos imediatamente sobre qualquer uso não autorizado de sua conta.',
  },
  {
    id: 'platform-use',
    title: 'Uso da Plataforma',
    content:
      'É estritamente proibido publicar qualquer conteúdo que seja discriminatório, ofensivo, ilegal, fraudulento ou que viole os direitos de terceiros. Você concorda em não usar a plataforma para qualquer finalidade ilegal ou não autorizada. O conteúdo das vagas e dos perfis é de responsabilidade exclusiva de quem os publica.',
  },
  {
    id: 'copyright',
    title: 'Direitos Autorais e Propriedade Intelectual',
    content:
      'Todo o conteúdo presente na plataforma ConectaPCD, incluindo textos, gráficos, logos, ícones, imagens, e o software utilizado, é de propriedade da ConectaPCD ou de seus fornecedores de conteúdo e protegido pelas leis de direitos autorais. É proibida a cópia, reprodução, modificação ou distribuição de qualquer conteúdo ou código da plataforma sem nossa permissão expressa por escrito.',
  },
  {
    id: 'liability',
    title: 'Limitação de Responsabilidade',
    content:
      'A ConectaPCD atua como uma ponte entre candidatos e empresas. Não garantimos a contratação, o sucesso profissional, a veracidade das vagas publicadas ou a qualificação dos candidatos. Não nos responsabilizamos por quaisquer danos diretos ou indiretos resultantes do uso ou da incapacidade de usar a plataforma.',
  },
  {
    id: 'terms-changes',
    title: 'Alterações nos Termos',
    content:
      'Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação na plataforma. Notificaremos sobre alterações significativas através do site ou por e-mail. É sua responsabilidade revisar os termos periodicamente.',
  },
]

export default function TermsOfUsePage() {
  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto max-w-3xl py-16 px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Termos de Uso
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Regras e responsabilidades ao usar o ConectaPCD
          </p>
        </header>

        <main>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {termsSections.map((section) => (
              <AccordionItem key={section.id} value={section.id}>
                <AccordionTrigger className="text-lg font-semibold text-left">
                  {section.title}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground text-justify leading-relaxed">
                  {section.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 flex items-center space-x-3 p-4 border rounded-lg">
            <Checkbox
              id="terms-agreement"
              aria-describedby="terms-agreement-description"
            />
            <Label
              htmlFor="terms-agreement"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Li e concordo com os Termos de Uso
            </Label>
          </div>
        </main>

        <footer className="mt-12 flex flex-col sm:flex-row justify-between gap-4">
          <Button variant="outline" asChild>
            <Link to="/cadastro">Voltar</Link>
          </Button>
          <Button asChild>
            <Link to="/privacidade">Ir para Política de Privacidade</Link>
          </Button>
        </footer>
      </div>
    </div>
  )
}
