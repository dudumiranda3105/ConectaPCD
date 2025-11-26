/**
 * Serviço de Smart Match - Match Inteligente com Score Ponderado
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export interface ScoreBreakdown {
  categoria: string
  nome: string
  score: number
  peso: number
  contribuicao: number
  detalhes: string
  icon: string
}

export interface SmartMatchResult {
  candidatoId: number
  vagaId: number
  scoreTotal: number
  scoreNormalizado: number
  classificacao: 'perfeito' | 'excelente' | 'bom' | 'razoavel' | 'baixo'
  compativel: boolean
  breakdown: ScoreBreakdown[]
  razoes: string[]
  alertas: string[]
  vaga: {
    id: number
    titulo: string
    descricao: string
    escolaridade?: string
    regimeTrabalho?: string
    tipo?: string
    beneficios?: string
    isActive: boolean
    empresa: {
      id: number
      nome: string
      nomeFantasia?: string
      cidade?: string
      estado?: string
    }
  }
}

interface SmartMatchResponse {
  success: boolean
  total?: number
  matches?: SmartMatchResult[]
  match?: SmartMatchResult
  error?: string
}

/**
 * Busca vagas com smart match para um candidato
 */
export async function getSmartMatches(
  candidatoId: number,
  token: string,
  limite = 20
): Promise<SmartMatchResult[]> {
  try {
    const res = await fetch(
      `${API_URL}/smart-match/candidato/${candidatoId}/vagas?limite=${limite}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!res.ok) {
      console.error('[smartMatch.ts] Erro ao buscar smart matches:', res.status)
      return []
    }

    const data: SmartMatchResponse = await res.json()
    return data.matches || []
  } catch (error) {
    console.error('[smartMatch.ts] Erro na requisição:', error)
    return []
  }
}

/**
 * Calcula smart match específico entre candidato e vaga
 */
export async function getSmartMatchForJob(
  candidatoId: number,
  vagaId: number,
  token: string
): Promise<SmartMatchResult | null> {
  try {
    const res = await fetch(
      `${API_URL}/smart-match/candidato/${candidatoId}/vaga/${vagaId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!res.ok) {
      console.error('[smartMatch.ts] Erro ao calcular smart match:', res.status)
      return null
    }

    const data: SmartMatchResponse = await res.json()
    return data.match || null
  } catch (error) {
    console.error('[smartMatch.ts] Erro na requisição:', error)
    return null
  }
}

/**
 * Helper para obter cor baseada na classificação
 */
export function getClassificacaoInfo(classificacao: string) {
  const info: Record<string, { emoji: string; text: string; color: string; bgColor: string }> = {
    perfeito: { 
      emoji: '💙', 
      text: 'Match Perfeito', 
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10 border-blue-500/30'
    },
    excelente: { 
      emoji: '🌟', 
      text: 'Excelente', 
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-500/10 border-emerald-500/30'
    },
    bom: { 
      emoji: '✅', 
      text: 'Bom Match', 
      color: 'text-amber-600',
      bgColor: 'bg-amber-500/10 border-amber-500/30'
    },
    razoavel: { 
      emoji: '🔶', 
      text: 'Razoável', 
      color: 'text-orange-600',
      bgColor: 'bg-orange-500/10 border-orange-500/30'
    },
    baixo: { 
      emoji: '⚠️', 
      text: 'Match Baixo', 
      color: 'text-rose-600',
      bgColor: 'bg-rose-500/10 border-rose-500/30'
    },
  }
  return info[classificacao] || info.razoavel
}

/**
 * Helper para obter gradiente baseado no score
 */
export function getScoreGradient(score: number) {
  if (score >= 95) return 'from-blue-500 to-indigo-600'
  if (score >= 80) return 'from-emerald-500 to-green-600'
  if (score >= 60) return 'from-amber-500 to-orange-500'
  if (score >= 40) return 'from-orange-500 to-red-500'
  return 'from-rose-500 to-red-600'
}

/**
 * Cria mapa de vagaId -> SmartMatchResult para acesso rápido
 */
export function createSmartMatchMap(matches: SmartMatchResult[]): Map<number, SmartMatchResult> {
  const map = new Map<number, SmartMatchResult>()
  matches.forEach(match => {
    map.set(match.vagaId, match)
  })
  return map
}
