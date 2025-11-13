import { api } from './api'
import { User } from '@/types'
import { CandidateSignupFormValues } from '@/lib/schemas/candidate-signup-schema'
import { CompanySignupFormValues } from '@/lib/schemas/company-signup-schema'

interface LoginCredentials {
  email: string
  password: string
  role: 'candidate' | 'company' | 'admin'
}

interface AuthResponse {
  token: string
  user: User
}

// MOCK API DELAY
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // This would be a real API call, e.g., return api.post('/auth/login', credentials)
    await delay(1000)
    console.log('Logging in with:', credentials)
    if (credentials.password === 'password') {
      const user: User = {
        id: 'user-123',
        name:
          credentials.role === 'candidate'
            ? 'Candidato Logado'
            : 'Empresa Logada',
        email: credentials.email,
        role: credentials.role,
      }
      return { token: 'fake-jwt-token', user }
    } else {
      throw new Error('Invalid credentials')
    }
  },

  registerCandidate: async (
    data: Partial<CandidateSignupFormValues>,
  ): Promise<AuthResponse> => {
    // return api.post('/auth/register/candidate', data)
    await delay(1500)
    console.log('Registering candidate:', data)
    const user: User = {
      id: 'user-456',
      name: data.name!,
      email: data.email!,
      role: 'candidate',
    }
    return { token: 'fake-jwt-token-new-candidate', user }
  },

  registerCompany: async (
    data: Partial<CompanySignupFormValues>,
  ): Promise<AuthResponse> => {
    // return api.post('/auth/register/company', data)
    await delay(1500)
    console.log('Registering company:', data)
    const user: User = {
      id: 'company-789',
      name: data.nomeFantasia!,
      email: data.emailCorporativo!,
      role: 'company',
    }
    return { token: 'fake-jwt-token-new-company', user }
  },

  logout: async (): Promise<void> => {
    // return api.post('/auth/logout', {})
    await delay(500)
    console.log('Logging out')
  },

  recoverPassword: async (email: string): Promise<{ message: string }> => {
    // return api.post('/auth/recover-password', { email })
    await delay(1000)
    console.log('Recovering password for:', email)
    return { message: 'Password recovery email sent.' }
  },
}
