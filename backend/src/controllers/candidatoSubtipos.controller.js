"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidatoSubtiposController = void 0;
const candidatoSubtipos_service_1 = require("../services/candidatoSubtipos.service");
exports.CandidatoSubtiposController = {
    async listar(req, res) {
        const candidatoId = Number(req.params.id);
        const data = await candidatoSubtipos_service_1.CandidatoSubtiposService.listarPorCandidato(candidatoId);
        res.json(data);
    },
    async vincular(req, res) {
        const candidatoId = Number(req.params.id);
        const { subtipoIds } = req.body;
        console.log(subtipoIds);
        const data = await candidatoSubtipos_service_1.CandidatoSubtiposService.vincular(candidatoId, subtipoIds);
        res.json(data);
    },
};
//# sourceMappingURL=candidatoSubtipos.controller.js.map