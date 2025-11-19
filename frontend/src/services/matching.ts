import { api } from './api'

export interface BarreiraInfo {
  id: number
  descricao: string
  atendida: boolean
  acessibilidadesNecessarias: string[]
  acessibilidadesOferecidas: string[]
}

export interface MatchDetails {
  subtiposAceitos: number
  subtiposTotal: number
  barreirasAtendidas: number
  barreirasTotal: number
  barreirasPorSubtipo: Array<{
    subtipo: string
    barreiras: BarreiraInfo[]
  }>
}

export interface MatchScore {
  id: number
  candidatoId: number
  vagaId: number
  scoreTotal: number
  scoreSubtipos: number
  scoreAcessibilidades: number
  compativel: boolean
  detalhes: MatchDetails
  calculadoEm: string
  vaga?: {
    id: number
    titulo: string
    descricao: string
    localizacao?: string
    empresa: {
      id: number
      nomeFantasia: string
      nome?: string
    }
  }
}

/**
 * Calcula os scores de match para um candidato com todas as vagas ativas
 */
export const calculateMatches = async (candidatoId: number): Promise<MatchScore[]> => {
  const response = await api.get<MatchScore[]>(`match/${candidatoId}/calculate`)
  return response
}

/**
 * Busca os scores de match já calculados para um candidato
 */
export const getMatchScores = async (candidatoId: number): Promise<MatchScore[]> => {
  const response = await api.get<MatchScore[]>(`match/${candidatoId}/scores`)
  return response
}

/**
 * Busca ou calcula os match scores (primeiro tenta cache, depois calcula se necessário)
 */
export const getOrCalculateMatches = async (candidatoId: number): Promise<MatchScore[]> => {
  try {
    // Tenta buscar do cache primeiro
    const cached = await getMatchScores(candidatoId)
    
    // Se o cache está vazio ou muito antigo (mais de 1 dia), recalcula
    if (cached.length === 0 || isStale(cached[0]?.calculadoEm)) {
      return await calculateMatches(candidatoId)
    }
    
    return cached
  } catch (error) {
    // Se houver erro ao buscar cache, calcula diretamente
    console.warn('Erro ao buscar cache de matches, recalculando:', error)
    return await calculateMatches(candidatoId)
  }
}

/**
 * Verifica se um match score está desatualizado (mais de 24 horas)
 */
const isStale = (calculadoEm: string | undefined): boolean => {
  if (!calculadoEm) return true
  
  const calculatedDate = new Date(calculadoEm)
  const now = new Date()
  const hoursDiff = (now.getTime() - calculatedDate.getTime()) / (1000 * 60 * 60)
  
  return hoursDiff > 24
}