import { Request, Response } from "express";
import { BarreirasService } from "../services/barreiras.service";

export const BarreirasController = {
  async list(_req: Request, res: Response) {
    const data = await BarreirasService.list();
    res.json(data);
  },
  async create(req: Request, res: Response) {
    const { descricao } = req.body ?? {};
    const created = await BarreirasService.create(descricao);
    res.status(201).json(created);
  },
  async listAcessibilidades(req: Request, res: Response) {
    const barreiraId = Number(req.params.barreiraId);
    const data = await BarreirasService.listAcessibilidades(barreiraId);
    if (!data) return res.status(404).json({ error: 'Barreira não encontrada' });
    res.json(data.acessibilidades.map(a => ({
      barreiraId: a.barreiraId,
      acessibilidadeId: a.acessibilidadeId,
      acessibilidade: a.acessibilidade,
    })));
  },
  async connect(req: Request, res: Response) {
    const barreiraId = Number(req.params.barreiraId);
    const { acessibilidadeId } = req.body;
    try {
      const updated = await BarreirasService.connect(barreiraId, Number(acessibilidadeId));
      res.status(201).json({
        barreiraId,
        acessibilidades: updated?.acessibilidades.map(a => ({ acessibilidadeId: a.acessibilidadeId, descricao: a.acessibilidade.descricao })) || [],
      });
    } catch (e: any) {
      res.status(e.status || 400).json({ error: e.message });
    }
  },
  async disconnect(req: Request, res: Response) {
    const barreiraId = Number(req.params.barreiraId);
    const acessibilidadeId = Number(req.params.acessibilidadeId);
    const updated = await BarreirasService.disconnect(barreiraId, acessibilidadeId);
    res.json({
      barreiraId,
      acessibilidades: updated?.acessibilidades.map(a => ({ acessibilidadeId: a.acessibilidadeId, descricao: a.acessibilidade.descricao })) || [],
    });
  },
};
