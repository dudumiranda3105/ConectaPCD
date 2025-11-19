import { useState, useMemo, ReactNode } from 'react'
import { AuthContext, User as BaseUser } from '@/hooks/use-auth'
import { CandidateSignupFormValues } from '@/lib/schemas/candidate-signup-schema'

export interface User extends BaseUser {
  profileData?: Partial<CandidateSignupFormValues>
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem('auth_user')
      return raw ? (JSON.parse(raw) as User) : null
    } catch (e) {
      return null
    }
  })

  const login = (userData: BaseUser) => {
    const fullUserData: User = { ...userData }
    console.log('[AuthProvider] Login - userData recebido:', fullUserData)
    setUser(fullUserData)
    try {
      localStorage.setItem('auth_user', JSON.stringify(fullUserData))
    } catch (e) {
      /* ignore */
    }
  }

  const logout = () => {
    setUser(null)
    try {
      localStorage.removeItem('auth_user')
      localStorage.removeItem('auth_token')
    } catch (e) {
      /* ignore */
    }
  }

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
