import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MoreHorizontal, Eye, UserCog, Ban, Loader2, Users, AlertCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { adminService } from '@/services/adminService'

interface UsersTableProps {
  searchTerm?: string
}

export const UsersTable = ({ searchTerm = '' }: UsersTableProps) => {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await adminService.getUsers()
        setUsers(data)
      } catch (err) {
        setError('Erro ao carregar usuários. Tente novamente.')
        console.error('Erro ao carregar usuários:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase()
    return (
      user.name?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search) ||
      user.disability?.toLowerCase().includes(search)
    )
  })

  const getInitials = (name: string) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center animate-pulse">
          <Users className="h-8 w-8 text-white" />
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Carregando usuários...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="h-16 w-16 rounded-2xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-rose-500" />
        </div>
        <p className="text-rose-500 font-medium">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Tentar novamente
        </Button>
      </div>
    )
  }

  if (filteredUsers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
          <Users className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">
          {searchTerm ? 'Nenhum usuário encontrado para a busca.' : 'Nenhum usuário cadastrado.'}
        </p>
      </div>
    )
  }

  return (
    <div className="relative w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="min-w-[250px] font-semibold">Usuário</TableHead>
            <TableHead className="font-semibold">Deficiência</TableHead>
            <TableHead className="font-semibold">Data de Cadastro</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="text-right font-semibold">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user, index) => (
            <TableRow 
              key={user.id}
              className="group transition-colors hover:bg-blue-50/50 dark:hover:bg-blue-950/20"
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-blue-200 dark:border-blue-800">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-medium text-sm">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="font-normal bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                  {user.disability || 'Não informado'}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(user.joined).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </TableCell>
              <TableCell>
                <Badge
                  className={`${
                    user.status === 'Ativo'
                      ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      : 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                  } border`}
                  variant="outline"
                >
                  <span className={`mr-1.5 h-2 w-2 rounded-full ${
                    user.status === 'Ativo' ? 'bg-emerald-500' : 'bg-rose-500'
                  }`} />
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="h-9 w-9 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem className="cursor-pointer">
                      <Eye className="mr-2 h-4 w-4 text-blue-500" />
                      Ver Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <UserCog className="mr-2 h-4 w-4 text-amber-500" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer text-rose-600 focus:text-rose-600">
                      <Ban className="mr-2 h-4 w-4" />
                      {user.status === 'Ativo' ? 'Suspender' : 'Reativar'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
