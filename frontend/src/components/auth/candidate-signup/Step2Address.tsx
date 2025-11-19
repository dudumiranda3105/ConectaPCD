import { forwardRef, useImperativeHandle, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  addressSchema,
  AddressValues,
} from '@/lib/schemas/candidate-signup-schema'
import { useCandidateSignup } from '@/providers/CandidateSignupProvider'
import { fetchCepData } from '@/services/cep'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { StepFormHandle } from './Step1PersonalData'

export const Step2Address = forwardRef<StepFormHandle>((_, ref) => {
  const { formData, updateFormData } = useCandidateSignup()
  const [isFetchingCep, setIsFetchingCep] = useState(false)

  const form = useForm<AddressValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: formData,
    mode: 'onChange',
  })

  const cepValue = form.watch('cep')

  useEffect(() => {
    const handleCepFetch = async () => {
      if (!cepValue || cepValue.length < 8) return

      setIsFetchingCep(true)
      try {
        const cepData = await fetchCepData(cepValue)
        if (cepData) {
          form.setValue('rua', cepData.logradouro || '')
          form.setValue('bairro', cepData.bairro || '')
          form.setValue('cidade', cepData.localidade || '')
          form.setValue('uf', cepData.uf || '')
        }
      } finally {
        setIsFetchingCep(false)
      }
    }

    handleCepFetch()
  }, [cepValue, form])

  const onSubmit = (data: AddressValues) => {
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
    isFormValid: () => {
      return form.formState.isValid
    }
  }))

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="cep"
            render={({ field }) => (
              <FormItem className="md:col-span-1">
                <FormLabel>CEP</FormLabel>
                <FormControl>
                  <Input placeholder="00000-000" {...field} />
                </FormControl>
                <p className="text-sm text-muted-foreground">
                  {isFetchingCep ? 'Buscando...' : 'Digite o CEP para auto-completar'}
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="uf"
            render={({ field }) => (
              <FormItem className="md:col-span-1">
                <FormLabel>UF</FormLabel>
                <FormControl>
                  <Input placeholder="SP" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cidade"
            render={({ field }) => (
              <FormItem className="md:col-span-1">
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input placeholder="São Paulo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="rua"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rua</FormLabel>
              <FormControl>
                <Input placeholder="Avenida Paulista" {...field} className="h-12 border-2 rounded-xl" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="bairro"
            render={({ field }) => (
              <FormItem className="md:col-span-1">
                <FormLabel>Bairro</FormLabel>
                <FormControl>
                  <Input placeholder="Bela Vista" {...field} className="h-12 border-2 rounded-xl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="numero"
            render={({ field }) => (
              <FormItem className="md:col-span-1">
                <FormLabel>Número</FormLabel>
                <FormControl>
                  <Input placeholder="1000" {...field} className="h-12 border-2 rounded-xl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="complemento"
            render={({ field }) => (
              <FormItem className="md:col-span-1">
                <FormLabel>Complemento (Opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Apto 101" {...field} className="h-12 border-2 rounded-xl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  )
})
