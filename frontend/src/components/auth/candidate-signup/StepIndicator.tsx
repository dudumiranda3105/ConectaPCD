import { cn } from '@/lib/utils'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  steps: string[]
}

export const StepIndicator = ({
  currentStep,
  totalSteps,
  steps,
}: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-between w-full max-w-md mx-auto mb-12">
      {steps.map((label, i) => {
        const stepNumber = i + 1
        const isActive = stepNumber === currentStep
        const isCompleted = stepNumber < currentStep

        return (
          <div key={stepNumber} className="flex flex-col items-center">
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors duration-300 border-2',
                isActive
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-secondary text-secondary-foreground border-border',
                isCompleted &&
                  'bg-primary/90 text-primary-foreground border-primary/90',
              )}
            >
              {stepNumber}
            </div>
            <p
              className={cn(
                'mt-2 text-sm text-center font-medium',
                isActive ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              {label}
            </p>
          </div>
        )
      })}
    </div>
  )
}
