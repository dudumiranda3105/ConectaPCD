import { useState, useMemo, ReactNode } from 'react'
import { AuthContext, User as BaseUser } from '@/hooks/use-auth'
import { CandidateSignupFormValues } from '@/lib/schemas/candidate-signup-schema'

export interface User extends BaseUser {
  profileData?: Partial<CandidateSignupFormValues>
}

interface AuthProviderProps {
  children: ReactNode
}

const mockCandidateProfile: Partial<CandidateSignupFormValues> = {
  name: 'João da Silva',
  cpf: '123.456.789-00',
  email: 'candidate@example.com',
  cep: '01001-000',
  uf: 'SP',
  cidade: 'São Paulo',
  bairro: 'Sé',
  rua: 'Praça da Sé',
  numero: '1',
  educationLevel: 'Ensino Superior Completo',
  course: 'Ciência da Computação',
  institution: 'Universidade de São Paulo',
  experiences: [
    {
      company: 'Tech Solutions',
      role: 'Desenvolvedor Junior',
      startDate: '2022-01',
      endDate: '2023-12',
    },
  ],
  disabilities: [
    {
      typeId: 1, // Visual
      subtypes: [
        {
          subtypeId: 2, // Baixa Visão
          barriers: [4], // Tecnológica
        },
      ],
    },
    {
      typeId: 3, // Física/Motora
      subtypes: [
        {
          subtypeId: 6, // Paraplegia
          barriers: [1, 5], // Arquitetônica, Transporte
        },
      ],
    },
  ],
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
    let fullUserData: User = { ...userData }
    if (userData.role === 'candidate') {
      fullUserData = {
        ...userData,
        profileData: { ...mockCandidateProfile, email: userData.email },
      }
    }
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
