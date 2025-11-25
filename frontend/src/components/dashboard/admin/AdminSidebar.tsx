import { Link, useLocation } from 'react-router-dom'
import {
  Home,
  Briefcase,
  Building,
  Settings,
  LogOut,
  Users,
  Shield,
  ShieldCheck,
  Accessibility,
  ChevronRight,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: Home, color: 'indigo' },
  { href: '/admin/admins', label: 'Administradores', icon: ShieldCheck, color: 'amber' },
  { href: '/admin/users', label: 'Usuários', icon: Users, color: 'blue' },
  { href: '/admin/companies', label: 'Empresas', icon: Building, color: 'emerald' },
  { href: '/admin/jobs', label: 'Vagas', icon: Briefcase, color: 'violet' },
  { href: '/admin/disabilities', label: 'Deficiências', icon: Accessibility, color: 'teal' },
  { href: '/admin/settings', label: 'Configurações', icon: Settings, color: 'slate' },
]

const colorVariants: Record<string, { active: string; icon: string }> = {
  indigo: { active: 'from-indigo-500/20 to-violet-500/20 border-indigo-500/30', icon: 'from-indigo-500 to-violet-500' },
  amber: { active: 'from-amber-500/20 to-orange-500/20 border-amber-500/30', icon: 'from-amber-500 to-orange-500' },
  blue: { active: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30', icon: 'from-blue-500 to-cyan-500' },
  emerald: { active: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30', icon: 'from-emerald-500 to-teal-500' },
  violet: { active: 'from-violet-500/20 to-purple-500/20 border-violet-500/30', icon: 'from-violet-500 to-purple-500' },
  teal: { active: 'from-teal-500/20 to-cyan-500/20 border-teal-500/30', icon: 'from-teal-500 to-cyan-500' },
  slate: { active: 'from-slate-500/20 to-gray-500/20 border-slate-500/30', icon: 'from-slate-500 to-gray-500' },
}

export const AdminSidebar = () => {
  const { logout, user } = useAuth()
  const { pathname } = useLocation()

  const adminName = (user as any)?.name || 'Administrador'
  
  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }

  return (
    <div className="flex h-full max-h-screen flex-col bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-violet-500/5 to-purple-500/5" />
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl" />
        
        <div className="relative p-4 lg:p-5">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl blur opacity-40 group-hover:opacity-60 transition-opacity" />
              <div className="relative h-14 w-14 rounded-xl overflow-hidden ring-2 ring-white dark:ring-slate-800 shadow-xl flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
                <Shield className="h-7 w-7" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-foreground truncate text-base">
                Admin Panel
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Zap className="h-3 w-3 text-indigo-500" />
                <span className="text-xs text-muted-foreground">Sistema de Gestão</span>
              </div>
            </div>
          </div>
          
          {/* Admin Info Card */}
          <div className="mt-4 p-3 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
                {getInitials(adminName)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm text-foreground truncate">{adminName}</p>
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-auto py-4 px-3">
        <div className="mb-3 px-3">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Menu Principal</p>
        </div>
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const colors = colorVariants[item.color]
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200",
                  isActive
                    ? `bg-gradient-to-r ${colors.active} border shadow-sm`
                    : "hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-transparent"
                )}
              >
                <div className={cn(
                  "h-9 w-9 rounded-lg flex items-center justify-center transition-all duration-200",
                  isActive
                    ? `bg-gradient-to-br ${colors.icon} text-white shadow-md`
                    : "bg-slate-100 dark:bg-slate-800 text-muted-foreground group-hover:scale-105"
                )}>
                  <item.icon className="h-4.5 w-4.5" />
                </div>
                <span className={cn(
                  "flex-1 font-medium transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                )}>
                  {item.label}
                </span>
                {isActive && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <Button
          variant="ghost"
          className="w-full justify-start rounded-xl h-12 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-all group"
          onClick={logout}
        >
          <div className="h-9 w-9 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-800 mr-3 group-hover:bg-rose-500/20 transition-colors">
            <LogOut className="h-4.5 w-4.5" />
          </div>
          <span className="font-medium">Sair da conta</span>
        </Button>
      </div>
    </div>
  )
}
