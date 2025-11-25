import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
import { Briefcase, Loader2, User, Building, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useAuth, UserRole } from '@/hooks/use-auth'
import * as authService from '@/services/auth'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'

const loginSchema = z.object({
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
  password: z.string().min(1, { message: 'A senha é obrigatória.' }),
  role: z.enum(['candidate', 'company'], {
    required_error: 'Você precisa selecionar um tipo de conta.',
  }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'candidate',
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    try {
      const res = await authService.login(data.email, data.password)
      if (res.token) localStorage.setItem('auth_token', res.token)
      
      const user = {
        id: String(res.user.id),
        name: res.user.name,
        email: res.user.email,
        role: res.user.role as UserRole,
        empresaId: res.user.empresaId,
        candidatoId: res.user.candidatoId,
      }
      
      login(user)
      toast({ title: 'Bem-vindo de volta!', description: 'Login realizado com sucesso.' })

      if (user.role === 'company') navigate('/dashboard/empresa')
      else if (user.role === 'admin') navigate('/admin')
      else navigate('/dashboard/candidato')
    } catch (err: any) {
      toast({ title: 'Falha no acesso', description: err.message, variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = () => {
    toast({
      title: 'Verifique seu e-mail',
      description: 'Enviamos as instruções de recuperação para você.',
    })
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-900 overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 opacity-90" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        
        {/* Animated Shapes */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />

        <div className="relative z-10 p-12 text-white max-w-xl">
          <div className="mb-8 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Conectando talentos a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">oportunidades</span>
          </h1>
          <p className="text-lg text-indigo-100 mb-8 leading-relaxed">
            A plataforma mais completa para inclusão profissional. Junte-se a milhares de empresas e candidatos construindo um futuro mais diverso.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-indigo-100">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>Vagas exclusivas para PCD</span>
            </div>
            <div className="flex items-center gap-3 text-indigo-100">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>Empresas comprometidas com a diversidade</span>
            </div>
            <div className="flex items-center gap-3 text-indigo-100">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>Processos seletivos acessíveis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden w-full bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-4 py-8 sm:py-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">ConectaPCD</h1>
        </div>
        <p className="text-center text-indigo-100 text-sm sm:text-base max-w-sm mx-auto">
          Conectando talentos a oportunidades de forma inclusiva
        </p>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-background">
        <div className="w-full max-w-md space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Bem-vindo de volta</h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Entre na sua conta para continuar
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Tipo de conta</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div
                          className={cn(
                            "cursor-pointer rounded-lg sm:rounded-xl border-2 p-3 sm:p-4 flex flex-col items-center gap-1.5 sm:gap-2 transition-all hover:border-indigo-500/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20",
                            field.value === 'candidate' 
                              ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-1 ring-indigo-600" 
                              : "border-muted bg-transparent"
                          )}
                          onClick={() => field.onChange('candidate')}
                        >
                          <User className={cn("w-5 h-5 sm:w-6 sm:h-6", field.value === 'candidate' ? "text-indigo-600" : "text-muted-foreground")} />
                          <span className={cn("font-medium text-xs sm:text-sm", field.value === 'candidate' ? "text-indigo-900 dark:text-indigo-100" : "text-muted-foreground")}>Candidato</span>
                        </div>
                        <div
                          className={cn(
                            "cursor-pointer rounded-lg sm:rounded-xl border-2 p-3 sm:p-4 flex flex-col items-center gap-1.5 sm:gap-2 transition-all hover:border-violet-500/50 hover:bg-violet-50/50 dark:hover:bg-violet-950/20",
                            field.value === 'company' 
                              ? "border-violet-600 bg-violet-50/50 dark:bg-violet-950/30 ring-1 ring-violet-600" 
                              : "border-muted bg-transparent"
                          )}
                          onClick={() => field.onChange('company')}
                        >
                          <Building className={cn("w-5 h-5 sm:w-6 sm:h-6", field.value === 'company' ? "text-violet-600" : "text-muted-foreground")} />
                          <span className={cn("font-medium text-xs sm:text-sm", field.value === 'company' ? "text-violet-900 dark:text-violet-100" : "text-muted-foreground")}>Empresa</span>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3 sm:space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">E-mail</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="seu@email.com"
                          type="email"
                          className="h-10 sm:h-11 rounded-lg text-sm"
                          {...field}
                        />
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
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-sm">Senha</FormLabel>
                        <Button
                          type="button"
                          variant="link"
                          className="p-0 h-auto text-[10px] sm:text-xs font-medium text-indigo-600 hover:text-indigo-500"
                          onClick={handleForgotPassword}
                        >
                          Esqueceu a senha?
                        </Button>
                      </div>
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          type="password"
                          className="h-10 sm:h-11 rounded-lg text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-10 sm:h-11 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 transition-all shadow-lg hover:shadow-indigo-500/25 text-sm sm:text-base" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Entrar na plataforma
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center space-y-3 sm:space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Ou
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground">
              Não tem uma conta?{' '}
              <Link
                to="/cadastro"
                className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline transition-all"
              >
                Cadastre-se gratuitamente
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
