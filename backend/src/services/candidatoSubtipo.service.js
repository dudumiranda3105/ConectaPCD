"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidatoSubtipoService = void 0;
const candidatoSubtipo_repo_1 = require("../repositories/candidatoSubtipo.repo");
exports.CandidatoSubtipoService = {
    async updateDisabilities(candidatoId, disabilities, accessibilities, assistiveResources) {
        if (!candidatoId)
            throw new Error('candidatoId é obrigatório');
        if (!Array.isArray(disabilities))
            throw new Error('disabilities deve ser um array');
        return candidatoSubtipo_repo_1.CandidatoSubtipoRepo.replaceSubtiposAndAccessibilities(candidatoId, disabilities, accessibilities || [], assistiveResources || []);
    },
};
//# sourceMappingURL=candidatoSubtipo.service.js.map