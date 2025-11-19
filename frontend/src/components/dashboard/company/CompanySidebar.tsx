import { Link, useLocation } from 'react-router-dom'
import { Briefcase, Settings, LogOut, Users, BarChart2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

const navItems = [
  { href: '/dashboard/empresa', label: 'Minhas Vagas', icon: Briefcase },
  { href: '/dashboard/empresa/curriculos', label: 'Currículos', icon: Users },
  { href: '/dashboard/empresa/analises', label: 'Análises', icon: BarChart2 },
  {
    href: '/dashboard/empresa/configuracoes',
    label: 'Configurações',
    icon: Settings,
  },
]

export const CompanySidebar = () => {
  const { logout, user } = useAuth()
  const { pathname } = useLocation()

  // Pega o nome da empresa do usuário
  const companyName = (user as any)?.razaoSocial || (user as any)?.name || 'Empresa'

  return (
    <div className="flex h-full max-h-screen flex-col gap-2 bg-gradient-to-b from-background to-muted/20">
      <div className="flex h-14 items-center border-b bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-violet-500/10 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold group">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-base truncate max-w-[150px] block">{companyName}</span>
            <div className="text-[10px] text-muted-foreground">Portal Empresas</div>
          </div>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${
                pathname === item.href
                  ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-primary shadow-sm border border-primary/20'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-primary'
              }`}
            >
              <div className={`h-8 w-8 rounded-md flex items-center justify-center ${
                pathname === item.href
                  ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md'
                  : 'bg-muted text-muted-foreground'
              }`}>
                <item.icon className="h-4 w-4" />
              </div>
              <span className="flex-1">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t bg-gradient-to-r from-background to-muted/20">
        <Button
          variant="ghost"
          className="w-full justify-start hover:bg-gradient-to-r hover:from-red-500/10 hover:to-orange-500/10 hover:text-red-600 transition-all"
          onClick={logout}
        >
          <div className="h-8 w-8 rounded-md flex items-center justify-center bg-muted mr-2">
            <LogOut className="h-4 w-4" />
          </div>
          <span>Sair</span>
        </Button>
      </div>
    </div>
  )
}
