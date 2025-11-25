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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MoreHorizontal, Eye, CheckCircle, XCircle, Building2, Loader2, AlertCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { adminService } from '@/services/adminService'

interface CompaniesTableProps {
  searchTerm?: string
}

export const CompaniesTable = ({ searchTerm = '' }: CompaniesTableProps) => {
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await adminService.getCompanies()
        setCompanies(data)
      } catch (err) {
        setError('Erro ao carregar empresas. Tente novamente.')
        console.error('Erro ao carregar empresas:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchCompanies()
  }, [])

  const filteredCompanies = companies.filter((company) => {
    const search = searchTerm.toLowerCase()
    return (
      company.name?.toLowerCase().includes(search) ||
      company.cnpj?.toLowerCase().includes(search) ||
      company.sector?.toLowerCase().includes(search)
    )
  })

  const getInitials = (name: string) => {
    if (!name) return 'E'
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Aprovada':
      case 'Verificada':
        return {
          bg: 'bg-emerald-100 dark:bg-emerald-950/50',
          text: 'text-emerald-700 dark:text-emerald-300',
          border: 'border-emerald-200 dark:border-emerald-800',
          dot: 'bg-emerald-500',
        }
      case 'Pendente':
        return {
          bg: 'bg-amber-100 dark:bg-amber-950/50',
          text: 'text-amber-700 dark:text-amber-300',
          border: 'border-amber-200 dark:border-amber-800',
          dot: 'bg-amber-500',
        }
      case 'Rejeitada':
        return {
          bg: 'bg-rose-100 dark:bg-rose-950/50',
          text: 'text-rose-700 dark:text-rose-300',
          border: 'border-rose-200 dark:border-rose-800',
          dot: 'bg-rose-500',
        }
      default:
        return {
          bg: 'bg-slate-100 dark:bg-slate-950/50',
          text: 'text-slate-700 dark:text-slate-300',
          border: 'border-slate-200 dark:border-slate-800',
          dot: 'bg-slate-500',
        }
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center animate-pulse">
          <Building2 className="h-8 w-8 text-white" />
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Carregando empresas...</span>
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

  if (filteredCompanies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
          <Building2 className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">
          {searchTerm ? 'Nenhuma empresa encontrada para a busca.' : 'Nenhuma empresa cadastrada.'}
        </p>
      </div>
    )
  }

  return (
    <div className="relative w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="min-w-[250px] font-semibold">Empresa</TableHead>
            <TableHead className="font-semibold">CNPJ</TableHead>
            <TableHead className="font-semibold">Setor</TableHead>
            <TableHead className="font-semibold">Data de Cadastro</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="text-right font-semibold">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCompanies.map((company) => {
            const statusConfig = getStatusConfig(company.status)
            return (
              <TableRow 
                key={company.id}
                className="group transition-colors hover:bg-orange-50/50 dark:hover:bg-orange-950/20"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-orange-200 dark:border-orange-800">
                      <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-500 text-white font-medium text-sm">
                        {getInitials(company.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{company.name}</p>
                      <p className="text-sm text-muted-foreground">{company.email || 'Sem email'}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-sm text-muted-foreground">
                    {company.cnpj || 'Não informado'}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800">
                    {company.sector || 'Não informado'}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(company.joined).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border`}
                    variant="outline"
                  >
                    <span className={`mr-1.5 h-2 w-2 rounded-full ${statusConfig.dot}`} />
                    {company.status}
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
                        Ver Detalhes
                      </DropdownMenuItem>
                      {company.status === 'Pendente' && (
                        <>
                          <DropdownMenuItem className="cursor-pointer text-emerald-600 focus:text-emerald-600">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Aprovar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-rose-600 focus:text-rose-600">
                            <XCircle className="mr-2 h-4 w-4" />
                            Rejeitar
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
