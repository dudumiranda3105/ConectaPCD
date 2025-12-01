import { Request, Response } from "express";
import { TiposService } from "../services/tipos.service";

export const TiposController = {
  async list(_req: Request, res: Response) {
    const data = await TiposService.list();
    res.json(data);
  },
  async listWithSubtipos(_req: Request, res: Response) {
    const data = await TiposService.listWithSubtipos();
    res.json(data);
  },
  async create(req: Request, res: Response) {
    const { nome, descricao, cor } = req.body ?? {};
    const created = await TiposService.create(nome, descricao, cor);
    res.status(201).json(created);
  },
  async update(req: Request, res: Response) {
    const id = parseInt(req.params.id || '0');
    const { nome, descricao, cor } = req.body ?? {};
    const updated = await TiposService.update(id, nome, descricao, cor);
    res.json(updated);
  },
  async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id || '0');
    try {
      await TiposService.delete(id);
      res.status(204).send();
    } catch (e: any) {
      res.status(e.status || 500).json({ error: e.message });
    }
  },
};