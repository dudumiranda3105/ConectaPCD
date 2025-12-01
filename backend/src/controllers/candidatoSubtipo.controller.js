"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidatoSubtipoController = void 0;
const candidatoSubtipo_service_1 = require("../services/candidatoSubtipo.service");
exports.CandidatoSubtipoController = {
    async updateDisabilities(req, res) {
        try {
            const candidatoId = Number(req.params.candidatoId);
            const { disabilities, accessibilities, assistiveResources } = req.body;
            if (isNaN(candidatoId)) {
                return res.status(400).json({ error: 'candidatoId inválido' });
            }
            const result = await candidatoSubtipo_service_1.CandidatoSubtipoService.updateDisabilities(candidatoId, disabilities, accessibilities, assistiveResources);
            res.json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
};
//# sourceMappingURL=candidatoSubtipo.controller.js.map