import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
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
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Shield, Trash2, UserPlus, Users, ShieldCheck, AlertCircle, Search } from 'lucide-react'
import { adminService } from '@/services/adminService'

const createAdminSchema = z
  .object({
    name: z.string().min(3, { message: 'O nome deve ter no mínimo 3 caracteres.' }),
    email: z.string().email({ message: 'Por favor, insira um email válido.' }),
    password: z.string().min(8, { message: 'A senha deve ter no mínimo 8 caracteres.' }),
    confirmPassword: z.string(),
    cargo: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  })

type CreateAdminFormValues = z.infer<typeof createAdminSchema>

interface Admin {
  id: string
  name: string
  email: string
  cargo: string
  joined: string
  status: string
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { toast } = useToast()

  const form = useForm<CreateAdminFormValues>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      cargo: '',
    },
  })

  const fetchAdmins = async () => {
    try {
      const data = await adminService.getAdmins()
      setAdmins(data)
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os administradores.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  const filteredAdmins = admins.filter((admin) => {
    const search = searchTerm.toLowerCase()
    return (
      admin.name?.toLowerCase().includes(search) ||
      admin.email?.toLowerCase().includes(search) ||
      admin.cargo?.toLowerCase().includes(search)
    )
  })

  const onSubmit = async (data: CreateAdminFormValues) => {
    setIsCreating(true)
    try {
      const newAdmin = await adminService.createAdmin({
        name: data.name,
        email: data.email,
        password: data.password,
        cargo: data.cargo || 'Administrador',
      })

      setAdmins((prev) => [newAdmin, ...prev])
      toast({
        title: '✅ Sucesso!',
        description: 'Administrador criado com sucesso.',
      })
      setIsDialogOpen(false)
      form.reset()
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível criar o administrador.',
        variant: 'destructive',
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleDelete = async (adminId: string) => {
    try {
      await adminService.deleteAdmin(adminId)
      setAdmins((prev) => prev.filter((admin) => admin.id !== adminId))
      toast({
        title: '✅ Sucesso!',
        description: 'Administrador removido com sucesso.',
      })
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível remover o administrador.',
        variant: 'destructive',
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const getInitials = (name: string) => {
    if (!name) return 'A'
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-600 shadow-2xl">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-purple-300/20 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>
        
        <div className="relative px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/20">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Administradores
                </h1>
                <p className="text-white/70 mt-1">
                  Gerencie os administradores do sistema
                </p>
              </div>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border border-white/20">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Novo Administrador
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader className="space-y-3 pb-4 border-b">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                      <UserPlus className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <DialogTitle className="text-2xl">Novo Administrador</DialogTitle>
                      <DialogDescription className="text-base">
                        Preencha os dados para criar uma nova conta
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold flex items-center gap-2">
                            <Users className="h-4 w-4 text-purple-500" />
                            Nome Completo
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="João da Silva" 
                              className="h-11 border-2 focus:border-purple-500 transition-all"
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
                          <FormLabel className="text-sm font-semibold flex items-center gap-2">
                            <svg className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            E-mail
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="admin@conectapcd.com" 
                              className="h-11 border-2 focus:border-purple-500 transition-all"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cargo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-purple-500" />
                            Cargo <span className="text-muted-foreground font-normal">(opcional)</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Ex: Administrador, Suporte, etc." 
                              className="h-11 border-2 focus:border-purple-500 transition-all"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold flex items-center gap-2">
                              <svg className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                              Senha
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Mínimo 8 caracteres" 
                                className="h-11 border-2 focus:border-purple-500 transition-all"
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
                            <FormLabel className="text-sm font-semibold flex items-center gap-2">
                              <svg className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                              Confirmar
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Repita a senha" 
                                className="h-11 border-2 focus:border-purple-500 transition-all"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <DialogFooter className="pt-4 border-t gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                        className="h-10 px-6"
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        disabled={isCreating}
                        className="h-10 px-6 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-lg"
                      >
                        {isCreating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Criando...
                          </>
                        ) : (
                          <>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Criar Administrador
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-2 border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-purple-500 flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Admins</p>
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                ) : (
                  <p className="text-3xl font-bold text-purple-600">{admins.length}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-500 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Admins Ativos</p>
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                ) : (
                  <p className="text-3xl font-bold text-emerald-600">
                    {admins.filter(a => a.status === 'Ativo').length}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table Card */}
      <Card className="border-2 shadow-lg overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" />
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Lista de Administradores
              </CardTitle>
              <CardDescription>
                {admins.length} administrador{admins.length !== 1 ? 'es' : ''} cadastrado{admins.length !== 1 ? 's' : ''}
              </CardDescription>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar administrador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center animate-pulse">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Carregando administradores...</span>
              </div>
            </div>
          ) : filteredAdmins.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
                <Shield className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                {searchTerm ? 'Nenhum administrador encontrado para a busca.' : 'Nenhum administrador cadastrado.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="font-semibold">Administrador</TableHead>
                    <TableHead className="font-semibold">Cargo</TableHead>
                    <TableHead className="font-semibold">Data de Cadastro</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="text-right font-semibold">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdmins.map((admin) => (
                    <TableRow key={admin.id} className="group transition-colors hover:bg-purple-50/50 dark:hover:bg-purple-950/20">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-purple-200 dark:border-purple-800">
                            <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-500 text-white font-medium text-sm">
                              {getInitials(admin.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{admin.name}</p>
                            <p className="text-sm text-muted-foreground">{admin.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800">
                          {admin.cargo || 'Administrador'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(admin.joined)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            admin.status === 'Ativo'
                              ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                              : 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                          } border`}
                          variant="outline"
                        >
                          <span className={`mr-1.5 h-2 w-2 rounded-full ${
                            admin.status === 'Ativo' ? 'bg-emerald-500' : 'bg-rose-500'
                          }`} />
                          {admin.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 opacity-0 group-hover:opacity-100 transition-opacity text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-lg bg-rose-100 dark:bg-rose-950 flex items-center justify-center">
                                  <AlertCircle className="h-4 w-4 text-rose-500" />
                                </div>
                                Remover Administrador
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja remover o administrador{' '}
                                <strong>{admin.name}</strong>? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(admin.id)}
                                className="bg-rose-500 text-white hover:bg-rose-600"
                              >
                                Remover
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
