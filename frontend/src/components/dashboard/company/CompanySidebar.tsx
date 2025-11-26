import { Link, useLocation } from 'react-router-dom'
import { Briefcase, Settings, LogOut, Users, BarChart2, FileText, MessageSquare, Building2, ChevronRight, Trophy, UserCheck, Sun, Moon, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { useTheme } from '@/providers/ThemeProvider'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard/empresa', label: 'Minhas Vagas', icon: Briefcase, color: 'blue' },
  { href: '/dashboard/empresa/candidaturas-processo', label: 'Em Processo', icon: Users, color: 'amber' },
  { href: '/dashboard/empresa/contratados', label: 'Contratados', icon: Trophy, color: 'green' },
  { href: '/dashboard/empresa/conversas', label: 'Conversas', icon: MessageSquare, color: 'emerald' },
  { href: '/dashboard/empresa/curriculos', label: 'Currículos', icon: FileText, color: 'violet' },
  { href: '/dashboard/empresa/analises', label: 'Análises', icon: BarChart2, color: 'cyan' },
  { href: '/dashboard/empresa/configuracoes', label: 'Configurações', icon: Settings, color: 'slate' },
]

const colorVariants: Record<string, { active: string; icon: string }> = {
  blue: { active: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30', icon: 'from-blue-500 to-indigo-500' },
  amber: { active: 'from-amber-500/20 to-orange-500/20 border-amber-500/30', icon: 'from-amber-500 to-orange-500' },
  emerald: { active: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30', icon: 'from-emerald-500 to-teal-500' },
  green: { active: 'from-green-500/20 to-emerald-500/20 border-green-500/30', icon: 'from-green-500 to-emerald-500' },
  violet: { active: 'from-violet-500/20 to-purple-500/20 border-violet-500/30', icon: 'from-violet-500 to-purple-500' },
  cyan: { active: 'from-cyan-500/20 to-sky-500/20 border-cyan-500/30', icon: 'from-cyan-500 to-sky-500' },
  slate: { active: 'from-slate-500/20 to-gray-500/20 border-slate-500/30', icon: 'from-slate-500 to-gray-500' },
}

export const CompanySidebar = () => {
  const { logout, user } = useAuth()
  const { pathname } = useLocation()
  const { theme, setTheme } = useTheme()

  const companyName = (user as any)?.razaoSocial || (user as any)?.name || 'Empresa'
  
  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }

  return (
    <div className="flex h-full max-h-screen flex-col bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Header com empresa */}
      <div className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-cyan-500/5" />
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl" />
        
        <div className="relative p-4 lg:p-5">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl blur opacity-40 group-hover:opacity-60 transition-opacity" />
              <div className="relative h-14 w-14 rounded-xl overflow-hidden ring-2 ring-white dark:ring-slate-800 shadow-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-base font-bold">
                <span>{getInitials(companyName)}</span>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-foreground truncate text-base">
                {companyName}
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Building2 className="h-3 w-3 text-blue-500" />
                <span className="text-xs text-muted-foreground">Portal Empresas</span>
              </div>
            </div>
          </div>
          
          {/* Stats Mini Card */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-sm">
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">12</p>
              <p className="text-[10px] text-muted-foreground">Vagas Ativas</p>
            </div>
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-sm">
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">48</p>
              <p className="text-[10px] text-muted-foreground">Candidatos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-auto py-4 px-3">
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
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
        {/* Theme Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme('light')}
            className={cn(
              "flex-1 h-9 rounded-lg gap-1.5 transition-all",
              theme === 'light' ? "bg-white dark:bg-slate-700 shadow-sm" : "hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
            )}
          >
            <Sun className="h-4 w-4" />
            <span className="text-xs">Claro</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme('dark')}
            className={cn(
              "flex-1 h-9 rounded-lg gap-1.5 transition-all",
              theme === 'dark' ? "bg-white dark:bg-slate-700 shadow-sm" : "hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
            )}
          >
            <Moon className="h-4 w-4" />
            <span className="text-xs">Escuro</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme('system')}
            className={cn(
              "flex-1 h-9 rounded-lg gap-1.5 transition-all",
              theme === 'system' ? "bg-white dark:bg-slate-700 shadow-sm" : "hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
            )}
          >
            <Monitor className="h-4 w-4" />
            <span className="text-xs">Auto</span>
          </Button>
        </div>

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
