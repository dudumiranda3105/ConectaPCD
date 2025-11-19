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
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
      </div>
      
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-600 to-purple-700 flex items-center justify-center shadow-2xl mb-6 animate-in zoom-in duration-500">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
            Criar Conta Admin
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Registre-se para gerenciar o sistema ConectaPCD
          </p>
        </div>
        <Card className="border-2 shadow-2xl bg-gradient-to-br from-background to-muted/20 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-purple-500/10 border-b">
            <CardTitle className="text-2xl flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              Novo Administrador
            </CardTitle>
            <CardDescription className="text-base">Preencha seus dados para criar sua conta</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
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
                      <FormLabel htmlFor="name" className="text-sm font-semibold">Nome Completo</FormLabel>
                      <FormControl>
                        <Input 
                          id="name" 
                          placeholder="João da Silva" 
                          className="h-12 border-2 focus:border-indigo-500 transition-all"
                          {...field} 
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
                      <FormLabel htmlFor="email" className="text-sm font-semibold">E-mail Administrativo</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          type="email"
                          placeholder="admin@conectapcd.com"
                          className="h-12 border-2 focus:border-indigo-500 transition-all"
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
                      <FormLabel htmlFor="password" className="text-sm font-semibold">Senha</FormLabel>
                      <FormControl>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Mínimo 8 caracteres"
                          className="h-12 border-2 focus:border-indigo-500 transition-all"
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
                      <FormLabel htmlFor="confirmPassword" className="text-sm font-semibold">
                        Confirmar Senha
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Digite a senha novamente"
                          className="h-12 border-2 focus:border-indigo-500 transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-indigo-500 via-violet-600 to-purple-600 hover:from-indigo-600 hover:via-violet-700 hover:to-purple-700 shadow-lg" 
                  disabled={isLoading}
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  )}
                  Criar Conta de Administrador
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Já possui uma conta?
          </p>
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-2 text-base font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent hover:from-indigo-700 hover:to-violet-700 transition-all"
          >
            Fazer login →
          </Link>
        </div>
      </div>
    </div>
  )
}
