import { forwardRef, useImperativeHandle } from 'react'
// Função para formatar telefone (com ou sem DDD)
function formatCpf(value: string) {
  const digits = value.replace(/\D/g, '')
  return digits.replace(/(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/, (m, p1, p2, p3, p4) =>
    p4 ? `${p1}.${p2}.${p3}-${p4}` : p3 ? `${p1}.${p2}.${p3}` : p2 ? `${p1}.${p2}` : p1
  )
}
function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 10) {
    // (99) 9999-9999
    return digits.replace(/(\d{0,2})(\d{0,4})(\d{0,4})/, (m, ddd, p1, p2) =>
      ddd ? `(${ddd})${p1 ? ' ' + p1 : ''}${p2 ? '-' + p2 : ''}` : ''
    )
  } else {
    // (99) 99999-9999
    return digits.replace(/(\d{0,2})(\d{0,5})(\d{0,4})/, (m, ddd, p1, p2) =>
      ddd ? `(${ddd})${p1 ? ' ' + p1 : ''}${p2 ? '-' + p2 : ''}` : ''
    )
  }
}
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  personalDataSignupSchema,
  PersonalDataValues,
} from '@/lib/schemas/candidate-signup-schema'
import { useCandidateSignup } from '@/providers/CandidateSignupProvider'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

export interface StepFormHandle {
  triggerSubmit: () => Promise<boolean>
}

export const Step1PersonalData = forwardRef<StepFormHandle>((_, ref) => {
  const { formData, updateFormData, nextStep } = useCandidateSignup()

  const form = useForm<PersonalDataValues>({
    resolver: zodResolver(personalDataSignupSchema),
    defaultValues: {
      name: formData.name || '',
      cpf: formData.cpf || '',
      email: formData.email || '',
      password: formData.password || '',
      confirmPassword: formData.confirmPassword || '',
    },
    mode: 'onTouched',
  })

  const onSubmit = (data: PersonalDataValues) => {
    updateFormData(data)
    nextStep()
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl>
                <Input
                  placeholder="000.000.000-00"
                  {...field}
                  onChange={e => field.onChange(formatCpf(e.target.value))}
                  value={field.value || ''}
                  maxLength={14}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="telefone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input
                  placeholder="(99) 99999-9999"
                  {...field}
                  onChange={e => field.onChange(formatPhone(e.target.value))}
                  value={field.value || ''}
                  maxLength={15}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="seu@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar Senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
})
