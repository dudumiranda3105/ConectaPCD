import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { DisabilityType } from '@/services/disabilities'
import { FileText, Loader2, Type, Palette, Sparkles } from 'lucide-react'

// Paleta de cores predefinidas para escolha
const COLOR_PRESETS = [
  { name: 'Azul', value: '#3b82f6' },
  { name: 'Verde', value: '#22c55e' },
  { name: 'Roxo', value: '#a855f7' },
  { name: 'Rosa', value: '#ec4899' },
  { name: 'Laranja', value: '#f97316' },
  { name: 'Amarelo', value: '#eab308' },
  { name: 'Ciano', value: '#06b6d4' },
  { name: 'Vermelho', value: '#ef4444' },
  { name: 'Índigo', value: '#6366f1' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Âmbar', value: '#f59e0b' },
  { name: 'Esmeralda', value: '#10b981' },
]

const formSchema = z.object({
  nome: z
    .string()
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  descricao: z.string().optional(),
  cor: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface DisabilityTypeFormProps {
  type?: DisabilityType | null
  onSubmit: (data: FormValues) => void
  onCancel: () => void
  isLoading?: boolean
}

export const DisabilityTypeForm = ({
  type,
  onSubmit,
  onCancel,
  isLoading = false,
}: DisabilityTypeFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: type?.nome || '',
      descricao: type?.descricao || '',
      cor: type?.cor || '#6366f1',
    },
  })

  const selectedColor = form.watch('cor')

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Nome do Tipo */}
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-sm font-semibold flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-teal-500/10 flex items-center justify-center">
                  <Type className="h-3.5 w-3.5 text-teal-500" />
                </div>
                Nome do Tipo
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    placeholder="Ex: Deficiência Visual" 
                    className="h-12 pl-4 pr-4 border-2 border-border/60 rounded-xl bg-muted/30 focus:bg-background focus:border-teal-500 transition-all duration-200"
                    disabled={isLoading}
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Descrição */}
        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-sm font-semibold flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-teal-500/10 flex items-center justify-center">
                  <FileText className="h-3.5 w-3.5 text-teal-500" />
                </div>
                Descrição
                <span className="text-xs font-normal text-muted-foreground ml-1">(opcional)</span>
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva as características deste tipo de deficiência..." 
                  className="min-h-[100px] border-2 border-border/60 rounded-xl bg-muted/30 focus:bg-background focus:border-teal-500 transition-all duration-200 resize-none"
                  disabled={isLoading}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Cor do Tipo */}
        <FormField
          control={form.control}
          name="cor"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-sm font-semibold flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-teal-500/10 flex items-center justify-center">
                  <Palette className="h-3.5 w-3.5 text-teal-500" />
                </div>
                Cor do Tipo
              </FormLabel>
              <FormDescription className="text-xs text-muted-foreground">
                Escolha uma cor para identificar este tipo de deficiência no sistema
              </FormDescription>
              <FormControl>
                <div className="space-y-4">
                  {/* Preview da cor selecionada */}
                  <div 
                    className="flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300"
                    style={{ 
                      borderColor: `${selectedColor}50`,
                      background: `linear-gradient(135deg, ${selectedColor}08 0%, ${selectedColor}15 100%)`
                    }}
                  >
                    <div 
                      className="w-12 h-12 rounded-xl shadow-lg flex-shrink-0 ring-4 ring-white/50 dark:ring-black/20"
                      style={{ 
                        backgroundColor: selectedColor,
                        boxShadow: `0 8px 24px ${selectedColor}40`
                      }}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-base" style={{ color: selectedColor }}>
                        {form.watch('nome') || 'Nome do Tipo'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Preview de como ficará no sistema
                      </p>
                    </div>
                    <Sparkles className="h-5 w-5 text-muted-foreground/40" />
                  </div>

                  {/* Cores recomendadas pelo sistema */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                      <span className="text-xs font-medium text-muted-foreground">
                        Cores recomendadas pelo sistema
                      </span>
                    </div>
                    <div className="grid grid-cols-6 gap-3 p-4 rounded-xl bg-muted/30 border border-border/40">
                      {COLOR_PRESETS.map((color) => {
                        const isSelected = selectedColor === color.value
                        return (
                          <button
                            key={color.value}
                            type="button"
                            onClick={() => field.onChange(color.value)}
                            className={`
                              relative w-10 h-10 rounded-xl transition-all duration-200 hover:scale-110 focus:outline-none
                              ${isSelected ? 'scale-110' : ''}
                            `}
                            style={{ 
                              backgroundColor: color.value,
                              boxShadow: isSelected 
                                ? `0 0 0 2px hsl(var(--background)), 0 0 0 4px ${color.value}` 
                                : `0 2px 6px ${color.value}40`
                            }}
                            title={color.name}
                            disabled={isLoading}
                          >
                            {isSelected && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <svg className="w-5 h-5 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Input de cor personalizada */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
                    <Input
                      type="color"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="w-10 h-10 p-0.5 cursor-pointer border-2 rounded-lg overflow-hidden"
                      disabled={isLoading}
                    />
                    <Input
                      type="text"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder="#6366f1"
                      className="flex-1 h-10 font-mono text-sm border-0 bg-transparent focus-visible:ring-0"
                      disabled={isLoading}
                    />
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      Cor personalizada
                    </span>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Botões */}
        <div className="flex justify-end gap-3 pt-5 border-t border-border/50">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isLoading}
            className="h-11 px-6 rounded-xl"
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            disabled={isLoading}
            className="h-11 px-6 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 shadow-lg shadow-teal-500/25 transition-all duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {type ? 'Atualizando...' : 'Criando...'}
              </>
            ) : (
              type ? 'Atualizar Tipo' : 'Criar Tipo'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
