const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export interface CandidateProfileData {
  id: number
  nome: string
  cpf?: string
  email?: string
  telefone?: string
  escolaridade: string
  subtipos?: Array<{
    candidatoId: number
    subtipoId: number
    subtipo: {
      id: number
      nome: string
      tipoId: number
      tipo: {
        id: number
        nome: string
      }
    }
    barreiras: Array<{
      candidatoId: number
      subtipoId: number
      barreiraId: number
      barreira: {
        id: number
        descricao: string
      }
    }>
  }>
}

export async function getCandidateProfile(token: string): Promise<CandidateProfileData> {
  const res = await fetch(`${API_URL}/profiles/candidate`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) throw new Error('Erro ao buscar perfil')
  return res.json()
}

export async function updateCandidateProfile(
  token: string,
  data: {
    name?: string
    cpf?: string
    email?: string
    telefone?: string
    educationLevel?: string
  }
) {
  const res = await fetch(`${API_URL}/profiles/candidate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Erro ao atualizar perfil')
  return res.json()
}

export async function updateCandidateDisabilities(
  token: string,
  candidatoId: number,
  disabilities: Array<{
    typeId: number
    subtypeId: number
    barriers: number[]
  }>
) {
  const res = await fetch(`${API_URL}/candidatos/${candidatoId}/disabilities`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ disabilities }),
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Erro ao atualizar deficiências' }))
    throw new Error(errorData.error || 'Erro ao atualizar deficiências')
  }
  return res.json()
}
