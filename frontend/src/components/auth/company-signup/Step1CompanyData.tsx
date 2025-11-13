import { forwardRef, useImperativeHandle, useEffect, useState } from 'react'
// Função para formatar telefone (com ou sem DDD)
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
  companyDataSchema,
  CompanyDataValues,
  SETORES_ATIVIDADE,
} from '@/lib/schemas/company-signup-schema'
import { useCompanySignup } from '@/providers/CompanySignupProvider'
import { fetchCnpjData } from '@/services/cnpj'
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

export interface StepFormHandle {
  triggerSubmit: () => Promise<boolean>
}

export const Step1CompanyData = forwardRef<StepFormHandle>((_, ref) => {
  const { formData, updateFormData, nextStep } = useCompanySignup()
  const [isFetchingCnpj, setIsFetchingCnpj] = useState(false)

  const form = useForm<CompanyDataValues>({
    resolver: zodResolver(companyDataSchema),
    defaultValues: formData,
  })

  const cnpjValue = form.watch('cnpj')

  useEffect(() => {
    const handleCnpjFetch = async () => {
      if (!cnpjValue || cnpjValue.length < 14) return

      setIsFetchingCnpj(true)
      try {
        const cnpjData = await fetchCnpjData(cnpjValue)
        if (cnpjData) {
          // Razão social sempre vem em 'nome' (razao_social do serviço)
          if (cnpjData.razao_social) {
            form.setValue('razaoSocial', cnpjData.razao_social)
          }
          // Nome fantasia pode ser vazio, então só seta se existir
          if (cnpjData.nome_fantasia) {
            form.setValue('nomeFantasia', cnpjData.nome_fantasia)
          }
          // Preenche telefone se existir
          if (cnpjData.telefone) {
            form.setValue('telefone', cnpjData.telefone)
          }
        }
      } finally {
        setIsFetchingCnpj(false)
      }
    }

    handleCnpjFetch()
  }, [cnpjValue, form])

  const onSubmit = (data: CompanyDataValues) => {
    console.log('[Step1CompanyData] onSubmit called with data:', { razaoSocial: data.razaoSocial, emailCorporativo: data.emailCorporativo, senha: data.senha ? '***' : 'missing' })
    updateFormData(data)
    nextStep()
  }

  useImperativeHandle(ref, () => ({
    triggerSubmit: async () => {
      console.log('[Step1CompanyData] triggerSubmit called')
      const isValid = await form.trigger()
      console.log('[Step1CompanyData] form validation result:', isValid)
      if (isValid) {
        form.handleSubmit(onSubmit)()
      }
      return isValid
    },
  }))

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="razaoSocial"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Razão Social</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nomeFantasia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Fantasia</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="cnpj"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CNPJ</FormLabel>
                <FormControl>
                  <Input placeholder="00.000.000/0000-00" {...field} />
                </FormControl>
                <p className="text-sm text-muted-foreground">
                  {isFetchingCnpj ? 'Buscando dados da empresa...' : 'Digite o CNPJ para auto-completar'}
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="setorAtividade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Setor de Atividade</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um setor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SETORES_ATIVIDADE.map((setor) => (
                      <SelectItem key={setor} value={setor}>
                        {setor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="telefone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input
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
            name="siteEmpresa"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Site da Empresa (Opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://suaempresa.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="emailCorporativo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail Corporativo</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="contato@suaempresa.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="senha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmarSenha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar Senha</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
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
