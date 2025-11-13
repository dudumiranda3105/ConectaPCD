import { createContext, useContext } from 'react'

export type UserRole = 'candidate' | 'company' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  empresaId?: number
  candidatoId?: number
}

export interface AuthContextType {
  user: User | null
  login: (user: User) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
