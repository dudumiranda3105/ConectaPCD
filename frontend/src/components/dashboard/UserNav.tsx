import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { LogOut } from 'lucide-react'

export const UserNav = () => {
  const { logout } = useAuth()

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={logout}>
        <LogOut className="mr-2 h-4 w-4" />
        Sair
      </Button>
    </div>
  )
}
