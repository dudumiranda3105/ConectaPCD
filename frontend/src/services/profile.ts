const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export interface CandidateProfileData {
  id: number
  nome: string
  cpf?: string
  email?: string
  telefone?: string
  dataNascimento?: string
  genero?: string
  escolaridade: string
  curriculoUrl?: string
  laudoMedicoUrl?: string
  avatarUrl?: string
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
  acessibilidades?: Array<{
    candidatoId: number
    acessibilidadeId: number
    prioridade: string
    acessibilidade: {
      id: number
      descricao: string
    }
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
    dataNascimento?: string
    genero?: string
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
  }>,
  accessibilities?: Array<{
    acessibilidadeId: number
    prioridade: string
  }>
) {
  console.log('[updateCandidateDisabilities] Enviando requisição:', {
    url: `${API_URL}/candidatos/${candidatoId}/disabilities`,
    method: 'PUT',
    disabilities,
    accessibilities,
  })
  
  const res = await fetch(`${API_URL}/candidatos/${candidatoId}/disabilities`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ disabilities, accessibilities }),
  })
  
  console.log('[updateCandidateDisabilities] Status da resposta:', res.status)
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Erro ao atualizar deficiências' }))
    console.error('[updateCandidateDisabilities] Erro na resposta:', errorData)
    throw new Error(errorData.error || 'Erro ao atualizar deficiências')
  }
  
  const result = await res.json()
  console.log('[updateCandidateDisabilities] Sucesso:', result)
  return result
}

export async function uploadCurriculo(
  token: string,
  file: File
): Promise<{ id: number; curriculoUrl: string }> {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${API_URL}/curriculo/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erro ao enviar currículo' }))
    throw new Error(err.error || 'Erro ao enviar currículo')
  }
  return res.json()
}

export async function deleteCurriculo(token: string): Promise<{ id: number; curriculoUrl: string | null }> {
  const res = await fetch(`${API_URL}/curriculo`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erro ao remover currículo' }))
    throw new Error(err.error || 'Erro ao remover currículo')
  }
  return res.json()
}

// Avatar
export async function uploadAvatar(token: string, file: File): Promise<{ id: number; avatarUrl: string }> {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch(`${API_URL}/avatar/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erro ao enviar avatar' }))
    throw new Error(err.error || 'Erro ao enviar avatar')
  }
  return res.json()
}

export async function deleteAvatar(token: string): Promise<{ id: number; avatarUrl: string | null }> {
  const res = await fetch(`${API_URL}/avatar`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erro ao remover avatar' }))
    throw new Error(err.error || 'Erro ao remover avatar')
  }
  return res.json()
}

// Laudo Médico PCD
export interface LaudoValidationResult {
  valid: boolean
  pages?: number
  message?: string
  error?: string
}

export async function uploadLaudoMedico(
  token: string,
  file: File
): Promise<{ id: number; laudoMedicoUrl: string; validation: LaudoValidationResult }> {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${API_URL}/laudo/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erro ao enviar laudo médico' }))
    throw new Error(err.error || err.details || 'Erro ao enviar laudo médico')
  }
  return res.json()
}

export async function validateLaudoMedico(
  token: string,
  file: File
): Promise<LaudoValidationResult> {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${API_URL}/laudo/validate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
  
  const data = await res.json()
  return data
}

export async function deleteLaudoMedico(token: string): Promise<{ id: number; laudoMedicoUrl: string | null }> {
  const res = await fetch(`${API_URL}/laudo`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erro ao remover laudo médico' }))
    throw new Error(err.error || 'Erro ao remover laudo médico')
  }
  return res.json()
}
