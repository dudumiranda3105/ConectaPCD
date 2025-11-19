import { Link, useLocation } from 'react-router-dom'
import { Briefcase, User, Settings, LogOut, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { useEffect, useState } from 'react'
import { getCandidateProfile, CandidateProfileData } from '@/services/profile'
import { Progress } from '@/components/ui/progress'

const navItems = [
  { href: '/dashboard/candidato', label: 'Vagas', icon: Briefcase },
  { href: '/dashboard/candidato/vagas-recomendadas', label: 'Vagas Recomendadas', icon: Heart },
  { href: '/dashboard/candidato/perfil', label: 'Meu Perfil', icon: User },
  {
    href: '/dashboard/candidato/configuracoes',
    label: 'Configurações',
    icon: Settings,
  },
]

export const CandidateSidebar = () => {
  const { logout } = useAuth()
  const { pathname } = useLocation()
  const { user } = useAuth() as any
  const [profile, setProfile] = useState<CandidateProfileData | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(false)

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem('auth_token')
      if (!token) return
      try {
        setLoadingProfile(true)
        const data = await getCandidateProfile(token)
        setProfile(data)
      } catch (e) {
        // silencioso
      } finally {
        setLoadingProfile(false)
      }
    }
    load()
  }, [])

  const completeness = (() => {
    if (!profile) return 0
    const fields = [profile.nome, profile.cpf, profile.email, profile.telefone, profile.escolaridade, profile.curriculoUrl, profile.avatarUrl]
    const filled = fields.filter(f => f && String(f).trim() !== '').length
    return Math.round((filled / fields.length) * 100)
  })()

  const getInitials = (name?: string) => {
    if (!name) return '?'
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }

  return (
    <div className="flex h-full max-h-screen flex-col gap-2 bg-gradient-to-b from-background to-muted/20">
      <div className="flex h-20 items-center border-b bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-purple-500/10 backdrop-blur-sm px-4 lg:h-[90px] lg:px-6">
        <div className="flex items-center gap-3 w-full">
          <div className="relative h-12 w-12 rounded-full overflow-hidden ring-2 ring-primary shadow-lg flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-sm font-semibold select-none">
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
            ) : loadingProfile ? (
              <div className="animate-pulse h-full w-full bg-muted" />
            ) : (
              <span>{getInitials(user?.name || profile?.nome)}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <Link to="/" className="flex items-center gap-2 font-semibold group">
              <Briefcase className="h-5 w-5 text-primary group-hover:scale-105 transition-transform" />
              <span className="truncate text-base">{user?.name || 'ConectaPCD'}</span>
            </Link>
            <div className="mt-1.5">
              <Progress value={completeness} className="h-2" />
              <span className="mt-1 block text-[10px] text-muted-foreground font-medium">Perfil {completeness}% completo</span>
            </div>
          </div>
        </div>
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
