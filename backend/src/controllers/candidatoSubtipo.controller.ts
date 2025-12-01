import { Request, Response } from 'express'
import { CandidatoSubtipoService } from '../services/candidatoSubtipo.service'

export const CandidatoSubtipoController = {
  async updateDisabilities(req: Request, res: Response) {
    try {
      const candidatoId = Number(req.params.candidatoId)
      const { disabilities, accessibilities, assistiveResources } = req.body

      if (isNaN(candidatoId)) {
        return res.status(400).json({ error: 'candidatoId inválido' })
      }

      const result = await CandidatoSubtipoService.updateDisabilities(candidatoId, disabilities, accessibilities, assistiveResources)
      res.json(result)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  },
}
