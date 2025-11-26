import { useAccessibility } from '@/providers/AccessibilityProvider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Volume2,
  Keyboard,
  BookOpen,
  Sparkles,
  RotateCcw,
  Minus,
  Plus,
  Type,
  Eye,
  Palette,
  MousePointer2,
  Zap,
  SunMoon,
  Monitor,
  CheckCircle2,
} from 'lucide-react'

const AccessibilityOption = ({
  label,
  description,
  icon: Icon,
  iconColor = 'text-blue-600',
  iconBg = 'bg-blue-100 dark:bg-blue-900/30',
  children,
  isActive = false,
}: {
  label: string
  description: string
  icon?: React.ComponentType<{ className?: string }>
  iconColor?: string
  iconBg?: string
  children: React.ReactNode
  isActive?: boolean
}) => (
  <div className={`group relative flex items-center justify-between rounded-2xl border-2 p-4 shadow-sm hover:shadow-lg transition-all duration-300 ${
    isActive 
      ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 dark:border-blue-600' 
      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-blue-300 dark:hover:border-blue-700'
  }`}>
    {isActive && (
      <div className="absolute -top-2 -right-2">
        <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center shadow-lg">
          <CheckCircle2 className="h-3 w-3 text-white" />
        </div>
      </div>
    )}
    <div className="flex items-center gap-3 flex-1">
      {Icon && (
        <div className={`h-10 w-10 rounded-xl ${iconBg} flex items-center justify-center transition-transform group-hover:scale-110`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      )}
      <div className="space-y-0.5 flex-1">
        <Label className="font-semibold text-sm cursor-pointer">{label}</Label>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
    <div className="ml-4">
      {children}
    </div>
  </div>
)

export const AccessibilityPanel = () => {
  const {
    isTtsEnabled,
    toggleTts,
    contrastMode,
    setContrastMode,
    fontSize,
    setFontSize,
    textSpacing,
    setTextSpacing,
    fontFamily,
    setFontFamily,
    showFocusOutline,
    toggleFocusOutline,
    highlightLinks,
    toggleHighlightLinks,
    reducedMotion,
    toggleReducedMotion,
    grayscale,
    toggleGrayscale,
    colorBlindMode,
    setColorBlindMode,
    resetAccessibilitySettings,
  } = useAccessibility()

  return (
    <div className="px-4 pb-4">
      <Accordion type="multiple" className="w-full space-y-3" defaultValue={['visual']}>
        {/* Interface Adjustments */}
        <AccordionItem value="visual" className="border-0 rounded-2xl bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 overflow-hidden">
          <AccordionTrigger className="text-base font-semibold hover:no-underline px-4 py-4 hover:bg-blue-100/50 dark:hover:bg-blue-900/20 transition-all [&[data-state=open]]:bg-blue-100/50 dark:[&[data-state=open]]:bg-blue-900/20">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <span className="block">Ajustes de Interface</span>
                <span className="text-xs font-normal text-muted-foreground">Fonte, tamanho e espaçamento</span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2">
            <div className="space-y-4">
              {/* Font Size */}
              <div className="rounded-2xl border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Type className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <Label className="font-semibold text-base">Tamanho da Fonte</Label>
                      <p className="text-xs text-muted-foreground">Ajuste o tamanho do texto</p>
                    </div>
                  </div>
                  <div className="h-10 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white font-bold">{Math.round(fontSize * 100)}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setFontSize(Math.max(0.8, fontSize - 0.1))}
                    className="h-11 w-11 rounded-xl border-2 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all"
                  >
                    <Minus className="h-5 w-5" />
                  </Button>
                  <div className="flex-1 px-2">
                    <Slider
                      value={[fontSize]}
                      onValueChange={(value) => setFontSize(value[0])}
                      min={0.8}
                      max={1.5}
                      step={0.1}
                      className="cursor-pointer"
                    />
                  </div>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setFontSize(Math.min(1.5, fontSize + 0.1))}
                    className="h-11 w-11 rounded-xl border-2 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all"
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Text Spacing */}
              <div className="rounded-2xl border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <span className="text-indigo-600 font-bold text-lg">Aa</span>
                  </div>
                  <div>
                    <Label className="font-semibold text-base">Espaçamento do Texto</Label>
                    <p className="text-xs text-muted-foreground">Ajuste o espaço entre letras</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'default', label: 'Padrão', icon: '—' },
                    { value: 'medium', label: 'Médio', icon: '—  —' },
                    { value: 'large', label: 'Amplo', icon: '—    —' },
                  ].map((option) => (
                    <Button
                      key={option.value}
                      variant={textSpacing === option.value ? 'default' : 'outline'}
                      onClick={() => setTextSpacing(option.value as any)}
                      className={`h-14 rounded-xl flex flex-col gap-1 transition-all ${
                        textSpacing === option.value
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg border-0'
                          : 'border-2 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30'
                      }`}
                    >
                      <span className="text-xs opacity-60">{option.icon}</span>
                      <span className="font-medium">{option.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Font Family */}
              <div className="rounded-2xl border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                    <Type className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <Label htmlFor="font-select" className="font-semibold text-base">Tipo de Fonte</Label>
                    <p className="text-xs text-muted-foreground">Escolha uma fonte para leitura</p>
                  </div>
                </div>
                <Select value={fontFamily} onValueChange={(v) => setFontFamily(v as any)}>
                  <SelectTrigger id="font-select" className="h-12 rounded-xl border-2 text-base">
                    <SelectValue placeholder="Selecione uma fonte" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="default" className="rounded-lg py-3">
                      <span className="font-medium">Padrão (Lexend)</span>
                    </SelectItem>
                    <SelectItem value="arial" className="rounded-lg py-3">
                      <span style={{ fontFamily: 'Arial' }}>Sans-serif (Arial)</span>
                    </SelectItem>
                    <SelectItem value="opendyslexic" className="rounded-lg py-3">
                      <span className="font-medium">OpenDyslexic</span>
                      <span className="ml-2 text-xs text-muted-foreground">(Dislexia)</span>
                    </SelectItem>
                    <SelectItem value="comic-sans" className="rounded-lg py-3">
                      <span style={{ fontFamily: 'Comic Sans MS' }}>Comic Sans MS</span>
                    </SelectItem>
                    <SelectItem value="verdana" className="rounded-lg py-3">
                      <span style={{ fontFamily: 'Verdana' }}>Verdana</span>
                    </SelectItem>
                    <SelectItem value="tahoma" className="rounded-lg py-3">
                      <span style={{ fontFamily: 'Tahoma' }}>Tahoma</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Color Blind Mode */}
              <div className="rounded-2xl border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                    <Palette className="h-5 w-5 text-pink-600" />
                  </div>
                  <div>
                    <Label htmlFor="colorblind-select" className="font-semibold text-base">Modo para Daltônicos</Label>
                    <p className="text-xs text-muted-foreground">Ajusta as cores para melhor visualização</p>
                  </div>
                </div>
                <Select value={colorBlindMode} onValueChange={(v) => setColorBlindMode(v as any)}>
                  <SelectTrigger id="colorblind-select" className="h-12 rounded-xl border-2 text-base">
                    <SelectValue placeholder="Selecione um modo" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="default" className="rounded-lg py-3">Nenhum (Padrão)</SelectItem>
                    <SelectItem value="protanopia" className="rounded-lg py-3">
                      <span className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-red-500"></span>
                        Protanopia (vermelho-verde)
                      </span>
                    </SelectItem>
                    <SelectItem value="deuteranopia" className="rounded-lg py-3">
                      <span className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-green-500"></span>
                        Deuteranopia (verde-vermelho)
                      </span>
                    </SelectItem>
                    <SelectItem value="tritanopia" className="rounded-lg py-3">
                      <span className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                        Tritanopia (azul-amarelo)
                      </span>
                    </SelectItem>
                    <SelectItem value="achromatopsia" className="rounded-lg py-3">
                      <span className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-gray-500"></span>
                        Acromatopsia (sem cores)
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Toggle options */}
              <div className="space-y-3">
                <AccessibilityOption
                  label="Alto Contraste"
                  description="Aumenta o contraste para melhor legibilidade"
                  icon={SunMoon}
                  iconColor="text-amber-600"
                  iconBg="bg-amber-100 dark:bg-amber-900/30"
                  isActive={contrastMode === 'high-contrast'}
                >
                  <Switch
                    checked={contrastMode === 'high-contrast'}
                    onCheckedChange={(checked) => setContrastMode(checked ? 'high-contrast' : 'default')}
                  />
                </AccessibilityOption>

                <AccessibilityOption
                  label="Reduzir Animações"
                  description="Remove transições e movimentos"
                  icon={Zap}
                  iconColor="text-orange-600"
                  iconBg="bg-orange-100 dark:bg-orange-900/30"
                  isActive={reducedMotion}
                >
                  <Switch checked={reducedMotion} onCheckedChange={toggleReducedMotion} />
                </AccessibilityOption>

                <AccessibilityOption
                  label="Escala de Cinza"
                  description="Remove todas as cores da interface"
                  icon={Monitor}
                  iconColor="text-gray-600"
                  iconBg="bg-gray-200 dark:bg-gray-800"
                  isActive={grayscale}
                >
                  <Switch checked={grayscale} onCheckedChange={toggleGrayscale} />
                </AccessibilityOption>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Keyboard Navigation */}
        <AccordionItem value="keyboard" className="border-0 rounded-2xl bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/20 dark:to-purple-950/20 overflow-hidden">
          <AccordionTrigger className="text-base font-semibold hover:no-underline px-4 py-4 hover:bg-violet-100/50 dark:hover:bg-violet-900/20 transition-all [&[data-state=open]]:bg-violet-100/50 dark:[&[data-state=open]]:bg-violet-900/20">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Keyboard className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <span className="block">Navegação por Teclado</span>
                <span className="text-xs font-normal text-muted-foreground">Foco e destaque de elementos</span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2">
            <div className="space-y-3">
              <AccessibilityOption
                label="Destacar Elementos Focados"
                description="Mostra uma borda visível ao navegar com Tab"
                icon={MousePointer2}
                iconColor="text-violet-600"
                iconBg="bg-violet-100 dark:bg-violet-900/30"
                isActive={showFocusOutline}
              >
                <Switch checked={showFocusOutline} onCheckedChange={toggleFocusOutline} />
              </AccessibilityOption>

              {/* Keyboard shortcuts info */}
              <div className="rounded-2xl border-2 border-violet-200 dark:border-violet-800 bg-white dark:bg-gray-900 p-4">
                <p className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Keyboard className="h-4 w-4 text-violet-600" />
                  Atalhos Úteis
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-violet-50 dark:bg-violet-950/30">
                    <kbd className="px-2 py-1 rounded bg-violet-200 dark:bg-violet-800 font-mono">Tab</kbd>
                    <span className="text-muted-foreground">Próximo elemento</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-violet-50 dark:bg-violet-950/30">
                    <kbd className="px-2 py-1 rounded bg-violet-200 dark:bg-violet-800 font-mono">Enter</kbd>
                    <span className="text-muted-foreground">Ativar/Clicar</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-violet-50 dark:bg-violet-950/30">
                    <kbd className="px-2 py-1 rounded bg-violet-200 dark:bg-violet-800 font-mono">Esc</kbd>
                    <span className="text-muted-foreground">Fechar modal</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-violet-50 dark:bg-violet-950/30">
                    <kbd className="px-2 py-1 rounded bg-violet-200 dark:bg-violet-800 font-mono">Space</kbd>
                    <span className="text-muted-foreground">Alternar opção</span>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Reading & Comprehension */}
        <AccordionItem value="reading" className="border-0 rounded-2xl bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20 overflow-hidden">
          <AccordionTrigger className="text-base font-semibold hover:no-underline px-4 py-4 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/20 transition-all [&[data-state=open]]:bg-emerald-100/50 dark:[&[data-state=open]]:bg-emerald-900/20">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <span className="block">Leitura e Compreensão</span>
                <span className="text-xs font-normal text-muted-foreground">Links e elementos de texto</span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2">
            <AccessibilityOption
              label="Destacar Links"
              description="Sublinha e destaca todos os links da página"
              icon={Eye}
              iconColor="text-emerald-600"
              iconBg="bg-emerald-100 dark:bg-emerald-900/30"
              isActive={highlightLinks}
            >
              <Switch checked={highlightLinks} onCheckedChange={toggleHighlightLinks} />
            </AccessibilityOption>
          </AccordionContent>
        </AccordionItem>

        {/* Audio Accessibility */}
        <AccordionItem value="audio" className="border-0 rounded-2xl bg-gradient-to-br from-orange-50/50 to-amber-50/50 dark:from-orange-950/20 dark:to-amber-950/20 overflow-hidden">
          <AccordionTrigger className="text-base font-semibold hover:no-underline px-4 py-4 hover:bg-orange-100/50 dark:hover:bg-orange-900/20 transition-all [&[data-state=open]]:bg-orange-100/50 dark:[&[data-state=open]]:bg-orange-900/20">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg">
                <Volume2 className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <span className="block">Acessibilidade Auditiva</span>
                <span className="text-xs font-normal text-muted-foreground">Leitor de tela e áudio</span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2">
            <AccessibilityOption
              label="Leitor de Tela (TTS)"
              description="Lê o texto ao passar o mouse sobre elementos"
              icon={Volume2}
              iconColor="text-orange-600"
              iconBg="bg-orange-100 dark:bg-orange-900/30"
              isActive={isTtsEnabled}
            >
              <Switch checked={isTtsEnabled} onCheckedChange={toggleTts} />
            </AccessibilityOption>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Reset Button */}
      <div className="mt-6 p-4 bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-900 dark:to-slate-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm">
            <div className="h-10 w-10 rounded-xl bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
              <RotateCcw className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="font-medium">Restaurar Padrões</p>
              <p className="text-xs text-muted-foreground">Volta todas as configurações ao original</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={resetAccessibilitySettings}
            className="rounded-xl border-2 hover:bg-gradient-to-r hover:from-red-500 hover:to-rose-600 hover:text-white hover:border-transparent transition-all shadow-sm hover:shadow-lg px-6"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Redefinir Tudo
          </Button>
        </div>
      </div>
    </div>
  )
}
