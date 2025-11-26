import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Accessibility, X, Sparkles } from 'lucide-react'
import { AccessibilityPanel } from './AccessibilityPanel'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export const AccessibilityButton = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
              <Button
                className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-2xl shadow-2xl border-0 bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600 text-white transition-all duration-500 hover:scale-110 hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(79,70,229,0.4)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400/50 group p-0 overflow-hidden"
                aria-label="Abrir menu de acessibilidade"
              >
                {/* Animated background rings */}
                <span className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/20 via-transparent to-white/10 opacity-100" aria-hidden />
                <span className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-400 via-indigo-500 to-violet-500 opacity-0 blur-lg group-hover:opacity-60 transition-opacity duration-500" aria-hidden />
                
                {/* Pulse effect */}
                <span className="absolute inset-0 rounded-2xl animate-ping bg-indigo-400/30 group-hover:bg-indigo-400/40" style={{ animationDuration: '2s' }} aria-hidden />
                
                {/* Icon container */}
                <div className="relative flex items-center justify-center">
                  <Accessibility className="h-7 w-7 sm:h-8 sm:w-8 transition-all duration-300 group-hover:scale-110 drop-shadow-lg" />
                </div>

                {/* Shine effect on hover */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" aria-hidden />
              </Button>
            </div>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="left" sideOffset={10} className="font-semibold text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white border-none shadow-2xl px-4 py-2 rounded-xl">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Acessibilidade
          </div>
        </TooltipContent>
      </Tooltip>

      <DialogContent className="w-[calc(100%-2rem)] max-w-2xl sm:w-full max-h-[90vh] sm:max-h-[85vh] overflow-hidden rounded-3xl border-0 shadow-[0_25px_80px_rgba(0,0,0,0.3)] mx-4 p-0 gap-0">
        {/* Header com gradiente animado */}
        <div className="relative px-6 pt-6 pb-5 bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-600 text-white overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px]" />
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-violet-400/20 blur-3xl" />
          <div className="absolute right-10 bottom-0 h-32 w-32 rounded-full bg-blue-400/10 blur-2xl" />
          
          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            <X className="h-4 w-4 text-white" />
          </button>
          
          {/* Header content */}
          <div className="relative flex items-center gap-4">
            <div className="h-16 w-16 sm:h-18 sm:w-18 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-xl border border-white/30">
              <Accessibility className="h-8 w-8 sm:h-9 sm:w-9 text-white drop-shadow-lg" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Acessibilidade
              </DialogTitle>
              <DialogDescription className="text-blue-100 text-sm sm:text-base mt-1 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Personalize sua experiência de navegação
              </DialogDescription>
            </div>
          </div>

          {/* Quick stats */}
          <div className="relative flex gap-3 mt-5">
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
              <span className="text-white/90 text-sm font-medium">🎯 Interface</span>
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
              <span className="text-white/90 text-sm font-medium">⌨️ Teclado</span>
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
              <span className="text-white/90 text-sm font-medium">🔊 Áudio</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[calc(90vh-200px)] sm:max-h-[calc(85vh-220px)] overflow-y-auto px-2 py-4 scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-transparent dark:scrollbar-thumb-indigo-600 hover:scrollbar-thumb-indigo-400 dark:hover:scrollbar-thumb-indigo-500">
          <AccessibilityPanel />
        </div>
      </DialogContent>
    </Dialog>
  )
}
