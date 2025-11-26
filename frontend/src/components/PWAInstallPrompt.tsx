import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Verificar se já está instalado
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Escutar evento de instalação
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Mostrar prompt após 30 segundos ou se usuário já visitou antes
      const hasVisited = localStorage.getItem('pwa_prompt_shown');
      if (hasVisited) {
        setShowPrompt(true);
      } else {
        setTimeout(() => {
          setShowPrompt(true);
          localStorage.setItem('pwa_prompt_shown', 'true');
        }, 30000);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Não mostrar novamente por 7 dias
    localStorage.setItem('pwa_prompt_dismissed', Date.now().toString());
  };

  // Verificar se foi dispensado recentemente
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa_prompt_dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - dismissedTime < sevenDays) {
        setShowPrompt(false);
      }
    }
  }, []);

  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className={cn(
      "fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50",
      "bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-2xl",
      "transform transition-all duration-500 ease-out",
      "animate-in slide-in-from-bottom-5"
    )}>
      <div className="p-4">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-white/70 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-white text-sm">
              Instalar ConectaPCD
            </h3>
            <p className="text-white/80 text-xs mt-0.5 leading-relaxed">
              Instale o app para acesso rápido e notificações de novas vagas!
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 mt-3">
          <Button
            onClick={handleInstall}
            size="sm"
            className="flex-1 bg-white text-indigo-600 hover:bg-white/90"
          >
            <Download className="w-4 h-4 mr-1" />
            Instalar App
          </Button>
          <Button
            onClick={handleDismiss}
            variant="ghost"
            size="sm"
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            Agora não
          </Button>
        </div>
      </div>
    </div>
  );
}
