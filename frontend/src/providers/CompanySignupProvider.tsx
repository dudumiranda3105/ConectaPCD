import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useCallback,
} from 'react'
import { CompanySignupFormValues } from '@/lib/schemas/company-signup-schema'

type CompanySignupContextType = {
  currentStep: number
  formData: Partial<CompanySignupFormValues>
  nextStep: () => void
  prevStep: () => void
  updateFormData: (data: Partial<CompanySignupFormValues>) => void
  reset: () => void
}

const CompanySignupContext = createContext<
  CompanySignupContextType | undefined
>(undefined)

const STORAGE_KEY = 'company-signup-form'

export const CompanySignupProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Partial<CompanySignupFormValues>>(
    () => {
      try {
        const savedData = localStorage.getItem(STORAGE_KEY)
        const parsed = savedData ? JSON.parse(savedData) : {}
        console.debug('[CompanySignupProvider] loaded formData from localStorage:', { keys: Object.keys(parsed), razaoSocial: parsed.razaoSocial, emailCorporativo: parsed.emailCorporativo, senha: parsed.senha ? '***' : 'missing' })
        return parsed
      } catch (error) {
        console.error('Failed to parse form data from localStorage', error)
        return {}
      }
    },
  )

  useEffect(() => {
    try {
      console.debug('[CompanySignupProvider] saving formData to localStorage:', { keys: Object.keys(formData), razaoSocial: formData.razaoSocial, emailCorporativo: formData.emailCorporativo, senha: formData.senha ? '***' : 'missing' })
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
    } catch (error) {
      console.error('Failed to save form data to localStorage', error)
    }
  }, [formData])

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1))

  const updateFormData = useCallback(
    (data: Partial<CompanySignupFormValues>) => {
      console.debug('[CompanySignupProvider] updateFormData called with:', { keys: Object.keys(data), razaoSocial: data.razaoSocial, emailCorporativo: data.emailCorporativo, senha: data.senha ? '***' : 'missing' })
      setFormData((prev) => {
        const merged = { ...prev, ...data }
        console.debug('[CompanySignupProvider] merged formData:', { keys: Object.keys(merged), razaoSocial: merged.razaoSocial, emailCorporativo: merged.emailCorporativo })
        return merged
      })
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
    updateFormData,
    reset,
  }

  return (
    <CompanySignupContext.Provider value={value}>
      {children}
    </CompanySignupContext.Provider>
  )
}

export const useCompanySignup = () => {
  const context = useContext(CompanySignupContext)
  if (context === undefined) {
    throw new Error(
      'useCompanySignup must be used within a CompanySignupProvider',
    )
  }
  return context
}
