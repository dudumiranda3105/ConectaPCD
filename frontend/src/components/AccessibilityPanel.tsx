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
  <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
    <div className="space-y-0.5">
      <Label>{label}</Label>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
    {children}
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
    resetAccessibilitySettings,
  } = useAccessibility()

  return (
    <div className="p-1">
      <Accordion type="multiple" className="w-full" defaultValue={['visual']}>
        <AccordionItem value="visual">
          <AccordionTrigger className="text-base">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" /> Ajustes de Interface
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="space-y-2 rounded-lg border p-3 shadow-sm">
              <Label>Tamanho da Fonte: {Math.round(fontSize * 100)}%</Label>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setFontSize(fontSize - 0.1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Slider
                  value={[fontSize]}
                  onValueChange={(value) => setFontSize(value[0])}
                  min={0.8}
                  max={1.5}
                  step={0.1}
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setFontSize(fontSize + 0.1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2 rounded-lg border p-3 shadow-sm">
              <Label>Espaçamento do Texto</Label>
              <div className="flex gap-2">
                <Button
                  variant={textSpacing === 'default' ? 'secondary' : 'outline'}
                  onClick={() => setTextSpacing('default')}
                  className="flex-1"
                >
                  Padrão
                </Button>
                <Button
                  variant={textSpacing === 'medium' ? 'secondary' : 'outline'}
                  onClick={() => setTextSpacing('medium')}
                  className="flex-1"
                >
                  Médio
                </Button>
                <Button
                  variant={textSpacing === 'large' ? 'secondary' : 'outline'}
                  onClick={() => setTextSpacing('large')}
                  className="flex-1"
                >
                  Largo
                </Button>
              </div>
            </div>
            <div className="space-y-2 rounded-lg border p-3 shadow-sm">
              <Label htmlFor="font-select">Tipo de Fonte</Label>
              <Select
                value={fontFamily}
                onValueChange={(v) => setFontFamily(v as any)}
              >
                <SelectTrigger id="font-select">
                  <SelectValue placeholder="Selecione uma fonte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Padrão (Inter)</SelectItem>
                  <SelectItem value="lexend">Acessível (Lexend)</SelectItem>
                  <SelectItem value="arial">Sans-serif (Arial)</SelectItem>
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
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="keyboard">
          <AccordionTrigger className="text-base">
            <div className="flex items-center gap-2">
              <Keyboard className="h-5 w-5" /> Navegação por Teclado
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2">
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

        <AccordionItem value="reading">
          <AccordionTrigger className="text-base">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" /> Leitura e Compreensão
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2">
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

        <AccordionItem value="audio">
          <AccordionTrigger className="text-base">
            <div className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" /> Acessibilidade Auditiva
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <AccessibilityOption
              label="Leitor de Tela"
              description="Lê o texto na tela ao passar o mouse."
            >
              <Switch checked={isTtsEnabled} onCheckedChange={toggleTts} />
            </AccessibilityOption>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="mt-6 flex justify-end">
        <Button variant="ghost" onClick={resetAccessibilitySettings}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Redefinir
        </Button>
      </div>
    </div>
  )
}
