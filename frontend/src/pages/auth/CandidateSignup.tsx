import { useRef, useState, useEffect } from 'react'
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
  CandidateSignupProvider,
  useCandidateSignup,
} from '@/providers/CandidateSignupProvider'
import { StepIndicator } from '@/components/auth/candidate-signup/StepIndicator'
import {
  Step1PersonalData,
  StepFormHandle,
} from '@/components/auth/candidate-signup/Step1PersonalData'
import { Step2Address } from '@/components/auth/candidate-signup/Step2Address'
import { Step3EducationExperience } from '@/components/auth/candidate-signup/Step3EducationExperience'
import { Step4DisabilityInfo } from '@/components/auth/candidate-signup/Step4DisabilityInfo'
import { candidateSignupSchema } from '@/lib/schemas/candidate-signup-schema'
import { signUpCandidate } from '@/services/candidate'
import { Loader2, ChevronLeft, ChevronRight, User } from 'lucide-react'

const stepComponents = [
  Step1PersonalData,
  Step2Address,
  Step3EducationExperience,
  Step4DisabilityInfo,
]

const stepLabels = ['Dados Pessoais', 'Endereço', 'Formação', 'Deficiência']

const CandidateSignupForm = () => {
  const { currentStep, nextStep, prevStep, goToStep, formData, reset } = useCandidateSignup()
  const navigate = useNavigate()
  const { toast } = useToast()
  const stepFormRef = useRef<StepFormHandle>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [canProceed, setCanProceed] = useState(false)

  // Atualizar canProceed quando step mudar ou após pequeno delay
  useEffect(() => {
    const checkValidity = () => {
      if (stepFormRef.current) {
        setCanProceed(stepFormRef.current.isFormValid())
      }
    }
    
    // Verificação inicial
    checkValidity()
    
    // Verificação periódica para capturar mudanças no formulário
    const interval = setInterval(checkValidity, 300)
    
    return () => clearInterval(interval)
  }, [currentStep])

  const handleNext = async () => {
    const isValid = await stepFormRef.current?.triggerSubmit()
    if (isValid) {
      nextStep()
    }
  }

  useEffect(() => {
    const finalSubmit = async () => {
      if (isSubmitting) {
        setIsLoading(true)
        const result = candidateSignupSchema.safeParse(formData)

        if (!result.success) {
          const fieldErrors = result.error.flatten().fieldErrors
          console.error('Validation errors:', fieldErrors)
          
          // Mapear campos para steps
          const personalFields = ['name', 'cpf', 'telefone', 'dataNascimento', 'genero', 'email', 'password', 'confirmPassword']
          const addressFields = ['cep', 'uf', 'cidade', 'bairro', 'rua', 'numero', 'complemento']
          const educationFields = ['educationLevel', 'course', 'institution', 'curriculoUrl', 'linkedin', 'portfolio', 'biografia', 'experiences']
          const disabilityFields = ['disabilities', 'assistiveResources']
          
          // Encontrar primeiro step com erro
          const errorFields = Object.keys(fieldErrors)
          let targetStep = currentStep
          
          if (errorFields.some(f => personalFields.includes(f))) {
            targetStep = 1
          } else if (errorFields.some(f => addressFields.includes(f))) {
            targetStep = 2
          } else if (errorFields.some(f => educationFields.includes(f))) {
            targetStep = 3
          } else if (errorFields.some(f => disabilityFields.includes(f))) {
            targetStep = 4
          }
          
          // Criar mensagem de erro amigável
          const errorMessages = Object.entries(fieldErrors)
            .filter(([_, msgs]) => Array.isArray(msgs) && msgs.length > 0)
            .map(([field, msgs]) => `${field}: ${(msgs as string[])[0]}`)
            .slice(0, 5)
          
          toast({
            title: `Erro de Validação - Passo ${targetStep}`,
            description: errorMessages.join(' • '),
            variant: 'destructive',
          })
          
          goToStep(targetStep)
          setIsLoading(false)
          setIsSubmitting(false)
          return
        }

        try {
          await signUpCandidate(result.data)
          toast({
            title: 'Cadastro realizado com sucesso!',
            description: 'Você será redirecionado para o seu painel.',
          })
          reset()
          navigate('/dashboard/candidato')
        } catch (error: any) {
          toast({
            title: 'Erro no Cadastro',
            description:
              error.message || 'Não foi possível completar o cadastro.',
            variant: 'destructive',
          })
        } finally {
          setIsLoading(false)
          setIsSubmitting(false)
        }
      }
    }

    finalSubmit()
  }, [isSubmitting, formData, navigate, reset, toast])

  const handleFinalSubmit = async () => {
    const isStepValid = await stepFormRef.current?.triggerSubmit()
    if (isStepValid) {
      setIsSubmitting(true)
    }
  }

  const CurrentStepComponent = stepComponents[currentStep - 1]
  const progressPercentage = (currentStep / 4) * 100

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
      </div>
      
      <div className="relative w-full max-w-2xl">
        <Card className="shadow-2xl border-2">
          {/* Header com gradiente aprimorado */}
          <div className="bg-gradient-to-r from-blue-500 via-indigo-600 to-violet-700 px-8 py-12 rounded-t-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,white)]"></div>
            <div className="relative z-10 text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 bg-white/20 rounded-2xl backdrop-blur-md flex items-center justify-center shadow-2xl">
                  <User className="w-8 h-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-4xl text-white font-bold mb-2">
                Cadastro de Candidato
              </CardTitle>
              <CardDescription className="text-blue-100 text-lg">
                Siga os {stepLabels.length} passos para completar seu perfil
              </CardDescription>
            </div>
          </div>

          <CardContent className="pt-8 pb-8">
            {/* Step Indicator */}
            <StepIndicator
              currentStep={currentStep}
              totalSteps={4}
              steps={stepLabels}
            />

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
                Anterior
              </Button>
              {currentStep < 4 ? (
                <Button 
                  onClick={handleNext}
                  disabled={isLoading || !canProceed}
                  className="flex items-center gap-2 px-6 py-2 h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próximo
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button 
                  onClick={handleFinalSubmit} 
                  disabled={isLoading || !canProceed}
                  className="flex items-center gap-2 px-8 py-2 h-11 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isLoading ? 'Finalizando...' : 'Finalizar Cadastro'}
                </Button>
              )}
            </div>

            {/* Link para login */}
            <div className="mt-6 text-center border-t pt-6">
              <p className="text-sm text-muted-foreground mb-2">
                Já tem uma conta?
              </p>
              <Link to="/login" className="inline-flex items-center gap-2 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-indigo-700 transition-all">
                Faça login aqui →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function CandidateSignupPage() {
  return (
    <CandidateSignupProvider>
      <CandidateSignupForm />
    </CandidateSignupProvider>
  )
}
