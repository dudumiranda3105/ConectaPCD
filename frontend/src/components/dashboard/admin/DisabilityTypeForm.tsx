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
import { FileText, Loader2, Type } from 'lucide-react'

const formSchema = z.object({
  nome: z
    .string()
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  descricao: z.string().optional(),
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
