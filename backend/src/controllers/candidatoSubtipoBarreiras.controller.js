"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidatoSubtipoBarreirasController = void 0;
const candidatoSubtipoBarreiras_service_1 = require("../services/candidatoSubtipoBarreiras.service");
exports.CandidatoSubtipoBarreirasController = {
    async listar(req, res) {
        const candidatoId = Number(req.params.id);
        const data = await candidatoSubtipoBarreiras_service_1.CandidatoSubtipoBarreirasService.listarPorCandidato(candidatoId);
        res.json(data);
    },
    async vincular(req, res) {
        const candidatoId = Number(req.params.id);
        const subtipoId = Number(req.params.subtipoId);
        const { barreiraIds } = req.body;
        const data = await candidatoSubtipoBarreiras_service_1.CandidatoSubtipoBarreirasService.vincular(candidatoId, subtipoId, barreiraIds);
        res.json(data);
    },
};
//# sourceMappingURL=candidatoSubtipoBarreiras.controller.js.map