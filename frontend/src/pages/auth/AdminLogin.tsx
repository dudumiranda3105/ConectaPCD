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

const adminLoginSchema = z.object({
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
  password: z.string().min(1, { message: 'A senha é obrigatória.' }),
})

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>

export default function AdminLoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: AdminLoginFormValues) => {
    setIsLoading(true)
    try {
      const res = await authService.login(data.email, data.password)
      if (res.token) localStorage.setItem('auth_token', res.token)
      const user = {
        id: String(res.user.id),
        name: res.user.name,
        email: res.user.email,
        role: 'admin',
      }
      login(user)
      toast({ title: 'Login bem-sucedido!', description: 'Redirecionando para o painel de administrador.' })
      navigate('/admin')
    } catch (err: any) {
      toast({ title: 'Erro de Login', description: err.message || 'Credenciais inválidas.', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <Shield className="h-12 w-12 text-primary" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight">
            Acesso Administrativo
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Entre com suas credenciais de administrador.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Login de Administrador</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
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
                          placeholder="admin@example.com"
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
          Não tem uma conta de administrador?{' '}
          <Link
            to="/admin/cadastro"
            className="font-medium text-primary hover:underline"
          >
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  )
}
