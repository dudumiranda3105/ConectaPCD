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
            Acesso Administrativo
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Entre com suas credenciais de administrador
          </p>
        </div>
        <Card className="border-2 shadow-2xl bg-gradient-to-br from-background to-muted/20 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-purple-500/10 border-b">
            <CardTitle className="text-2xl flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              Login de Administrador
            </CardTitle>
            <CardDescription className="text-base">Sistema de gestão ConectaPCD</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
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
                          placeholder="••••••••"
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
                  Acessar Painel
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
