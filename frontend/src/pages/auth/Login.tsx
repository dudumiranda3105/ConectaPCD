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
import { Briefcase, Loader2 } from 'lucide-react'
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
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <Briefcase className="h-12 w-12 text-primary" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight">
            Acesse sua conta
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Bem-vindo de volta!
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Entrar</CardTitle>
            <CardDescription>
              Use seu email e senha para acessar a plataforma.
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                      <FormLabel>Eu sou...</FormLabel>
                      <FormControl>
                        <ToggleGroup
                          type="single"
                          className="grid grid-cols-2 gap-2"
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <ToggleGroupItem
                            value="candidate"
                            className="h-16 flex-col"
                          >
                            Candidato
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            value="company"
                            className="h-16 flex-col"
                          >
                            Empresa
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
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Entrar
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <p className="text-center text-sm text-muted-foreground">
          Não tem uma conta?{' '}
          <Link
            to="/cadastro"
            className="font-medium text-primary hover:underline"
          >
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  )
}
