"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidatoSubtiposService = void 0;
const candidatoSubtipos_repo_1 = require("../repositories/candidatoSubtipos.repo");
const candidatos_repo_1 = require("../repositories/candidatos.repo");
exports.CandidatoSubtiposService = {
    async listarPorCandidato(candidatoId) {
        return candidatoSubtipos_repo_1.CandidatoSubtiposRepo.findByCandidato(candidatoId);
    },
    async vincular(candidatoId, subtipoIds) {
        const candidato = await candidatos_repo_1.CandidatosRepo.findById(candidatoId);
        console.log(candidato);
        if (!candidato)
            throw new Error("Candidato não encontrado");
        console.log(subtipoIds);
        if (!subtipoIds.length)
            throw new Error("É necessário informar pelo menos um subtipo");
        await candidatoSubtipos_repo_1.CandidatoSubtiposRepo.create(candidatoId, subtipoIds);
        return { ok: true };
    },
};
//# sourceMappingURL=candidatoSubtipos.service.js.map