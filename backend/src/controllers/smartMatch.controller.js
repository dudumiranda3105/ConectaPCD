"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartMatchController = void 0;
const smartMatch_service_1 = require("../services/smartMatch.service");
const prisma_1 = require("../repositories/prisma");
exports.SmartMatchController = {
    /**
     * GET /smart-match/candidato/:candidatoId/vagas
     * Busca vagas com smart match para um candidato
     */
    async buscarVagasSmartMatch(req, res) {
        try {
            const candidatoId = Number(req.params.candidatoId);
            const limite = Number(req.query.limite) || 20;
            if (isNaN(candidatoId)) {
                return res.status(400).json({ error: 'candidatoId inválido' });
            }
            const matches = await smartMatch_service_1.SmartMatchService.buscarVagasComSmartMatch(candidatoId, limite);
            res.json({
                success: true,
                total: matches.length,
                matches
            });
        }
        catch (error) {
            console.error('Erro ao buscar smart matches:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Erro interno do servidor'
            });
        }
    },
    /**
     * GET /smart-match/candidato/:candidatoId/vaga/:vagaId
     * Calcula smart match específico entre candidato e vaga
     */
    async calcularSmartMatch(req, res) {
        try {
            const candidatoId = Number(req.params.candidatoId);
            const vagaId = Number(req.params.vagaId);
            if (isNaN(candidatoId) || isNaN(vagaId)) {
                return res.status(400).json({ error: 'IDs inválidos' });
            }
            const match = await smartMatch_service_1.SmartMatchService.calcularSmartMatch(candidatoId, vagaId);
            res.json({
                success: true,
                match
            });
        }
        catch (error) {
            console.error('Erro ao calcular smart match:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Erro interno do servidor'
            });
        }
    },
    /**
     * GET /smart-match/vaga/:vagaId/top-candidatos
     * Busca os melhores candidatos para uma vaga
     */
    async buscarTopCandidatos(req, res) {
        try {
            const vagaId = Number(req.params.vagaId);
            const limite = Number(req.query.limite) || 10;
            if (isNaN(vagaId)) {
                return res.status(400).json({ error: 'vagaId inválido' });
            }
            // Buscar todos os candidatos ativos
            const candidatos = await prisma_1.prisma.candidato.findMany({
                where: { isActive: true },
                select: { id: true }
            });
            const results = [];
            for (const candidato of candidatos) {
                try {
                    const match = await smartMatch_service_1.SmartMatchService.calcularSmartMatch(candidato.id, vagaId);
                    results.push(match);
                }
                catch (error) {
                    // Ignorar erros individuais
                }
            }
            // Ordenar por score
            const topCandidatos = results
                .sort((a, b) => b.scoreTotal - a.scoreTotal)
                .slice(0, limite);
            res.json({
                success: true,
                total: topCandidatos.length,
                candidatos: topCandidatos
            });
        }
        catch (error) {
            console.error('Erro ao buscar top candidatos:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Erro interno do servidor'
            });
        }
    }
};
//# sourceMappingURL=smartMatch.controller.js.map