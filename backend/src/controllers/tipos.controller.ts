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
    const { nome, descricao } = req.body ?? {};
    const created = await TiposService.create(nome, descricao);
    res.status(201).json(created);
  },
  async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { nome, descricao } = req.body ?? {};
    const updated = await TiposService.update(id, nome, descricao);
    res.json(updated);
  },
};