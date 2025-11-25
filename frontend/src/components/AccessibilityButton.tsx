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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export const AccessibilityButton = () => {
  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
              <Button
                className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-lg shadow-xl border border-white/20 bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-600 text-white transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(79,70,229,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 group p-0"
                aria-label="Abrir menu de acessibilidade"
              >
                {/* Brilho interno */}
                <span className="absolute inset-0 rounded-lg bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-50" aria-hidden />
                
                {/* Ícone com animação */}
                <Accessibility className="h-5 w-5 sm:h-6 sm:w-6 relative transition-transform duration-300 group-hover:scale-110" />
              </Button>
            </div>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="left" className="font-semibold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-none shadow-xl">
          🎯 Opções de Acessibilidade
        </TooltipContent>
      </Tooltip>
      <DialogContent className="w-[calc(100%-2rem)] max-w-2xl sm:w-full max-h-[90vh] sm:max-h-[85vh] overflow-hidden rounded-2xl border-2 border-blue-200/50 shadow-2xl mx-4">
        {/* Header com gradiente */}
        <div className="-mx-6 -mt-6 mb-4 px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <Accessibility className="h-5 w-5 sm:h-7 sm:w-7" />
            </div>
            <div>
              <DialogTitle className="text-xl sm:text-2xl font-bold text-white mb-1">
                Opções de Acessibilidade
              </DialogTitle>
              <DialogDescription className="text-blue-100 text-xs sm:text-sm">
                ✨ Personalize sua experiência de navegação
              </DialogDescription>
            </div>
          </div>
        </div>
        <div className="max-h-[calc(90vh-160px)] sm:max-h-[calc(85vh-180px)] overflow-y-auto px-1 pr-2 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-blue-50 dark:scrollbar-thumb-blue-600 dark:scrollbar-track-blue-950/20 hover:scrollbar-thumb-blue-500 dark:hover:scrollbar-thumb-blue-500">
          <AccessibilityPanel />
        </div>
      </DialogContent>
    </Dialog>
  )
}
