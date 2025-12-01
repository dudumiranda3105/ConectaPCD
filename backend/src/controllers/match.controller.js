"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchController = void 0;
const match_service_1 = require("../services/match.service");
exports.MatchController = {
    async listarVagasCompativeis(req, res) {
        try {
            const candidatoId = Number(req.params.candidatoId);
            if (isNaN(candidatoId)) {
                return res.status(400).json({ error: "ID inválido" });
            }
            const vagas = await (0, match_service_1.encontrarVagasCompativeis)(candidatoId);
            res.json(vagas);
        }
        catch (err) {
            console.error("Erro ao buscar vagas compatíveis:", err);
            res.status(500).json({ error: err.message ?? "Erro interno no servidor" });
        }
    },
    async calcularMatches(req, res) {
        try {
            const candidatoId = Number(req.params.candidatoId);
            if (isNaN(candidatoId)) {
                return res.status(400).json({ error: "ID inválido" });
            }
            const matches = await (0, match_service_1.calcularMatchScore)(candidatoId);
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
        }
        catch (err) {
            console.error('[MATCH_CONTROLLER] Erro ao calcular matches:', err);
            res.status(500).json({ error: err.message ?? "Erro interno no servidor" });
        }
    },
    async getMatchScores(req, res) {
        try {
            const candidatoId = Number(req.params.candidatoId);
            if (isNaN(candidatoId)) {
                return res.status(400).json({ error: "ID inválido" });
            }
            const scores = await (0, match_service_1.getMatchScoresFromCache)(candidatoId);
            // Formatar resposta para incluir compativel
            const formattedScores = scores.map((score) => ({
                ...score,
                compativel: score.scoreTotal >= 50 && score.detalhes?.subtiposAceitos > 0,
                calculadoEm: score.updatedAt || score.createdAt,
            }));
            res.json(formattedScores);
        }
        catch (err) {
            console.error("Erro ao buscar scores:", err);
            res.status(500).json({ error: err.message ?? "Erro interno no servidor" });
        }
    },
};
//# sourceMappingURL=match.controller.js.map