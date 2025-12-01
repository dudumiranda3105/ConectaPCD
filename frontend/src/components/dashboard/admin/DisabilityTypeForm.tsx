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
import { FileText, Loader2, Type, Palette } from 'lucide-react'

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold flex items-center gap-2">
                <Type className="h-4 w-4 text-teal-500" />
                Nome do Tipo
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: Deficiência Visual" 
                  className="h-11 border-2 focus:border-teal-500 transition-all"
                  disabled={isLoading}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-teal-500" />
                Descrição <span className="text-muted-foreground font-normal">(opcional)</span>
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva as características deste tipo de deficiência..." 
                  className="min-h-[100px] border-2 focus:border-teal-500 transition-all resize-none"
                  disabled={isLoading}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cor"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold flex items-center gap-2">
                <Palette className="h-4 w-4 text-teal-500" />
                Cor do Tipo
              </FormLabel>
              <FormDescription className="text-xs">
                Escolha uma cor para identificar este tipo de deficiência no sistema
              </FormDescription>
              <FormControl>
                <div className="space-y-3">
                  {/* Preview da cor selecionada */}
                  <div 
                    className="flex items-center gap-3 p-3 rounded-xl border-2 transition-all"
                    style={{ 
                      borderColor: selectedColor,
                      backgroundColor: `${selectedColor}15`
                    }}
                  >
                    <div 
                      className="w-10 h-10 rounded-lg shadow-md flex-shrink-0"
                      style={{ backgroundColor: selectedColor }}
                    />
                    <div className="flex-1">
                      <p className="font-medium" style={{ color: selectedColor }}>
                        {form.watch('nome') || 'Nome do Tipo'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Preview de como ficará no sistema
                      </p>
                    </div>
                  </div>

                  {/* Grid de cores predefinidas */}
                  <div className="grid grid-cols-6 gap-2">
                    {COLOR_PRESETS.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => field.onChange(color.value)}
                        className={`
                          group relative w-full aspect-square rounded-lg transition-all duration-200
                          hover:scale-110 hover:shadow-lg focus:outline-none
                          ${selectedColor === color.value ? 'scale-110 shadow-lg ring-2 ring-offset-2 ring-gray-400' : ''}
                        `}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                        disabled={isLoading}
                      >
                        {selectedColor === color.value && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Input de cor personalizada */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 flex items-center gap-2">
                      <Input
                        type="color"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-12 h-10 p-1 cursor-pointer border-2"
                        disabled={isLoading}
                      />
                      <Input
                        type="text"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder="#6366f1"
                        className="flex-1 h-10 font-mono text-sm border-2"
                        disabled={isLoading}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Cor personalizada
                    </span>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isLoading}
            className="h-10 px-6"
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            disabled={isLoading}
            className="h-10 px-6 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 shadow-lg"
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
