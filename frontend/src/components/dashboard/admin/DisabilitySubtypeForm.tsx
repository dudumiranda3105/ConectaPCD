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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold flex items-center gap-2">
                <Type className="h-4 w-4 text-emerald-500" />
                Nome do Subtipo
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: Cegueira" 
                  className="h-11 border-2 focus:border-emerald-500 transition-all"
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
          name="tipo_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold flex items-center gap-2">
                <Layers className="h-4 w-4 text-emerald-500" />
                Tipo de Deficiência Associado
              </FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger className="h-11 border-2 focus:border-emerald-500">
                    <SelectValue placeholder="Selecione um tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {types.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded bg-teal-500/10 flex items-center justify-center">
                          <span className="text-teal-600 font-bold text-[10px]">
                            {type.nome.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        {type.nome}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
