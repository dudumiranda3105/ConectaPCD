import { Request, Response } from "express";
import { SubtiposService } from "../services/subtipos.service";

export const SubtiposController = {
  async list(_req: Request, res: Response) {
      const data = await SubtiposService.list();
      res.json(data);
    },
  async getOne(req: Request, res: Response) {
    const id = Number(req.params.id);
    const data = await SubtiposService.findDeep(id);
    res.json(data);
  },
  async create(req: Request, res: Response) {
    const { nome, tipoId } = req.body ?? {};
    const created = await SubtiposService.create(nome, Number(tipoId));
    res.status(201).json(created);
  },
  async connectBarreira(req: Request, res: Response) {
    const subtipoId = Number(req.params.subtipoId);
    const { barreiraId } = req.body;
    try {
      const updated = await SubtiposService.connectBarreira(subtipoId, Number(barreiraId));
      res.status(201).json(updated);
    } catch (e: any) {
      res.status(e.status || 400).json({ error: e.message });
    }
  },
  async disconnectBarreira(req: Request, res: Response) {
    const subtipoId = Number(req.params.subtipoId);
    const barreiraId = Number(req.params.barreiraId);
    const updated = await SubtiposService.disconnectBarreira(subtipoId, barreiraId);
    res.json(updated);
  },
  async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    try {
      await SubtiposService.delete(id);
      res.status(204).send();
    } catch (e: any) {
      res.status(e.status || 500).json({ error: e.message });
    }
  },
};
