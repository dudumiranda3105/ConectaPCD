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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/users', label: 'Usuários', icon: Users },
  { href: '/admin/companies', label: 'Empresas', icon: Building },
  { href: '/admin/jobs', label: 'Vagas', icon: Briefcase },
  {
    href: '/admin/disabilities',
    label: 'Gerenciar Deficiências',
    icon: HeartHandshake,
  },
  { href: '/admin/settings', label: 'Configurações', icon: Settings },
]

export const AdminSidebar = () => {
  const { logout } = useAuth()
  const { pathname } = useLocation()

  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link to="/admin" className="flex items-center gap-2 font-semibold">
          <Shield className="h-6 w-6 text-primary" />
          <span className="">Admin</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                pathname === item.href
                  ? 'bg-muted text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  )
}
