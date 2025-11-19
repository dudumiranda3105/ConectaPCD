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
  GaugeCircle,
  Eye,
} from 'lucide-react'

const AccessibilityOption = ({
  label,
  description,
  children,
}: {
  label: string
  description: string
  children: React.ReactNode
}) => (
  <div className="flex items-center justify-between rounded-xl border-2 border-transparent bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-200">
    <div className="space-y-1 flex-1">
      <Label className="font-semibold text-sm">{label}</Label>
      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
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
    <div className="px-2 pb-2">
      <Accordion type="multiple" className="w-full" defaultValue={['visual']}>
        <AccordionItem value="visual" className="border-none">
          <AccordionTrigger className="text-base font-semibold hover:no-underline rounded-lg px-3 py-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-950/20 dark:hover:to-indigo-950/20 transition-all">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span>Ajustes de Interface</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4 px-2">
            <div className="space-y-3 rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-900 dark:to-blue-950/20 p-4 shadow-sm">
              <Label className="font-semibold text-base">Tamanho da Fonte: {Math.round(fontSize * 100)}%</Label>
              <div className="flex items-center gap-3">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setFontSize(fontSize - 0.1)}
                  className="h-10 w-10 rounded-xl border-2 hover:bg-gradient-to-br hover:from-blue-500 hover:to-indigo-600 hover:text-white hover:border-transparent transition-all"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Slider
                  value={[fontSize]}
                  onValueChange={(value) => setFontSize(value[0])}
                  min={0.8}
                  max={1.5}
                  step={0.1}
                  className="flex-1"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setFontSize(fontSize + 0.1)}
                  className="h-10 w-10 rounded-xl border-2 hover:bg-gradient-to-br hover:from-blue-500 hover:to-indigo-600 hover:text-white hover:border-transparent transition-all"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-3 rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-900 dark:to-blue-950/20 p-4 shadow-sm">
              <Label className="font-semibold text-base">Espaçamento do Texto</Label>
              <div className="flex gap-2">
                <Button
                  variant={textSpacing === 'default' ? 'default' : 'outline'}
                  onClick={() => setTextSpacing('default')}
                  className={`flex-1 rounded-xl transition-all ${
                    textSpacing === 'default'
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md'
                      : 'border-2 hover:border-blue-300'
                  }`}
                >
                  Padrão
                </Button>
                <Button
                  variant={textSpacing === 'medium' ? 'default' : 'outline'}
                  onClick={() => setTextSpacing('medium')}
                  className={`flex-1 rounded-xl transition-all ${
                    textSpacing === 'medium'
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md'
                      : 'border-2 hover:border-blue-300'
                  }`}
                >
                  Médio
                </Button>
                <Button
                  variant={textSpacing === 'large' ? 'default' : 'outline'}
                  onClick={() => setTextSpacing('large')}
                  className={`flex-1 rounded-xl transition-all ${
                    textSpacing === 'large'
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md'
                      : 'border-2 hover:border-blue-300'
                  }`}
                >
                  Largo
                </Button>
              </div>
            </div>
            <div className="space-y-3 rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-900 dark:to-blue-950/20 p-4 shadow-sm">
              <Label htmlFor="font-select" className="font-semibold text-base">Tipo de Fonte</Label>
              <Select
                value={fontFamily}
                onValueChange={(v) => setFontFamily(v as any)}
              >
                <SelectTrigger id="font-select" className="rounded-xl border-2 h-11">
                  <SelectValue placeholder="Selecione uma fonte" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="default" className="rounded-lg">Padrão (Lexend)</SelectItem>
                  <SelectItem value="arial" className="rounded-lg">Sans-serif (Arial)</SelectItem>
                  <SelectItem value="opendyslexic" className="rounded-lg">OpenDyslexic (Dislexia)</SelectItem>
                  <SelectItem value="comic-sans" className="rounded-lg">Comic Sans MS</SelectItem>
                  <SelectItem value="verdana" className="rounded-lg">Verdana</SelectItem>
                  <SelectItem value="tahoma" className="rounded-lg">Tahoma</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3 rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-900 dark:to-blue-950/20 p-4 shadow-sm">
              <Label htmlFor="colorblind-select" className="font-semibold text-base">Modo para Daltônicos</Label>
              <Select
                value={colorBlindMode}
                onValueChange={(v) => setColorBlindMode(v as any)}
              >
                <SelectTrigger id="colorblind-select" className="rounded-xl border-2 h-11">
                  <SelectValue placeholder="Selecione um modo" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="default" className="rounded-lg">Nenhum (Padrão)</SelectItem>
                  <SelectItem value="protanopia" className="rounded-lg">🔴 Protanopia (vermelho-verde)</SelectItem>
                  <SelectItem value="deuteranopia" className="rounded-lg">🟢 Deuteranopia (verde-vermelho)</SelectItem>
                  <SelectItem value="tritanopia" className="rounded-lg">🔵 Tritanopia (azul-amarelo)</SelectItem>
                  <SelectItem value="achromatopsia" className="rounded-lg">⚫ Acromatopsia (sem cores)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <AccessibilityOption
              label="Alto Contraste"
              description="Melhora a legibilidade do site."
            >
              <Switch
                checked={contrastMode === 'high-contrast'}
                onCheckedChange={(checked) =>
                  setContrastMode(checked ? 'high-contrast' : 'default')
                }
              />
            </AccessibilityOption>

            <div className="grid grid-cols-1 gap-3">
              <AccessibilityOption
                label="Reduzir Animações"
                description="Remove transições e animações para reduzir distrações."
              >
                <Switch checked={reducedMotion} onCheckedChange={toggleReducedMotion} />
              </AccessibilityOption>
              <AccessibilityOption
                label="Tons de Cinza"
                description="Aplica escala de cinza em toda a interface."
              >
                <Switch checked={grayscale} onCheckedChange={toggleGrayscale} />
              </AccessibilityOption>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="keyboard" className="border-none">
          <AccordionTrigger className="text-base font-semibold hover:no-underline rounded-lg px-3 py-2 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 dark:hover:from-violet-950/20 dark:hover:to-purple-950/20 transition-all">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md">
                <Keyboard className="h-5 w-5 text-white" />
              </div>
              <span>Navegação por Teclado</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 px-2">
            <AccessibilityOption
              label="Destacar Elementos"
              description="Mostra uma borda nos itens focados."
            >
              <Switch
                checked={showFocusOutline}
                onCheckedChange={toggleFocusOutline}
              />
            </AccessibilityOption>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="reading" className="border-none">
          <AccordionTrigger className="text-base font-semibold hover:no-underline rounded-lg px-3 py-2 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 dark:hover:from-emerald-950/20 dark:hover:to-teal-950/20 transition-all">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span>Leitura e Compreensão</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 px-2">
            <AccessibilityOption
              label="Destacar Links"
              description="Sublinha e destaca todos os links."
            >
              <Switch
                checked={highlightLinks}
                onCheckedChange={toggleHighlightLinks}
              />
            </AccessibilityOption>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="audio" className="border-none">
          <AccordionTrigger className="text-base font-semibold hover:no-underline rounded-lg px-3 py-2 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 dark:hover:from-orange-950/20 dark:hover:to-amber-950/20 transition-all">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-md">
                <Volume2 className="h-5 w-5 text-white" />
              </div>
              <span>Acessibilidade Auditiva</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 px-2">
            <AccessibilityOption
              label="Leitor de Tela"
              description="Lê o texto na tela ao passar o mouse."
            >
              <Switch checked={isTtsEnabled} onCheckedChange={toggleTts} />
            </AccessibilityOption>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900 dark:to-slate-900 rounded-xl border-2 border-gray-200 dark:border-gray-800">
        <div className="text-xs text-muted-foreground flex items-center gap-2">
          <GaugeCircle className="h-4 w-4 text-blue-500" />
          <span className="font-medium">💡 Dicas: use Tab para navegar</span>
        </div>
        <Button 
          variant="outline" 
          onClick={resetAccessibilitySettings}
          className="rounded-xl border-2 hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 hover:text-white hover:border-transparent transition-all shadow-sm hover:shadow-md"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Redefinir Tudo
        </Button>
      </div>
    </div>
  )
}
