import { Request, Response } from 'express'
import { MatchingService } from '../services/matching.service'

export const MatchingController = {
  /**
   * GET /matching/candidato/:candidatoId/vagas
   * Busca as melhores vagas para um candidato
   */
  async buscarVagasParaCandidato(req: Request, res: Response) {
    try {
      const candidatoId = Number(req.params.candidatoId)
      const limite = Number(req.query.limite) || 10

      if (isNaN(candidatoId)) {
        return res.status(400).json({ error: 'candidatoId inválido' })
      }

      const matches = await MatchingService.buscarMelhoresVagas(candidatoId, limite)
      res.json(matches)
    } catch (error: any) {
      console.error('Erro ao buscar vagas para candidato:', error)
      res.status(500).json({ error: error.message || 'Erro interno do servidor' })
    }
  },

  /**
   * GET /matching/vaga/:vagaId/candidatos
   * Busca os melhores candidatos para uma vaga
   */
  async buscarCandidatosParaVaga(req: Request, res: Response) {
    try {
      const vagaId = Number(req.params.vagaId)
      const limite = Number(req.query.limite) || 10

      if (isNaN(vagaId)) {
        return res.status(400).json({ error: 'vagaId inválido' })
      }

      const matches = await MatchingService.buscarMelhoresCandidatos(vagaId, limite)
      res.json(matches)
    } catch (error: any) {
      console.error('Erro ao buscar candidatos para vaga:', error)
      res.status(500).json({ error: error.message || 'Erro interno do servidor' })
    }
  },

  /**
   * GET /matching/candidato/:candidatoId/vaga/:vagaId
   * Calcula compatibilidade específica entre candidato e vaga
   */
  async calcularCompatibilidade(req: Request, res: Response) {
    try {
      const candidatoId = Number(req.params.candidatoId)
      const vagaId = Number(req.params.vagaId)

      if (isNaN(candidatoId) || isNaN(vagaId)) {
        return res.status(400).json({ error: 'IDs inválidos' })
      }

      const match = await MatchingService.calcularMatch(candidatoId, vagaId)
      await MatchingService.salvarMatch(match)
      
      res.json(match)
    } catch (error: any) {
      console.error('Erro ao calcular compatibilidade:', error)
      res.status(500).json({ error: error.message || 'Erro interno do servidor' })
    }
  }
}