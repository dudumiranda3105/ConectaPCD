import { useRef, useState, useEffect } from 'react'
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
import { Loader2 } from 'lucide-react'

const stepComponents = [
  Step1PersonalData,
  Step2Address,
  Step3EducationExperience,
  Step4DisabilityInfo,
]

const stepLabels = ['Dados Pessoais', 'Endereço', 'Formação', 'Deficiência']

const CandidateSignupForm = () => {
  const { currentStep, prevStep, formData, reset } = useCandidateSignup()
  const navigate = useNavigate()
  const { toast } = useToast()
  const stepFormRef = useRef<StepFormHandle>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleNext = async () => {
    await stepFormRef.current?.triggerSubmit()
  }

  useEffect(() => {
    const finalSubmit = async () => {
      if (isSubmitting) {
        setIsLoading(true)
        const result = candidateSignupSchema.safeParse(formData)

        if (!result.success) {
          console.error(result.error.flatten().fieldErrors)
          toast({
            title: 'Erro de Validação',
            description:
              'Existem erros em passos anteriores. Por favor, revise seus dados.',
            variant: 'destructive',
          })
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

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Cadastro de Candidato
          </CardTitle>
          <CardDescription className="text-center">
            Siga os passos para completar seu perfil.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StepIndicator
            currentStep={currentStep}
            totalSteps={4}
            steps={stepLabels}
          />
          <div className="mt-8">
            <CurrentStepComponent ref={stepFormRef} />
          </div>
          <div className="mt-8 flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1 || isLoading}
            >
              Anterior
            </Button>
            {currentStep < 4 ? (
              <Button onClick={handleNext}>Próximo</Button>
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

export default function CandidateSignupPage() {
  return (
    <CandidateSignupProvider>
      <CandidateSignupForm />
    </CandidateSignupProvider>
  )
}
