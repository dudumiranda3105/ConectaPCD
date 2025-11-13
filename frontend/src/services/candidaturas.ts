const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export async function candidatarSeVaga(vagaId: number, candidatoId: number, token: string) {
  const payload = { vagaId, candidatoId }
  const res = await fetch(`${API_URL}/candidaturas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.error || 'Erro ao candidatar-se')
  }
  return res.json()
}

export async function listarCandidaturasCandidato(candidatoId: number, token: string) {
  const res = await fetch(`${API_URL}/candidaturas/candidato/${candidatoId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) throw new Error('Erro ao buscar candidaturas')
  return res.json()
}

export async function listarCandidaturasVaga(vagaId: number, token: string) {
  const res = await fetch(`${API_URL}/candidaturas/vaga/${vagaId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) throw new Error('Erro ao buscar candidatos da vaga')
  return res.json()
}
