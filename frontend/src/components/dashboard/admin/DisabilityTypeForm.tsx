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
import { Textarea } from '@/components/ui/textarea'
import { DisabilityType } from '@/services/disabilities'
import { AlertCircle, Sparkles } from 'lucide-react'

const formSchema = z.object({
  nome: z
    .string()
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
})

type FormValues = z.infer<typeof formSchema>

interface DisabilityTypeFormProps {
  type?: DisabilityType | null
  onSubmit: (data: FormValues) => void
  onCancel: () => void
}

export const DisabilityTypeForm = ({
  type,
  onSubmit,
  onCancel,
}: DisabilityTypeFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: type?.nome || '',
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{type ? 'Editar Tipo' : 'Novo Tipo de Deficiência'}</h3>
              <p className="text-sm text-muted-foreground">Preencha os dados abaixo</p>
            </div>
          </div>

          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  Nome do Tipo
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: Deficiência Visual" 
                    className="h-11 border-2 focus:border-blue-500 transition-all"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="h-10 px-6"
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            className="h-10 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {type ? 'Atualizar' : 'Criar Tipo'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
