"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidatoSubtipoBarreirasService = void 0;
const candidatoSubtipoBarreiras_repo_1 = require("../repositories/candidatoSubtipoBarreiras.repo");
const candidatoSubtipos_repo_1 = require("../repositories/candidatoSubtipos.repo");
exports.CandidatoSubtipoBarreirasService = {
    async listarPorCandidato(candidatoId) {
        return candidatoSubtipoBarreiras_repo_1.CandidatoSubtipoBarreirasRepo.findByCandidato(candidatoId);
    },
    async vincular(candidatoId, subtipoId, barreiraIds) {
        const vinculo = await candidatoSubtipos_repo_1.CandidatoSubtiposRepo.findByCandidato(candidatoId);
        const subtipoValido = vinculo.some((v) => v.subtipoId === subtipoId);
        if (!subtipoValido)
            throw new Error("Este subtipo não está associado ao candidato");
        if (!barreiraIds.length)
            throw new Error("É necessário informar pelo menos uma barreira");
        await candidatoSubtipoBarreiras_repo_1.CandidatoSubtipoBarreirasRepo.create(candidatoId, subtipoId, barreiraIds);
        return { ok: true };
    },
};
//# sourceMappingURL=candidatoSubtipoBarreiras.service.js.map