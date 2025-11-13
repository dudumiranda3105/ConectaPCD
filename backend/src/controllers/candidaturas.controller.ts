import { Request, Response } from "express";
import { CandidaturasService } from "../services/candidaturas.service";

export const CandidaturasController = {
  async candidatar(req: Request, res: Response) {
    try {
      const { candidatoId, vagaId } = req.body;
      
      if (!candidatoId || !vagaId) {
        return res.status(400).json({ error: 'candidatoId e vagaId são obrigatórios' })
      }
      
      const candidatura = await CandidaturasService.candidatar(Number(candidatoId), Number(vagaId));
      res.status(201).json(candidatura);
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao candidatar-se" });
    }
  },

  async listarPorCandidato(req: Request, res: Response) {
    try {
      const candidatoId = Number(req.params.candidatoId);
      const candidaturas = await CandidaturasService.listarPorCandidato(candidatoId);
      res.json(candidaturas);
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao listar candidaturas" });
    }
  },

  async listarPorVaga(req: Request, res: Response) {
    try {
      const vagaId = Number(req.params.vagaId);
      const candidaturas = await CandidaturasService.listarPorVaga(vagaId);
      res.json(candidaturas);
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao listar candidatos" });
    }
  },

  async atualizarStatus(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { status } = req.body;
      const candidatura = await CandidaturasService.atualizarStatus(id, status);
      res.json(candidatura);
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao atualizar status" });
    }
  },
};
