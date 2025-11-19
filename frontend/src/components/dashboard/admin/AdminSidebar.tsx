import { Link, useLocation } from 'react-router-dom'
import {
  Home,
  Briefcase,
  Building,
  Settings,
  LogOut,
  Users,
  Shield,
  HeartHandshake,
  Link as LinkIcon,
  AlertTriangle,
  Accessibility,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/users', label: 'Usuários', icon: Users },
  { href: '/admin/companies', label: 'Empresas', icon: Building },
  { href: '/admin/jobs', label: 'Vagas', icon: Briefcase },
  {
    href: '/admin/system',
    label: 'Gerenciamento do Sistema',
    icon: Settings,
    badge: '4',
  },
  { href: '/admin/settings', label: 'Configurações', icon: Shield },
]

export const AdminSidebar = () => {
  const { logout } = useAuth()
  const { pathname } = useLocation()

  return (
    <div className="flex h-full max-h-screen flex-col gap-2 bg-gradient-to-b from-background to-muted/20">
      <div className="flex h-14 items-center border-b bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-purple-500/10 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6">
        <Link to="/admin" className="flex items-center gap-2 font-semibold group">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-base">Admin Panel</span>
            <div className="text-[10px] text-muted-foreground">Sistema de Gestão</div>
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
                  ? 'bg-gradient-to-r from-indigo-500/20 to-violet-500/20 text-primary shadow-sm border border-primary/20'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-primary'
              }`}
            >
              <div className={`h-8 w-8 rounded-md flex items-center justify-center ${
                pathname === item.href
                  ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md'
                  : 'bg-muted text-muted-foreground group-hover:bg-primary/10'
              }`}>
                <item.icon className="h-4 w-4" />
              </div>
              <span className="flex-1">{item.label}</span>
              {('badge' in item) && (
                <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-sm">
                  {item.badge}
                </span>
              )}
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
