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
  },

  async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id || '0')
    const data = await AssistiveResourcesService.getById(id)
    if (!data) {
      return res.status(404).json({ error: 'Recurso assistivo não encontrado' })
    }
    res.json({
      id: data.id,
      nome: data.nome,
      descricao: data.descricao,
      mitigacoes: data.mitigacoes.map(m => ({ barreiraId: m.barreiraId, eficiencia: m.eficiencia }))
    })
  },

  async create(req: Request, res: Response) {
    const { nome, descricao, mitigacoes } = req.body ?? {}
    const created = await AssistiveResourcesService.create(nome, descricao, mitigacoes)
    res.status(201).json({
      id: created.id,
      nome: created.nome,
      descricao: created.descricao,
      mitigacoes: created.mitigacoes.map(m => ({ barreiraId: m.barreiraId, eficiencia: m.eficiencia }))
    })
  },

  async update(req: Request, res: Response) {
    const id = parseInt(req.params.id || '0')
    const { nome, descricao, mitigacoes } = req.body ?? {}
    const updated = await AssistiveResourcesService.update(id, nome, descricao, mitigacoes)
    res.json({
      id: updated.id,
      nome: updated.nome,
      descricao: updated.descricao,
      mitigacoes: updated.mitigacoes.map(m => ({ barreiraId: m.barreiraId, eficiencia: m.eficiencia }))
    })
  },

  async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id || '0')
    await AssistiveResourcesService.delete(id)
    res.status(204).send()
  }
}
