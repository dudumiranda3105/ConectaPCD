// src/controllers/match.controller.ts
import { Request, Response } from "express";
import { encontrarVagasCompativeis, calcularMatchScore, getMatchScoresFromCache } from "../services/match.service";

export const MatchController = {
  async listarVagasCompativeis(req: Request, res: Response) {
    try {
      const candidatoId = Number(req.params.candidatoId);
      if (isNaN(candidatoId)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const vagas = await encontrarVagasCompativeis(candidatoId);
      res.json(vagas);
    } catch (err: any) {
      console.error("Erro ao buscar vagas compatíveis:", err);
      res.status(500).json({ error: err.message ?? "Erro interno no servidor" });
    }
  },

  async calcularMatches(req: Request, res: Response) {
    try {
      const candidatoId = Number(req.params.candidatoId);
      if (isNaN(candidatoId)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const matches = await calcularMatchScore(candidatoId);
      
      // Formatar resposta para incluir id e calculadoEm
      const formattedMatches = matches.map(match => ({
        id: `${candidatoId}-${match.vaga.id}`,
        candidatoId,
        vagaId: match.vaga.id,
        scoreTotal: match.scoreTotal,
        scoreSubtipos: match.scoreSubtipos,
        scoreAcessibilidades: match.scoreAcessibilidades,
        compativel: match.compativel,
        detalhes: match.detalhes,
        calculadoEm: new Date().toISOString(),
        vaga: match.vaga,
      }));
      res.json(formattedMatches);
    } catch (err: any) {
      console.error('[MATCH_CONTROLLER] Erro ao calcular matches:', err);
      res.status(500).json({ error: err.message ?? "Erro interno no servidor" });
    }
  },

  async getMatchScores(req: Request, res: Response) {
    try {
      const candidatoId = Number(req.params.candidatoId);
      if (isNaN(candidatoId)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const scores = await getMatchScoresFromCache(candidatoId);
      
      // Formatar resposta para incluir compativel
      const formattedScores = scores.map((score: any) => ({
        ...score,
        compativel: score.scoreTotal >= 50 && score.detalhes?.subtiposAceitos > 0,
        calculadoEm: score.updatedAt || score.createdAt,
      }));
      
      res.json(formattedScores);
    } catch (err: any) {
      console.error("Erro ao buscar scores:", err);
      res.status(500).json({ error: err.message ?? "Erro interno no servidor" });
    }
  },
};
