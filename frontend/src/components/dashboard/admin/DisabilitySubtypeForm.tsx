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
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DisabilitySubtype, DisabilityType } from '@/services/disabilities'
import { FolderTree, Layers, Loader2, Type } from 'lucide-react'

const formSchema = z.object({
  nome: z
    .string()
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  tipo_id: z.string().min(1, { message: 'Selecione um tipo de deficiência.' }),
})

type FormValues = z.infer<typeof formSchema>

interface DisabilitySubtypeFormProps {
  subtype?: DisabilitySubtype | null
  types: DisabilityType[]
  defaultTypeId?: string
  onSubmit: (data: FormValues) => void
  onCancel: () => void
  isLoading?: boolean
}

export const DisabilitySubtypeForm = ({
  subtype,
  types,
  defaultTypeId,
  onSubmit,
  onCancel,
  isLoading = false,
}: DisabilitySubtypeFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: subtype?.nome || '',
      tipo_id: (subtype?.tipoId || subtype?.tipo_id)?.toString() || defaultTypeId || '',
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Nome do Subtipo */}
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-sm font-semibold flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-emerald-500/10 flex items-center justify-center">
                  <Type className="h-3.5 w-3.5 text-emerald-500" />
                </div>
                Nome do Subtipo
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: Cegueira" 
                  className="h-12 pl-4 pr-4 border-2 border-border/60 rounded-xl bg-muted/30 focus:bg-background focus:border-emerald-500 transition-all duration-200"
                  disabled={isLoading}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tipo de Deficiência Associado */}
        <FormField
          control={form.control}
          name="tipo_id"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-sm font-semibold flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-emerald-500/10 flex items-center justify-center">
                  <Layers className="h-3.5 w-3.5 text-emerald-500" />
                </div>
                Tipo de Deficiência Associado
              </FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger className="h-12 border-2 border-border/60 rounded-xl bg-muted/30 focus:bg-background focus:border-emerald-500 transition-all duration-200">
                    <SelectValue placeholder="Selecione um tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-xl">
                  {types.map((type) => (
                    <SelectItem 
                      key={type.id} 
                      value={type.id.toString()}
                      className="rounded-lg my-0.5"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="h-6 w-6 rounded-lg flex items-center justify-center"
                          style={{ 
                            backgroundColor: `${type.cor || '#14b8a6'}20`,
                          }}
                        >
                          <span 
                            className="font-bold text-[10px]"
                            style={{ color: type.cor || '#14b8a6' }}
                          >
                            {type.nome.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium">{type.nome}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            className="h-11 px-6 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 shadow-lg shadow-emerald-500/25 transition-all duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {subtype ? 'Atualizando...' : 'Criando...'}
              </>
            ) : (
              <>
                <FolderTree className="h-4 w-4 mr-2" />
                {subtype ? 'Atualizar Subtipo' : 'Criar Subtipo'}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
