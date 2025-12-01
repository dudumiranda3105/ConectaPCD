import { Request, Response } from "express";
import { AcessService } from "../services/acessibilidades.service";

export const AcessibilidadesController = {
  async list(_req: Request, res: Response) {
    const data = await AcessService.list();
    res.json(data);
  },
  async create(req: Request, res: Response) {
    const { nome, descricao } = req.body ?? {};
    const created = await AcessService.create(nome, descricao);
    res.status(201).json(created);
  },
  async seedMissing(_req: Request, res: Response) {
    try {
      const acessibilidades = [
        { nome: 'Rampas de acesso', descricao: 'Rampas de acesso para cadeirantes e pessoas com mobilidade reduzida' },
        { nome: 'Sanitários adaptados', descricao: 'Banheiros com barras de apoio e espaço para cadeiras de rodas' },
        { nome: 'Piso tátil', descricao: 'Piso com textura diferenciada para orientação de pessoas com deficiência visual' },
        { nome: 'Mobiliário adaptado', descricao: 'Mesas, cadeiras e bancadas com altura adequada' },
        { nome: 'Vagas reservadas', descricao: 'Vagas de estacionamento reservadas para PcD' },
        { nome: 'Portas largas', descricao: 'Portas com largura mínima de 80cm para passagem de cadeiras de rodas' },
        { nome: 'Corrimãos', descricao: 'Corrimãos em escadas e rampas' },
        { nome: 'Iluminação adequada', descricao: 'Iluminação adequada em todos os ambientes' },
        { nome: 'Sinalização acessível', descricao: 'Sinalização visual e tátil' },
        { nome: 'Audiodescrição', descricao: 'Recursos de audiodescrição para conteúdos visuais' },
        { nome: 'Legendas', descricao: 'Legendas em vídeos e conteúdos audiovisuais' }
      ];

      const results = [];
      for (const { nome, descricao } of acessibilidades) {
        const existing = await AcessService.findByDescricao(descricao);
        if (!existing) {
          const created = await AcessService.create(nome, descricao);
          results.push({ status: 'created', nome, id: created.id });
        } else {
          results.push({ status: 'exists', nome, id: existing.id });
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
