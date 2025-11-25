import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Building2, Hash, Users, Briefcase, FileText, Phone, Globe, Mail, Lock,
  MapPin, Home, User, Accessibility, Shield, CheckCircle2, Loader2
} from 'lucide-react'
import {
  companySignupSchema,
  CompanySignupFormValues,
  SETORES_ATIVIDADE,
  PORTES_EMPRESA,
  ACESSIBILIDADES_OFERECIDAS,
  BARREIRAS,
} from '@/lib/schemas/company-signup-schema'
import { fetchCnpjData } from '@/services/cnpj'
import { fetchCepData } from '@/services/cep'
import { fetchEstados, type Estado } from '@/services/ibge'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'

// Função para formatar telefone
function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 10) {
    return digits.replace(/(\d{0,2})(\d{0,4})(\d{0,4})/, (m, ddd, p1, p2) =>
      ddd ? `(${ddd})${p1 ? ' ' + p1 : ''}${p2 ? '-' + p2 : ''}` : ''
    )
  } else {
    return digits.replace(/(\d{0,2})(\d{0,5})(\d{0,4})/, (m, ddd, p1, p2) =>
      ddd ? `(${ddd})${p1 ? ' ' + p1 : ''}${p2 ? '-' + p2 : ''}` : ''
    )
  }
}

export const CompanySignupForm = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isFetchingCnpj, setIsFetchingCnpj] = useState(false)
  const [isFetchingCep, setIsFetchingCep] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [estados, setEstados] = useState<Estado[]>([])
  const [isLoadingEstados, setIsLoadingEstados] = useState(true)

  const form = useForm<CompanySignupFormValues>({
    resolver: zodResolver(companySignupSchema),
    defaultValues: {
      possuiSistemaInterno: false,
      acessibilidadesOferecidas: [],
      barreiras: [],
      concordaTermos: false,
    },
  })

  const cnpjValue = form.watch('cnpj')
  const cepValue = form.watch('cep')

  // Carregar estados da API do IBGE
  useEffect(() => {
    const loadEstados = async () => {
      setIsLoadingEstados(true)
      try {
        const data = await fetchEstados()
        setEstados(data)
      } finally {
        setIsLoadingEstados(false)
      }
    }
    loadEstados()
  }, [])

  // Auto-completar dados do CNPJ
  useEffect(() => {
    const handleCnpjFetch = async () => {
      if (!cnpjValue || cnpjValue.length < 14) return

      setIsFetchingCnpj(true)
      try {
        const cnpjData = await fetchCnpjData(cnpjValue)
        if (cnpjData) {
          if (cnpjData.razao_social) {
            form.setValue('razaoSocial', cnpjData.razao_social)
          }
          if (cnpjData.nome_fantasia) {
            form.setValue('nomeFantasia', cnpjData.nome_fantasia)
          }
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

  // Auto-completar dados do CEP
  useEffect(() => {
    const handleCepFetch = async () => {
      if (!cepValue || cepValue.length < 8) return

      setIsFetchingCep(true)
      try {
        const cepData = await fetchCepData(cepValue)
        if (cepData) {
          form.setValue('logradouro', cepData.logradouro || '')
          form.setValue('bairro', cepData.bairro || '')
          form.setValue('cidade', cepData.localidade || '')
          form.setValue('estado', cepData.uf || '')
        }
      } finally {
        setIsFetchingCep(false)
      }
    }

    handleCepFetch()
  }, [cepValue, form])

  const onSubmit = async (data: CompanySignupFormValues) => {
    setIsSubmitting(true)
    try {
      const registerPayload = {
        name: data.razaoSocial,
        email: data.emailCorporativo,
        password: data.senha,
        role: 'company' as const,
      }

      const { register } = await import('@/services/auth')
      const res = await register(registerPayload)
      if (res.token) localStorage.setItem('auth_token', res.token)
      if (res.user) localStorage.setItem('auth_user', JSON.stringify(res.user))

      // Salva dados completos da empresa no backend
      if (res.token) {
        try {
          const profileResponse = await fetch(`${import.meta.env?.VITE_API_URL || 'http://localhost:3000'}/profiles/company`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json', 
              Authorization: `Bearer ${res.token}` 
            },
            body: JSON.stringify(data),
          })

          if (!profileResponse.ok) {
            const errorBody = await profileResponse.json().catch(() => ({}))
            console.error('Erro ao salvar perfil completo da empresa:', errorBody)
            throw new Error(errorBody.error || 'Erro ao salvar dados completos da empresa')
          }

          const profileData = await profileResponse.json()
          console.log('Perfil completo da empresa salvo com sucesso:', profileData)
        } catch (error) {
          console.error('Erro ao salvar perfil completo da empresa:', error)
          throw error
        }
      }

      toast({ 
        title: 'Cadastro realizado com sucesso!', 
        description: 'Sua empresa foi cadastrada na plataforma.' 
      })
      form.reset()
      navigate('/dashboard/empresa')
    } catch (err: any) {
      toast({ 
        title: 'Erro ao Cadastrar', 
        description: err.message || 'Não foi possível cadastrar a empresa.', 
        variant: 'destructive' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen py-6 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 h-48 sm:h-72 w-48 sm:w-72 rounded-full bg-emerald-500/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 h-64 sm:h-96 w-64 sm:w-96 rounded-full bg-green-500/20 blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
      </div>
      
      <div className="relative w-full max-w-4xl">
        <Card className="shadow-2xl border-2">
          {/* Header com gradiente */}
          <div className="bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12 rounded-t-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10 text-center">
              <div className="flex justify-center mb-3 sm:mb-4">
                <div className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 bg-white/20 rounded-xl sm:rounded-2xl backdrop-blur-md flex items-center justify-center shadow-2xl">
                  <Building2 className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl sm:text-3xl md:text-4xl text-white font-bold mb-2">
                Cadastro de Empresa
              </CardTitle>
              <CardDescription className="text-emerald-100 text-sm sm:text-base md:text-lg">
                Preencha o formulário completo para cadastrar sua empresa
              </CardDescription>
            </div>
          </div>

          <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 px-4 sm:px-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
                {/* Seção 1: Dados da Empresa */}
                <div>
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                      <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Dados da Empresa</h3>
                  </div>
                  <Separator className="mb-4 sm:mb-6" />
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="razaoSocial"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                              <Building2 className="h-4 w-4 text-emerald-600" />
                              Razão Social
                            </FormLabel>
                            <FormControl>
                              <Input className="h-11 border-2 focus:border-emerald-500 transition-all" {...field} />
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
                            <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                              <Building2 className="h-4 w-4 text-emerald-600" />
                              Nome Fantasia
                            </FormLabel>
                            <FormControl>
                              <Input className="h-11 border-2 focus:border-emerald-500 transition-all" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="cnpj"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                              <Hash className="h-4 w-4 text-emerald-600" />
                              CNPJ
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="00.000.000/0000-00" className="h-11 border-2 focus:border-emerald-500 transition-all" {...field} />
                            </FormControl>
                            <FormDescription>
                              {isFetchingCnpj ? '🔍 Buscando dados...' : '✨ Auto-completar'}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="porte"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                              <Users className="h-4 w-4 text-emerald-600" />
                              Porte da Empresa
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11 border-2 focus:border-emerald-500 transition-all">
                                  <SelectValue placeholder="Selecione o porte" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {PORTES_EMPRESA.map((porte) => (
                                  <SelectItem key={porte} value={porte}>{porte}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="setorAtividade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                            <Briefcase className="h-4 w-4 text-emerald-600" />
                            Setor de Atividade
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11 border-2 focus:border-emerald-500 transition-all">
                                <SelectValue placeholder="Selecione um setor" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {SETORES_ATIVIDADE.map((setor) => (
                                <SelectItem key={setor} value={setor}>{setor}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="descricao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                            <FileText className="h-4 w-4 text-emerald-600" />
                            Descrição da Empresa (Opcional)
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Descreva sua empresa, valores e missão..." 
                              {...field} 
                              className="min-h-[120px] resize-none border-2 focus:border-emerald-500 transition-all"
                              maxLength={1000}
                            />
                          </FormControl>
                          <FormDescription>
                            📝 {field.value?.length || 0}/1000 caracteres
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="telefone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                              <Phone className="h-4 w-4 text-emerald-600" />
                              Telefone
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                onChange={e => field.onChange(formatPhone(e.target.value))}
                                value={field.value || ''}
                                maxLength={15}
                                className="h-11 border-2 focus:border-emerald-500 transition-all"
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
                            <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                              <Globe className="h-4 w-4 text-emerald-600" />
                              Site da Empresa (Opcional)
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="https://suaempresa.com" className="h-11 border-2 focus:border-emerald-500 transition-all" {...field} />
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
                          <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                            <Mail className="h-4 w-4 text-emerald-600" />
                            E-mail Corporativo
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="contato@suaempresa.com"
                              className="h-11 border-2 focus:border-emerald-500 transition-all"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="senha"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                              <Lock className="h-4 w-4 text-emerald-600" />
                              Senha
                            </FormLabel>
                            <FormControl>
                              <Input type="password" className="h-11 border-2 focus:border-emerald-500 transition-all" {...field} />
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
                            <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                              <Lock className="h-4 w-4 text-emerald-600" />
                              Confirmar Senha
                            </FormLabel>
                            <FormControl>
                              <Input type="password" className="h-11 border-2 focus:border-emerald-500 transition-all" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Seção 2: Endereço */}
                <div>
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Endereço da Empresa</h3>
                  </div>
                  <Separator className="mb-4 sm:mb-6" />
                  
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="cep"
                      render={({ field }) => (
                        <FormItem className="w-full md:w-1/3">
                          <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                            <MapPin className="h-4 w-4 text-blue-600" />
                            CEP
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="00000-000" className="h-11 border-2 focus:border-blue-500 transition-all" {...field} />
                          </FormControl>
                          <FormDescription>
                            {isFetchingCep ? '🔍 Buscando endereço...' : '✨ Auto-completar'}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="logradouro"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                              <Home className="h-4 w-4 text-blue-600" />
                              Logradouro
                            </FormLabel>
                            <FormControl>
                              <Input className="h-11 border-2 focus:border-blue-500 transition-all" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="numero"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                              <Hash className="h-4 w-4 text-blue-600" />
                              Número
                            </FormLabel>
                            <FormControl>
                              <Input className="h-11 border-2 focus:border-blue-500 transition-all" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="complemento"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                              <Home className="h-4 w-4 text-blue-600" />
                              Complemento (Opcional)
                            </FormLabel>
                            <FormControl>
                              <Input className="h-11 border-2 focus:border-blue-500 transition-all" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="bairro"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                              <MapPin className="h-4 w-4 text-blue-600" />
                              Bairro
                            </FormLabel>
                            <FormControl>
                              <Input className="h-11 border-2 focus:border-blue-500 transition-all" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="cidade"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                              <MapPin className="h-4 w-4 text-blue-600" />
                              Cidade
                            </FormLabel>
                            <FormControl>
                              <Input className="h-11 border-2 focus:border-blue-500 transition-all" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="estado"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                              <MapPin className="h-4 w-4 text-blue-600" />
                              Estado
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11 border-2 focus:border-blue-500 transition-all">
                                  <SelectValue placeholder={isLoadingEstados ? "Carregando..." : "Selecione"} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {estados.map((estado) => (
                                  <SelectItem key={estado.sigla} value={estado.sigla}>
                                    {estado.nome}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Seção 3: Responsável */}
                <div>
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Responsável pelo Cadastro</h3>
                  </div>
                  <Separator className="mb-4 sm:mb-6" />
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="nomeCompletoResponsavel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                              <User className="h-4 w-4 text-violet-600" />
                              Nome Completo
                            </FormLabel>
                            <FormControl>
                              <Input className="h-11 border-2 focus:border-violet-500 transition-all" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="cargoResponsavel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                              <Briefcase className="h-4 w-4 text-violet-600" />
                              Cargo
                            </FormLabel>
                            <FormControl>
                              <Input className="h-11 border-2 focus:border-violet-500 transition-all" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="emailResponsavel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                              <Mail className="h-4 w-4 text-violet-600" />
                              E-mail
                            </FormLabel>
                            <FormControl>
                              <Input type="email" className="h-11 border-2 focus:border-violet-500 transition-all" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="telefoneResponsavel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                              <Phone className="h-4 w-4 text-violet-600" />
                              Telefone
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                onChange={e => field.onChange(formatPhone(e.target.value))}
                                value={field.value || ''}
                                maxLength={15}
                                className="h-11 border-2 focus:border-violet-500 transition-all"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="possuiSistemaInterno"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border-2 p-4 hover:bg-violet-50/50 transition-colors">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base font-semibold">
                              A empresa possui sistema interno ou banco de dados próprio?
                            </FormLabel>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Seção 4: Acessibilidade */}
                <div>
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                      <Accessibility className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Acessibilidade e Inclusão</h3>
                  </div>
                  <Separator className="mb-4 sm:mb-6" />
                  
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="acessibilidadesOferecidas"
                      render={() => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-base font-semibold mb-4">
                            <CheckCircle2 className="h-5 w-5 text-teal-600" />
                            Recursos de Acessibilidade Oferecidos
                          </FormLabel>
                          <ScrollArea className="h-64 rounded-lg border-2 p-4 scrollbar-thin scrollbar-thumb-teal-500/20 scrollbar-track-transparent">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {ACESSIBILIDADES_OFERECIDAS.map((item) => (
                                <FormField
                                  key={item}
                                  control={form.control}
                                  name="acessibilidadesOferecidas"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-3 rounded-lg hover:bg-teal-50/50 transition-colors">
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
                                      <FormLabel className="font-normal cursor-pointer">
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
                          <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                            <FileText className="h-4 w-4 text-teal-600" />
                            Outros Recursos (Opcional)
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Descreva outros recursos não listados..."
                              {...field}
                              className="min-h-[100px] resize-none border-2 focus:border-teal-500 transition-all"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="barreiras"
                      render={() => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-base font-semibold mb-4">
                            <Shield className="h-5 w-5 text-rose-600" />
                            Barreiras que sua empresa busca eliminar
                          </FormLabel>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {BARREIRAS.map((item) => (
                              <FormField
                                key={item}
                                control={form.control}
                                name="barreiras"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-3 rounded-lg border-2 hover:bg-rose-50/50 transition-colors">
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
                                    <FormLabel className="font-normal cursor-pointer">
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
                          <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                            <FileText className="h-4 w-4 text-rose-600" />
                            Outras Barreiras (Opcional)
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Descreva outras barreiras..."
                              {...field}
                              className="min-h-[100px] resize-none border-2 focus:border-rose-500 transition-all"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="politicasInclusao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                            <FileText className="h-4 w-4 text-teal-600" />
                            Políticas de Inclusão (Opcional)
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Descreva as políticas de inclusão da sua empresa..."
                              {...field}
                              className="min-h-[120px] resize-none border-2 focus:border-teal-500 transition-all"
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
                          <div className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border-2 p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="font-semibold">
                                Li e concordo com os Termos de Uso e Política de Privacidade.
                              </FormLabel>
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <p className="text-sm text-muted-foreground p-4 border-2 rounded-lg bg-blue-500/10 dark:bg-blue-500/20">
                      💡 Declaro estar ciente das responsabilidades quanto ao tratamento de dados pessoais conforme a LGPD.
                    </p>
                  </div>
                </div>

                {/* Botão de Submit */}
                <div className="pt-4 sm:pt-6">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-11 sm:h-12 text-base sm:text-lg font-semibold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 text-white shadow-lg"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />}
                    {isSubmitting ? 'Cadastrando...' : 'Finalizar Cadastro'}
                  </Button>
                </div>
              </form>
            </Form>

            {/* Link para login */}
            <div className="mt-6 text-center pt-6 border-t">
              <p className="text-sm text-muted-foreground mb-2">
                Já tem uma empresa cadastrada?
              </p>
              <Link to="/login" className="inline-flex items-center gap-2 text-base font-semibold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent hover:from-emerald-700 hover:to-green-700 transition-all">
                Faça login aqui →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
