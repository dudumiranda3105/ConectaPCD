const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export interface MatchScore {
  id: number
  candidatoId: number
  vagaId: number
  scoreTotal: number
  scoreAcessibilidades: number
  scoreSubtipos: number
  acessibilidadesAtendidas: number
  acessibilidadesTotal: number
  detalhes: {
    subtiposAceitos: number
    subtiposTotal: number
    barreirasAtendidas: number
    barreirasTotal: number
    barreirasPorSubtipo: Array<{
      subtipo: string
      barreiras: Array<{
        id: number
        descricao: string
        atendida: boolean
        acessibilidadesNecessarias: string[]
        acessibilidadesOferecidas: string[]
      }>
    }>
  }
  compativel: boolean
  calculadoEm: string
  vaga: {
    id: number
    titulo: string
    descricao: string
    isActive: boolean
    empresa: {
      id: number
      nome: string
    }
  }
}

export interface MatchResult {
  vagaId: number
  scoreTotal: number
  scoreAcessibilidades: number
  scoreSubtipos: number
  compativel: boolean
  detalhes: any
  calculadoEm: string
  vaga: any
}

// Buscar scores salvos no cache (banco de dados)
export async function getMatchScores(candidatoId: number, token: string): Promise<MatchScore[]> {
  const res = await fetch(`${API_URL}/match/${candidatoId}/scores`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) {
    console.error('[match.ts] Erro ao buscar scores:', res.status)
    return []
  }
  return res.json()
}

// Calcular matches e salvar no banco (atualiza o cache)
export async function calculateMatches(candidatoId: number, token: string): Promise<MatchResult[]> {
  const res = await fetch(`${API_URL}/match/${candidatoId}/calculate`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) {
    console.error('[match.ts] Erro ao calcular matches:', res.status)
    return []
  }
  return res.json()
}

// Buscar vagas compatíveis (score >= 50)
export async function getVagasCompativeis(candidatoId: number, token: string) {
  const res = await fetch(`${API_URL}/match/${candidatoId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) {
    console.error('[match.ts] Erro ao buscar vagas compatíveis:', res.status)
    return []
  }
  return res.json()
}

// Mapa de vagaId para score para acesso rápido
export function createScoreMap(scores: MatchScore[]): Map<number, MatchScore> {
  const map = new Map<number, MatchScore>()
  scores.forEach(score => {
    map.set(score.vagaId, score)
  })
  return map
}
