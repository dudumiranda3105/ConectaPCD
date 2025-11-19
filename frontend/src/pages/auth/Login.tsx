import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Briefcase, Loader2, User, Building } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useAuth, UserRole } from '@/hooks/use-auth'
import * as authService from '@/services/auth'
import { useToast } from '@/components/ui/use-toast'

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
      // salva token
      if (res.token) localStorage.setItem('auth_token', res.token)
      // adapta e loga no provider
      const user = {
        id: String(res.user.id),
        name: res.user.name,
        email: res.user.email,
        role: res.user.role as UserRole,
        empresaId: res.user.empresaId,
        candidatoId: res.user.candidatoId,
      }
      console.log('[Login] Dados do usuário recebidos do backend:', res.user)
      console.log('[Login] Passando para AuthProvider:', user)
      login(user)
      toast({ title: 'Login bem-sucedido!', description: 'Redirecionando.' })

      if (user.role === 'company') navigate('/dashboard/empresa')
      else if (user.role === 'admin') navigate('/admin')
      else navigate('/dashboard/candidato')
    } catch (err: any) {
      toast({ title: 'Erro no Login', description: err.message, variant: 'destructive' })
    } finally {
      if (typeof setIsLoading === 'function') setIsLoading(false)
      else console.warn('setIsLoading is not a function', setIsLoading)
    }
  }

  const handleForgotPassword = () => {
    toast({
      title: 'Recuperação de Senha',
      description:
        'Um e-mail com instruções foi enviado para o endereço fornecido (simulação).',
    })
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
      </div>
      
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-600 to-purple-700 flex items-center justify-center shadow-2xl animate-in zoom-in duration-500">
            <Briefcase className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
            Acesse sua conta
          </h2>
          <p className="mt-2 text-base text-muted-foreground">
            Bem-vindo de volta!
          </p>
        </div>
        <Card className="shadow-2xl border-2">
          <div className="bg-gradient-to-r from-indigo-500 via-violet-600 to-purple-700 px-8 py-10 rounded-t-lg text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,white)]"></div>
            <div className="relative z-10">
              <CardTitle className="text-3xl font-bold">Entrar</CardTitle>
              <CardDescription className="text-indigo-100 text-base mt-2">
                Use seu email e senha para acessar a plataforma.
              </CardDescription>
            </div>
          </div>
          <CardContent className="pt-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel></FormLabel>
                      <FormControl>
                        <ToggleGroup
                          type="single"
                          className="grid grid-cols-2 gap-4"
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <ToggleGroupItem
                            value="candidate"
                            className="h-24 rounded-xl border-2 bg-background flex flex-col items-center justify-center gap-2 transition-all hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:border-indigo-300 dark:hover:border-indigo-700 data-[state=on]:bg-gradient-to-br data-[state=on]:from-indigo-600 data-[state=on]:to-violet-600 data-[state=on]:text-white data-[state=on]:border-indigo-600 data-[state=on]:shadow-lg"
                            aria-label="Candidato"
                          >
                            <User className="w-6 h-6" />
                            <span className="text-sm font-semibold">Candidato</span>
                            <span className="text-xs opacity-80">Buscar vagas</span>
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            value="company"
                            className="h-24 rounded-xl border-2 bg-background flex flex-col items-center justify-center gap-2 transition-all hover:bg-violet-50 dark:hover:bg-violet-950/50 hover:border-violet-300 dark:hover:border-violet-700 data-[state=on]:bg-gradient-to-br data-[state=on]:from-violet-600 data-[state=on]:to-purple-600 data-[state=on]:text-white data-[state=on]:border-violet-600 data-[state=on]:shadow-lg"
                            aria-label="Empresa"
                          >
                            <Building className="w-6 h-6" />
                            <span className="text-sm font-semibold">Empresa</span>
                            <span className="text-xs opacity-80">Publicar vagas</span>
                          </ToggleGroupItem>
                        </ToggleGroup>
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
                      <FormLabel htmlFor="email">E-mail</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          type="email"
                          placeholder="candidate@example.com"
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel htmlFor="password">Senha</FormLabel>
                        <Button
                          type="button"
                          variant="link"
                          className="p-0 h-auto text-sm"
                          onClick={handleForgotPassword}
                        >
                          Esqueci minha senha
                        </Button>
                      </div>
                      <FormControl>
                        <Input
                          id="password"
                          type="password"
                          placeholder="********"
                          {...field}
                          className="h-12 border-2 rounded-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full h-12 text-base font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Entrar
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <div className="text-center border-t pt-6">
          <p className="text-sm text-muted-foreground mb-2">
            Não tem uma conta?
          </p>
          <Link
            to="/cadastro"
            className="inline-flex items-center gap-2 text-base font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent hover:from-indigo-700 hover:to-violet-700 transition-all"
          >
            Criar conta →
          </Link>
        </div>
      </div>
    </div>
  )
}
