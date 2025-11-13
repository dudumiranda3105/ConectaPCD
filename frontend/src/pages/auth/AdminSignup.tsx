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
import { Loader2, Shield } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/components/ui/use-toast'
import * as authService from '@/services/auth'

const adminSignupSchema = z
  .object({
    name: z.string().min(3, { message: 'O nome é obrigatório.' }),
    email: z.string().email({ message: 'Por favor, insira um email válido.' }),
    password: z
      .string()
      .min(8, { message: 'A senha deve ter no mínimo 8 caracteres.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  })

type AdminSignupFormValues = z.infer<typeof adminSignupSchema>

export default function AdminSignupPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<AdminSignupFormValues>({
    resolver: zodResolver(adminSignupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = (data: AdminSignupFormValues) => {
    setIsLoading(true)
    ;(async () => {
      try {
        const res = await authService.register({
          name: data.name,
          email: data.email,
          password: data.password,
          role: 'admin',
        })
        if (res.token) localStorage.setItem('auth_token', res.token)
        login({ id: String(res.user.id), name: res.user.name, email: res.user.email, role: 'admin' })
        toast({ title: 'Cadastro realizado com sucesso!', description: 'Redirecionando para o painel de administrador.' })
        navigate('/admin')
      } catch (err: any) {
        toast({ title: 'Erro no Cadastro', description: err.message || 'Não foi possível registrar.', variant: 'destructive' })
      } finally {
        setIsLoading(false)
      }
    })()
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <Shield className="h-12 w-12 text-primary" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight">
            Criar Conta de Administrador
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Preencha os campos para se registrar.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Registrar</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="name">Nome Completo</FormLabel>
                      <FormControl>
                        <Input id="name" placeholder="Seu nome" {...field} />
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
                          placeholder="seu@email.com"
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
                      <FormLabel htmlFor="password">Senha</FormLabel>
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
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="confirmPassword">
                        Confirmar Senha
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="confirmPassword"
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
                  Registrar
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <p className="text-center text-sm text-muted-foreground">
          Já tem uma conta?{' '}
          <Link
            to="/admin/login"
            className="font-medium text-primary hover:underline"
          >
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
