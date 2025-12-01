"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidaturasController = void 0;
const candidaturas_service_1 = require("../services/candidaturas.service");
exports.CandidaturasController = {
    async candidatar(req, res) {
        try {
            const { candidatoId, vagaId } = req.body;
            if (!candidatoId || !vagaId) {
                return res.status(400).json({ error: 'candidatoId e vagaId são obrigatórios' });
            }
            const candidatura = await candidaturas_service_1.CandidaturasService.candidatar(Number(candidatoId), Number(vagaId));
            res.status(201).json(candidatura);
        }
        catch (e) {
            res.status(400).json({ error: e.message ?? "Erro ao candidatar-se" });
        }
    },
    async listarPorCandidato(req, res) {
        try {
            const candidatoId = Number(req.params.candidatoId);
            const candidaturas = await candidaturas_service_1.CandidaturasService.listarPorCandidato(candidatoId);
            res.json(candidaturas);
        }
        catch (e) {
            res.status(400).json({ error: e.message ?? "Erro ao listar candidaturas" });
        }
    },
    async listarPorVaga(req, res) {
        try {
            const vagaId = Number(req.params.vagaId);
            const candidaturas = await candidaturas_service_1.CandidaturasService.listarPorVaga(vagaId);
            res.json(candidaturas);
        }
        catch (e) {
            res.status(400).json({ error: e.message ?? "Erro ao listar candidatos" });
        }
    },
    async atualizarStatus(req, res) {
        try {
            const id = Number(req.params.id);
            const { status } = req.body;
            const candidatura = await candidaturas_service_1.CandidaturasService.atualizarStatus(id, status);
            res.json(candidatura);
        }
        catch (e) {
            res.status(400).json({ error: e.message ?? "Erro ao atualizar status" });
        }
    },
};
//# sourceMappingURL=candidaturas.controller.js.map