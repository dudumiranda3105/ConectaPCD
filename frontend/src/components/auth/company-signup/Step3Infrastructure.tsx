import { forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  infrastructureSchema,
  InfrastructureValues,
  ACESSIBILIDADES_OFERECIDAS,
  BARREIRAS,
} from '@/lib/schemas/company-signup-schema'
import { useCompanySignup } from '@/providers/CompanySignupProvider'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { StepFormHandle } from './Step1CompanyData'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

export const Step3Infrastructure = forwardRef<StepFormHandle>((_, ref) => {
  const { formData, updateFormData } = useCompanySignup()

  const form = useForm<InfrastructureValues>({
    resolver: zodResolver(infrastructureSchema),
    defaultValues: {
      acessibilidadesOferecidas: formData.acessibilidadesOferecidas || [],
      outrosRecursosAcessibilidade: formData.outrosRecursosAcessibilidade || '',
      barreiras: formData.barreiras || [],
      outrasBarreiras: formData.outrasBarreiras || '',
      politicasInclusao: formData.politicasInclusao || '',
      concordaTermos: formData.concordaTermos || false,
    },
  })

  const onSubmit = (data: InfrastructureValues) => {
    updateFormData(data)
  }

  useImperativeHandle(ref, () => ({
    triggerSubmit: async () => {
      const isValid = await form.trigger()
      if (isValid) {
        form.handleSubmit(onSubmit)()
      }
      return isValid
    },
  }))

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Acessibilidades Oferecidas</CardTitle>
            <CardDescription>
              Selecione os recursos que sua empresa oferece para promover um
              ambiente de trabalho inclusivo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="acessibilidadesOferecidas"
              render={() => (
                <FormItem>
                  <ScrollArea className="h-48 rounded-md border p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {ACESSIBILIDADES_OFERECIDAS.map((item) => (
                        <FormField
                          key={item}
                          control={form.control}
                          name="acessibilidadesOferecidas"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item)}
                                  onCheckedChange={(checked) =>
                                    checked
                                      ? field.onChange([...field.value, item])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item,
                                          ),
                                        )
                                  }
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="outrosRecursosAcessibilidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Outros recursos (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva outros recursos não listados..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Barreiras</CardTitle>
            <CardDescription>
              Selecione as barreiras que sua empresa busca ativamente eliminar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="barreiras"
              render={() => (
                <FormItem>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {BARREIRAS.map((item) => (
                      <FormField
                        key={item}
                        control={form.control}
                        name="barreiras"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item)}
                                onCheckedChange={(checked) =>
                                  checked
                                    ? field.onChange([
                                        ...(field.value || []),
                                        item,
                                      ])
                                    : field.onChange(
                                        (field.value || [])?.filter(
                                          (value) => value !== item,
                                        ),
                                      )
                                }
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="outrasBarreiras"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Outras barreiras (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva outras barreiras que sua empresa está trabalhando para eliminar..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Políticas de Inclusão e Termos</CardTitle>
            <CardDescription>
              Descreva suas políticas e confirme sua concordância com nossos
              termos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="politicasInclusao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Políticas de Inclusão (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva as políticas de inclusão da sua empresa..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="concordaTermos"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Li e concordo com os Termos de Uso e Política de
                        Privacidade.
                      </FormLabel>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-sm text-muted-foreground p-4 border rounded-md bg-secondary">
              Declaro estar ciente das responsabilidades quanto ao tratamento de
              dados pessoais conforme a LGPD.
            </p>
          </CardContent>
        </Card>
        <button type="submit" className="hidden" />
      </form>
    </Form>
  )
})
