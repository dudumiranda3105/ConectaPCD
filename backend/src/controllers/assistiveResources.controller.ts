import { Request, Response } from 'express'
import { AssistiveResourcesService } from '../services/assistiveResources.service'

export const AssistiveResourcesController = {
  async list(_req: Request, res: Response) {
    const data = await AssistiveResourcesService.list()
    res.json(data.map(r => ({
      id: r.id,
      nome: r.nome,
      descricao: r.descricao,
      mitigacoes: r.mitigacoes.map(m => ({ barreiraId: m.barreiraId, eficiencia: m.eficiencia }))
    })))
  }
}
