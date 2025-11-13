const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export interface MatchResult {
  candidatoId: number
  vagaId: number
  scoreTotal: number
  scoreAcessibilidades: number
  scoreSubtipos: number
  acessibilidadesAtendidas: number
  acessibilidadesTotal: number
  detalhes: {
    atendidas: Array<{ id: number; descricao: string; qualidade?: string }>
    nao_atendidas: Array<{ id: number; descricao: string; prioridade: string }>
    extras: Array<{ id: number; descricao: string }>
  }
}

export interface VagaComMatch extends MatchResult {
  vaga: {
    id: number
    titulo: string
    descricao: string
    empresa: {
      nome: string
    }
  }
}

export interface CandidatoComMatch extends MatchResult {
  candidato: {
    id: number
    nome: string
    email: string
  }
}

export async function buscarVagasCompatíveis(
  token: string,
  candidatoId: number,
  limite = 10
): Promise<VagaComMatch[]> {
  const res = await fetch(`${API_URL}/matching/candidato/${candidatoId}/vagas?limite=${limite}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) throw new Error('Erro ao buscar vagas compatíveis')
  return res.json()
}

export async function buscarCandidatosCompatíveis(
  token: string,
  vagaId: number,
  limite = 10
): Promise<CandidatoComMatch[]> {
  const res = await fetch(`${API_URL}/matching/vaga/${vagaId}/candidatos?limite=${limite}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) throw new Error('Erro ao buscar candidatos compatíveis')
  return res.json()
}

export async function calcularCompatibilidade(
  token: string,
  candidatoId: number,
  vagaId: number
): Promise<MatchResult> {
  const res = await fetch(`${API_URL}/matching/candidato/${candidatoId}/vaga/${vagaId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) throw new Error('Erro ao calcular compatibilidade')
  return res.json()
}