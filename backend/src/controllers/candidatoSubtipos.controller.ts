import { Request, Response } from "express";
import { CandidatoSubtiposService } from "../services/candidatoSubtipos.service";

export const CandidatoSubtiposController = {
  async listar(req: Request, res: Response) {
    const candidatoId = Number(req.params.id);
    const data = await CandidatoSubtiposService.listarPorCandidato(candidatoId);
    res.json(data);
  },

  async vincular(req: Request, res: Response) {
    const candidatoId = Number(req.params.id);
    const { subtipoIds } = req.body as { subtipoIds: number[] };
    console.log(subtipoIds)
    const data = await CandidatoSubtiposService.vincular(candidatoId, subtipoIds);
    res.json(data);
  },
};