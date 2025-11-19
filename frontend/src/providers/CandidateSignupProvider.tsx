import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useCallback,
} from 'react'
import { useLocation } from 'react-router-dom'
import { CandidateSignupFormValues } from '@/lib/schemas/candidate-signup-schema'

type CandidateSignupContextType = {
  currentStep: number
  formData: Partial<CandidateSignupFormValues>
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  updateFormData: (data: Partial<CandidateSignupFormValues>) => void
  reset: () => void
}

const CandidateSignupContext = createContext<
  CandidateSignupContextType | undefined
>(undefined)

const STORAGE_KEY = 'candidate-signup-form'

export const CandidateSignupProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const location = useLocation()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Partial<CandidateSignupFormValues>>(
    () => {
      try {
        const savedData = localStorage.getItem(STORAGE_KEY)
        const parsed = savedData ? JSON.parse(savedData) : {}
        console.debug('[CandidateSignupProvider] loaded formData from localStorage:', { name: parsed.name, email: parsed.email, password: parsed.password ? '***' : undefined, keys: Object.keys(parsed) })
        return parsed
      } catch (error) {
        console.error('Failed to parse form data from localStorage', error)
        return {}
      }
    },
  )

  // Limpar dados ao sair do formulário
  useEffect(() => {
    if (!location.pathname.includes('/signup/candidate')) {
      console.debug('[CandidateSignupProvider] User left signup page, clearing form data')
      localStorage.removeItem(STORAGE_KEY)
      setFormData({})
      setCurrentStep(1)
    }
  }, [location.pathname])

  useEffect(() => {
    try {
      console.debug('[CandidateSignupProvider] saving formData to localStorage:', { name: formData.name, email: formData.email, password: formData.password ? '***' : undefined, keys: Object.keys(formData) })
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
    } catch (error) {
      console.error('Failed to save form data to localStorage', error)
    }
  }, [formData])

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1))
  const goToStep = (step: number) => setCurrentStep(Math.max(1, Math.min(step, 4)))

  const updateFormData = useCallback(
    (data: Partial<CandidateSignupFormValues>) => {
      setFormData((prev) => ({ ...prev, ...data }))
    },
    [],
  )

  const reset = () => {
    setCurrentStep(1)
    setFormData({})
    localStorage.removeItem(STORAGE_KEY)
  }

  const value = {
    currentStep,
    formData,
    nextStep,
    prevStep,
    goToStep,
    updateFormData,
    reset,
  }

  return (
    <CandidateSignupContext.Provider value={value}>
      {children}
    </CandidateSignupContext.Provider>
  )
}

export const useCandidateSignup = () => {
  const context = useContext(CandidateSignupContext)
  if (context === undefined) {
    throw new Error(
      'useCandidateSignup must be used within a CandidateSignupProvider',
    )
  }
  return context
}
