import { Navigate, Outlet } from 'react-router-dom'
import { useAuth, UserRole } from '@/hooks/use-auth'

interface ProtectedRouteProps {
  allowedRoles: UserRole[]
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(user.role)) {
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />
    }
    if (user.role === 'company') {
      return <Navigate to="/dashboard/empresa" replace />
    }
    return <Navigate to="/dashboard/candidato" replace />
  }

  return <Outlet />
}
