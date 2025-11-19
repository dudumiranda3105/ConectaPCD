import { useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import {
  CompanySignupProvider,
  useCompanySignup,
} from '@/providers/CompanySignupProvider'
import { StepIndicator } from '@/components/auth/company-signup/StepIndicator'
import {
  Step1CompanyData,
  StepFormHandle,
} from '@/components/auth/company-signup/Step1CompanyData'
import { Step2AddressContact } from '@/components/auth/company-signup/Step2AddressContact'
import { Step3Infrastructure } from '@/components/auth/company-signup/Step3Infrastructure'
import { companySignupSchema } from '@/lib/schemas/company-signup-schema'
import { ChevronLeft, ChevronRight, Loader2, Building2 } from 'lucide-react'

const stepComponents = [
  Step1CompanyData,
  Step2AddressContact,
  Step3Infrastructure,
]
const stepLabels = [
  'Dados da Empresa',
  'Endereço e Responsável',
  'Infraestrutura',
]

const CompanySignupForm = () => {
  const { currentStep, nextStep, prevStep, formData, reset } = useCompanySignup()
  const navigate = useNavigate()
  const { toast } = useToast()
  const stepFormRef = useRef<StepFormHandle>(null)
  const [isLoading, setIsLoading] = useState(false)

  const progressPercentage = (currentStep / 3) * 100

  const handleNext = async () => {
    // Apenas dispara a validação/submissão do step atual.
    // A progressão de etapa é controlada dentro de cada Step (onSubmit -> nextStep()).
    await stepFormRef.current?.triggerSubmit()
  }

  const handleFinalSubmit = async () => {
    setIsLoading(true)
    console.log('[CompanySignup] handleFinalSubmit called, currentStep:', currentStep)
    const isStepValid = await stepFormRef.current?.triggerSubmit()
    console.log('[CompanySignup] handleFinalSubmit triggerSubmit result:', isStepValid)
    if (!isStepValid) {
      toast({
        title: 'Formulário Inválido',
        description: 'Por favor, corrija os erros no passo atual.',
        variant: 'destructive',
      })
      setIsLoading(false)
      return
    }

    // aguarda um tick para garantir que updateFormData foi processado
    await new Promise(resolve => setTimeout(resolve, 0))
    console.log('[CompanySignup] handleFinalSubmit - formData before validation:', { razaoSocial: formData.razaoSocial, emailCorporativo: formData.emailCorporativo, keys: Object.keys(formData) })

    // NÃO valida contra o schema completo (que exige todos os 27 campos)
    // Em vez disso, extrai os dados do Passo 1 diretamente
    const payload = formData as any

    // Validação simples dos campos obrigatórios do Passo 1
    if (!payload.razaoSocial || !payload.emailCorporativo || !payload.senha) {
      console.error('[CompanySignup] Missing required fields:', { razaoSocial: !!payload.razaoSocial, emailCorporativo: !!payload.emailCorporativo, senha: !!payload.senha })
      toast({
        title: 'Campos Obrigatórios',
        description: 'Razão Social, Email e Senha são obrigatórios.',
        variant: 'destructive',
      })
      setIsLoading(false)
      return
    }

    try {
      const registerPayload = {
        name: payload.razaoSocial,
        email: payload.emailCorporativo,
        password: payload.senha,
        role: 'company' as const,
      }
      console.log('[CompanySignup] registerPayload to send:', { name: registerPayload.name, email: registerPayload.email, password: registerPayload.password ? '***' : 'missing' })

      const { register } = await import('@/services/auth')
      const res = await register(registerPayload)
      if (res.token) localStorage.setItem('auth_token', res.token)
      if (res.user) localStorage.setItem('auth_user', JSON.stringify(res.user))
      // salva dados da empresa no backend
      if (res.token) {
        await fetch(`${import.meta.env?.VITE_API_URL || 'http://localhost:3000'}/profiles/company`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${res.token}` },
          body: JSON.stringify(payload),
        })
      }
      toast({ title: 'Cadastro realizado com sucesso!', description: 'Sua empresa foi cadastrada na plataforma.' })
      reset()
      navigate('/dashboard/empresa')
    } catch (err: any) {
      toast({ title: 'Erro ao Cadastrar', description: err.message || 'Não foi possível cadastrar a empresa.', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  const CurrentStepComponent = stepComponents[currentStep - 1]

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-green-500/20 blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
      </div>
      
      <div className="relative w-full max-w-2xl">
        <Card className="shadow-2xl border-2">
          {/* Header com gradiente aprimorado */}
          <div className="bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 px-8 py-12 rounded-t-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,white)]"></div>
            <div className="relative z-10 text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 bg-white/20 rounded-2xl backdrop-blur-md flex items-center justify-center shadow-2xl">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-4xl text-white font-bold mb-2">
                Cadastro de Empresa
              </CardTitle>
              <CardDescription className="text-emerald-100 text-lg">
                Siga os {stepLabels.length} passos para cadastrar sua empresa e encontrar talentos
              </CardDescription>
            </div>
          </div>

          <CardContent className="pt-8 pb-8">
            {/* Step Indicator */}
            <StepIndicator currentStep={currentStep} steps={stepLabels} />

            {/* Conteúdo do step */}
            <div className="mt-10 min-h-[400px]">
              <CurrentStepComponent ref={stepFormRef} />
            </div>

            {/* Botões de navegação */}
            <div className="mt-10 flex justify-between gap-4">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1 || isLoading}
                className="flex items-center gap-2 px-6 py-2 h-11"
              >
                <ChevronLeft className="w-4 h-4" />
                Voltar
              </Button>
              {currentStep < 3 ? (
                <Button 
                  onClick={handleNext}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-2 h-11 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold"
                >
                  Próximo
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button 
                  onClick={handleFinalSubmit} 
                  disabled={isLoading}
                  className="flex items-center gap-2 px-8 py-2 h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isLoading ? 'Finalizando...' : 'Finalizar Cadastro'}
                </Button>
              )}
            </div>

            {/* Link para login */}
            <div className="mt-6 text-center border-t pt-6">
              <p className="text-sm text-muted-foreground mb-2">
                Já tem uma empresa cadastrada?
              </p>
              <Link to="/login" className="inline-flex items-center gap-2 text-base font-semibold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent hover:from-emerald-700 hover:to-green-700 transition-all">
                Faça login aqui →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function CompanySignupPage() {
  return (
    <CompanySignupProvider>
      <CompanySignupForm />
    </CompanySignupProvider>
  )
}
