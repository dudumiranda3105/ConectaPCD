import { CandidateSignupFormValues } from '@/lib/schemas/candidate-signup-schema'
import { register } from './auth'

interface SignUpResponse {
  user: { id: string; email?: string } | null
}

export const signUpCandidate = async (
  formData: CandidateSignupFormValues,
): Promise<SignUpResponse> => {
  console.log('signUpCandidate received formData:', { name: formData.name, email: formData.email, password: formData.password ? '***' : 'missing' })
  console.log('Full formData keys:', Object.keys(formData))
  console.log('Full formData object (safe to log):', JSON.stringify({ ...formData, password: formData.password ? '***' : 'missing', confirmPassword: formData.confirmPassword ? '***' : 'missing' }, null, 2))

  if (!formData.email || !formData.password || !formData.name) {
    throw new Error(`Dados insuficientes para cadastro. Faltam: name=${!formData.name}, email=${!formData.email}, password=${!formData.password}`)
  }

  const res = await register({
    name: formData.name,
    email: formData.email,
    password: formData.password,
    role: 'candidate',
  })

  // salva token no localStorage (frontend simples)
  if (res.token) localStorage.setItem('auth_token', res.token)
  if (res.user) localStorage.setItem('auth_user', JSON.stringify(res.user))

  // em seguida salva o perfil completo no backend
  if (res.token) {
    await fetch(`${import.meta.env?.VITE_API_URL || 'http://localhost:3000'}/profiles/candidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${res.token}` },
      body: JSON.stringify(formData),
    })
  }

  return { user: { id: String(res.user.id), email: res.user.email } }
}
