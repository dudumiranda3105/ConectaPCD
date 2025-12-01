"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchingController = void 0;
const matching_service_1 = require("../services/matching.service");
exports.MatchingController = {
    /**
     * GET /matching/candidato/:candidatoId/vagas
     * Busca as melhores vagas para um candidato
     */
    async buscarVagasParaCandidato(req, res) {
        try {
            const candidatoId = Number(req.params.candidatoId);
            const limite = Number(req.query.limite) || 10;
            if (isNaN(candidatoId)) {
                return res.status(400).json({ error: 'candidatoId inválido' });
            }
            const matches = await matching_service_1.MatchingService.buscarMelhoresVagas(candidatoId, limite);
            res.json(matches);
        }
        catch (error) {
            console.error('Erro ao buscar vagas para candidato:', error);
            res.status(500).json({ error: error.message || 'Erro interno do servidor' });
        }
    },
    /**
     * GET /matching/vaga/:vagaId/candidatos
     * Busca os melhores candidatos para uma vaga
     */
    async buscarCandidatosParaVaga(req, res) {
        try {
            const vagaId = Number(req.params.vagaId);
            const limite = Number(req.query.limite) || 10;
            if (isNaN(vagaId)) {
                return res.status(400).json({ error: 'vagaId inválido' });
            }
            const matches = await matching_service_1.MatchingService.buscarMelhoresCandidatos(vagaId, limite);
            res.json(matches);
        }
        catch (error) {
            console.error('Erro ao buscar candidatos para vaga:', error);
            res.status(500).json({ error: error.message || 'Erro interno do servidor' });
        }
    },
    /**
     * GET /matching/candidato/:candidatoId/vaga/:vagaId
     * Calcula compatibilidade específica entre candidato e vaga
     */
    async calcularCompatibilidade(req, res) {
        try {
            const candidatoId = Number(req.params.candidatoId);
            const vagaId = Number(req.params.vagaId);
            if (isNaN(candidatoId) || isNaN(vagaId)) {
                return res.status(400).json({ error: 'IDs inválidos' });
            }
            const match = await matching_service_1.MatchingService.calcularMatch(candidatoId, vagaId);
            await matching_service_1.MatchingService.salvarMatch(match);
            res.json(match);
        }
        catch (error) {
            console.error('Erro ao calcular compatibilidade:', error);
            res.status(500).json({ error: error.message || 'Erro interno do servidor' });
        }
    }
};
//# sourceMappingURL=matching.controller.js.map