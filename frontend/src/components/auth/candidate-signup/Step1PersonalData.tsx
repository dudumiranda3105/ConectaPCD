import { forwardRef, useImperativeHandle, useState } from 'react'
import { Check, X, Eye, EyeOff } from 'lucide-react'
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
  GENEROS,
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
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface StepFormHandle {
  triggerSubmit: () => Promise<boolean>
  isFormValid: () => boolean
}

export const Step1PersonalData = forwardRef<StepFormHandle>((_, ref) => {
  const { formData, updateFormData } = useCandidateSignup()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<PersonalDataValues>({
    resolver: zodResolver(personalDataSignupSchema),
    defaultValues: {
      name: formData.name || '',
      cpf: formData.cpf || '',
      telefone: formData.telefone || '',
      dataNascimento: formData.dataNascimento || '',
      genero: formData.genero,
      email: formData.email || '',
      password: formData.password || '',
      confirmPassword: formData.confirmPassword || '',
    },
    mode: 'onChange',
  })

  const onSubmit = (data: PersonalDataValues) => {
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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome completo" {...field} className="h-12 border-2 rounded-xl" />
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
                  className="h-12 border-2 rounded-xl"
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
                  className="h-12 border-2 rounded-xl"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dataNascimento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Nascimento</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  className="h-12 border-2 rounded-xl"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="genero"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gênero</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="h-12 border-2 rounded-xl">
                    <SelectValue placeholder="Selecione seu gênero" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {GENEROS.map((genero) => (
                    <SelectItem key={genero} value={genero}>
                      {genero}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                <Input type="email" placeholder="seu@email.com" {...field} className="h-12 border-2 rounded-xl" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => {
            const password = field.value || ''
            const hasMinLength = password.length >= 8
            const hasUpperCase = /[A-Z]/.test(password)
            const hasLowerCase = /[a-z]/.test(password)
            const hasNumber = /[0-9]/.test(password)
            const hasSpecialChar = /[^A-Za-z0-9]/.test(password)
            
            return (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="********" 
                      {...field} 
                      className="h-12 border-2 rounded-xl pr-12" 
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-12 w-12 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <div className="space-y-2 mt-3">
                  <div className="flex items-center gap-2 text-sm">
                    {hasMinLength ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className={hasMinLength ? "text-green-600" : "text-muted-foreground"}>
                      Mínimo 8 caracteres
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {hasUpperCase ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className={hasUpperCase ? "text-green-600" : "text-muted-foreground"}>
                      Uma letra maiúscula
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {hasLowerCase ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className={hasLowerCase ? "text-green-600" : "text-muted-foreground"}>
                      Uma letra minúscula
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {hasNumber ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className={hasNumber ? "text-green-600" : "text-muted-foreground"}>
                      Um número
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {hasSpecialChar ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className={hasSpecialChar ? "text-green-600" : "text-muted-foreground"}>
                      Um caractere especial (!@#$%...)
                    </span>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar Senha</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="********" 
                    {...field} 
                    className="h-12 border-2 rounded-xl pr-12" 
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-12 w-12 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
})
