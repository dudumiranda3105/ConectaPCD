import { Request, Response } from 'express'
import { SmartMatchService } from '../services/smartMatch.service'
import { prisma } from '../repositories/prisma'

export const SmartMatchController = {
  /**
   * GET /smart-match/candidato/:candidatoId/vagas
   * Busca vagas com smart match para um candidato
   */
  async buscarVagasSmartMatch(req: Request, res: Response) {
    try {
      const candidatoId = Number(req.params.candidatoId)
      const limite = Number(req.query.limite) || 20

      if (isNaN(candidatoId)) {
        return res.status(400).json({ error: 'candidatoId inválido' })
      }

      const matches = await SmartMatchService.buscarVagasComSmartMatch(candidatoId, limite)
      
      res.json({
        success: true,
        total: matches.length,
        matches
      })
    } catch (error: any) {
      console.error('Erro ao buscar smart matches:', error)
      res.status(500).json({ 
        success: false,
        error: error.message || 'Erro interno do servidor' 
      })
    }
  },

  /**
   * GET /smart-match/candidato/:candidatoId/vaga/:vagaId
   * Calcula smart match específico entre candidato e vaga
   */
  async calcularSmartMatch(req: Request, res: Response) {
    try {
      const candidatoId = Number(req.params.candidatoId)
      const vagaId = Number(req.params.vagaId)

      if (isNaN(candidatoId) || isNaN(vagaId)) {
        return res.status(400).json({ error: 'IDs inválidos' })
      }

      const match = await SmartMatchService.calcularSmartMatch(candidatoId, vagaId)
      
      res.json({
        success: true,
        match
      })
    } catch (error: any) {
      console.error('Erro ao calcular smart match:', error)
      res.status(500).json({ 
        success: false,
        error: error.message || 'Erro interno do servidor' 
      })
    }
  },

  /**
   * GET /smart-match/vaga/:vagaId/top-candidatos
   * Busca os melhores candidatos para uma vaga
   */
  async buscarTopCandidatos(req: Request, res: Response) {
    try {
      const vagaId = Number(req.params.vagaId)
      const limite = Number(req.query.limite) || 10

      if (isNaN(vagaId)) {
        return res.status(400).json({ error: 'vagaId inválido' })
      }

      // Buscar todos os candidatos ativos
      const candidatos = await prisma.candidato.findMany({
        where: { isActive: true },
        select: { id: true }
      })

      const results = []
      for (const candidato of candidatos) {
        try {
          const match = await SmartMatchService.calcularSmartMatch(candidato.id, vagaId)
          results.push(match)
        } catch (error) {
          // Ignorar erros individuais
        }
      }

      // Ordenar por score
      const topCandidatos = results
        .sort((a, b) => b.scoreTotal - a.scoreTotal)
        .slice(0, limite)

      res.json({
        success: true,
        total: topCandidatos.length,
        candidatos: topCandidatos
      })
    } catch (error: any) {
      console.error('Erro ao buscar top candidatos:', error)
      res.status(500).json({ 
        success: false,
        error: error.message || 'Erro interno do servidor' 
      })
    }
  }
}
