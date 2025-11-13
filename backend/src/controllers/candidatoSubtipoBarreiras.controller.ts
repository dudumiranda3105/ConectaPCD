import { Request, Response } from "express";
import { CandidatoSubtipoBarreirasService } from "../services/candidatoSubtipoBarreiras.service";

export const CandidatoSubtipoBarreirasController = {
  async listar(req: Request, res: Response) {
    const candidatoId = Number(req.params.id);
    const data = await CandidatoSubtipoBarreirasService.listarPorCandidato(candidatoId);
    res.json(data);
  },

  async vincular(req: Request, res: Response) {
    const candidatoId = Number(req.params.id);
    const subtipoId = Number(req.params.subtipoId);
    const { barreiraIds } = req.body as { barreiraIds: number[] };
    const data = await CandidatoSubtipoBarreirasService.vincular(
      candidatoId,
      subtipoId,
      barreiraIds
    );
    res.json(data);
  },
};