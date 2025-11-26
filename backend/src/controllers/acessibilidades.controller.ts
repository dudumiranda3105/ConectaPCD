import { Request, Response } from "express";
import { AcessService } from "../services/acessibilidades.service";

export const AcessibilidadesController = {
  async list(_req: Request, res: Response) {
    const data = await AcessService.list();
    res.json(data);
  },
  async create(req: Request, res: Response) {
    const { descricao } = req.body ?? {};
    const created = await AcessService.create(descricao);
    res.status(201).json(created);
  },
  async seedMissing(_req: Request, res: Response) {
    try {
      const acessibilidades = [
        'Rampas de acesso',
        'Sanitários adaptados',
        'Piso tátil',
        'Mobiliário adaptado',
        'Vagas de estacionamento reservadas',
        'Portas largas',
        'Corrimãos',
        'Iluminação adequada',
        'Sinalização visual e tátil',
        'Audiodescrição',
        'Legendas em vídeos'
      ];

      const results = [];
      for (const descricao of acessibilidades) {
        const existing = await AcessService.findByDescricao(descricao);
        if (!existing) {
          const created = await AcessService.create(descricao);
          results.push({ status: 'created', descricao, id: created.id });
        } else {
          results.push({ status: 'exists', descricao, id: existing.id });
        }
      }

      res.json({ 
        message: 'Acessibilidades processadas com sucesso',
        results 
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
  async listBarreiras(req: Request, res: Response) {
    const acessibilidadeId = Number(req.params.acessibilidadeId);
    const data = await AcessService.listBarreiras(acessibilidadeId);
    if (!data) return res.status(404).json({ error: 'Acessibilidade não encontrada' });
    res.json(data.barreiras.map(b => ({
      acessibilidadeId: b.acessibilidadeId,
      barreiraId: b.barreiraId,
      barreira: b.barreira,
    })));
  },
  async connect(req: Request, res: Response) {
    const acessibilidadeId = Number(req.params.acessibilidadeId);
    const { barreiraId } = req.body;
    try {
      const updated = await AcessService.connect(acessibilidadeId, Number(barreiraId));
      res.status(201).json({
        acessibilidadeId,
        barreiras: updated?.barreiras.map(b => ({ barreiraId: b.barreiraId, descricao: b.barreira.descricao })) || [],
      });
    } catch (e: any) {
      res.status(e.status || 400).json({ error: e.message });
    }
  },
  async disconnect(req: Request, res: Response) {
    const acessibilidadeId = Number(req.params.acessibilidadeId);
    const barreiraId = Number(req.params.barreiraId);
    const updated = await AcessService.disconnect(acessibilidadeId, barreiraId);
    res.json({
      acessibilidadeId,
      barreiras: updated?.barreiras.map(b => ({ barreiraId: b.barreiraId, descricao: b.barreira.descricao })) || [],
    });
  },
  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await AcessService.delete(id);
      res.json({ message: 'Acessibilidade removida com sucesso' });
    } catch (e: any) {
      res.status(e.status || 400).json({ error: e.message });
    }
  },
};
