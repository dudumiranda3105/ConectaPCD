import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Accessibility } from 'lucide-react'
import { AccessibilityPanel } from './AccessibilityPanel'

export const AccessibilityButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg z-50"
          size="icon"
          aria-label="Abrir menu de acessibilidade"
        >
          <Accessibility className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Opções de Acessibilidade</DialogTitle>
          <DialogDescription>
            Personalize sua experiência de navegação.
          </DialogDescription>
        </DialogHeader>
        <AccessibilityPanel />
      </DialogContent>
    </Dialog>
  )
}
