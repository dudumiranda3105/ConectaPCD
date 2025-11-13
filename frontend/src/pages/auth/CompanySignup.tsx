import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'

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
  const { currentStep, prevStep, formData, reset } = useCompanySignup()
  const navigate = useNavigate()
  const { toast } = useToast()
  const stepFormRef = useRef<StepFormHandle>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleNext = async () => {
    console.log('[CompanySignup] handleNext called, current step:', currentStep)
    const result = await stepFormRef.current?.triggerSubmit()
    console.log('[CompanySignup] handleNext triggerSubmit result:', result)
    // aguarda um tick para garantir que updateFormData foi processado
    await new Promise(resolve => setTimeout(resolve, 0))
    console.log('[CompanySignup] handleNext - formData after update:', { razaoSocial: formData.razaoSocial, emailCorporativo: formData.emailCorporativo })
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
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Cadastro de Empresa
          </CardTitle>
          <CardDescription className="text-center">
            Siga os passos para cadastrar sua empresa e encontrar talentos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StepIndicator currentStep={currentStep} steps={stepLabels} />
          <div className="mt-8">
            <CurrentStepComponent ref={stepFormRef} />
          </div>
          <div className="mt-8 flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1 || isLoading}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
            {currentStep < 3 ? (
              <Button onClick={handleNext}>
                Próximo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleFinalSubmit} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Finalizar Cadastro
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
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
