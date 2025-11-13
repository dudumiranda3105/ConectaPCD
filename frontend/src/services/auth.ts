const API_BASE = import.meta.env?.VITE_API_URL || 'http://localhost:3000'

type Role = 'candidate' | 'company' | 'admin'

const normalizeRole = (r: string | undefined): Role => {
  if (!r) return 'candidate'
  const v = String(r).toLowerCase()
  if (v.includes('company')) return 'company'
  if (v.includes('admin')) return 'admin'
  return 'candidate'
}

export const login = async (email: string, password: string) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || 'Erro ao efetuar login')
  }

  const data = await res.json()
  const user = data.user
  const token = data.token
  return { user: { ...user, role: normalizeRole(user.role) }, token }
}

export const register = async (payload: { name: string; email: string; password: string; role?: 'candidate' | 'company' | 'admin' }) => {
  console.log('[AUTH SERVICE] register called with:', { name: payload.name, email: payload.email, password: payload.password ? '***' : 'missing', role: payload.role })
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || 'Erro ao registrar usuário')
  }

  const data = await res.json()
  const user = data.user
  const token = data.token
  return { user: { ...user, role: normalizeRole(user.role) }, token }
}
