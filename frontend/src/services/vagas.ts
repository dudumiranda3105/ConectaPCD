import { JobPostingFormValues } from '@/lib/schemas/job-posting-schema'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export async function publicarVaga(data: JobPostingFormValues, token: string, empresaId: number) {
  const payload = {
    empresaId,
    titulo: data.title,
    descricao: data.description,
    escolaridade: data.escolaridade,
    tipo: data.type,
    regimeTrabalho: data.regime,
    beneficios: data.benefits,
    acessibilidades: data.accessibilities,
  };
  console.log('[publicarVaga] Enviando payload para backend:', payload);
  const res = await fetch(`${API_URL}/vagas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const errorText = await res.text();
    console.error('[publicarVaga] Erro ao publicar vaga:', errorText);
    throw new Error('Erro ao publicar vaga');
  }
  return res.json();
}

export async function listarVagasEmpresa(token: string, empresaId: number) {
  const res = await fetch(`${API_URL}/vagas/empresa/${empresaId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) throw new Error('Erro ao buscar vagas da empresa')
  return res.json()
}

export async function listarVagasPublicas() {
  const res = await fetch(`${API_URL}/vagas`)
  if (!res.ok) throw new Error('Erro ao listar vagas')
  return res.json()
}

export async function atualizarVaga(
  token: string,
  vagaId: number,
  data: {
    titulo?: string
    descricao?: string
    escolaridade?: string
    tipo?: string
    regimeTrabalho?: string
    beneficios?: string
    acessibilidades?: string[]
    isActive?: boolean
  }
) {
  const res = await fetch(`${API_URL}/vagas/${vagaId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Erro ao atualizar vaga')
  return res.json()
}

export async function listarCandidaturasVaga(token: string, vagaId: number) {
  const res = await fetch(`${API_URL}/vagas/${vagaId}/candidaturas`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) throw new Error('Erro ao listar candidaturas da vaga')
  return res.json()
}

export async function fecharVaga(token: string, vagaId: number) {
  return atualizarVaga(token, vagaId, { isActive: false })
}

export async function reabrirVaga(token: string, vagaId: number) {
  return atualizarVaga(token, vagaId, { isActive: true })
}

export async function registrarVisualizacaoVaga(vagaId: number) {
  const res = await fetch(`${API_URL}/vagas/${vagaId}/view`, { method: 'POST' })
  if (!res.ok) throw new Error('Erro ao registrar visualização da vaga')
  return res.json()
}
