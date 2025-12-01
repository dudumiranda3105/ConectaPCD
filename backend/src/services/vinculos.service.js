"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VinculosService = void 0;
const subtipos_repo_1 = require("../repositories/subtipos.repo");
const barreiras_repo_1 = require("../repositories/barreiras.repo");
const acessibilidades_repo_1 = require("../repositories/acessibilidades.repo");
const vinculos_repo_1 = require("../repositories/vinculos.repo");
exports.VinculosService = {
    async vincularBarreiras(subtipoId, barreiraIds) {
        if (!Array.isArray(barreiraIds) || barreiraIds.length === 0) {
            throw Object.assign(new Error("barreiraIds deve ser um array com pelo menos 1 id"), { status: 400 });
        }
        const subtipo = await subtipos_repo_1.SubtiposRepo.findById(subtipoId);
        if (!subtipo)
            throw Object.assign(new Error("Subtipo não encontrado"), { status: 404 });
        for (const id of barreiraIds) {
            const b = await barreiras_repo_1.BarreirasRepo.findById(id);
            if (!b)
                throw Object.assign(new Error(`Barreira ${id} não encontrada`), { status: 404 });
        }
        await vinculos_repo_1.VinculosRepo.vincularBarreirasSubtipo(subtipoId, barreiraIds);
        return { ok: true };
    },
    async vincularAcessibilidades(barreiraId, acessibilidadeIds) {
        if (!Array.isArray(acessibilidadeIds) || acessibilidadeIds.length === 0) {
            throw Object.assign(new Error("acessibilidadeIds deve ser um array com pelo menos 1 id"), { status: 400 });
        }
        const barreira = await barreiras_repo_1.BarreirasRepo.findById(barreiraId);
        if (!barreira)
            throw Object.assign(new Error("Barreira não encontrada"), { status: 404 });
        for (const id of acessibilidadeIds) {
            const a = await acessibilidades_repo_1.AcessRepo.findById(id);
            if (!a)
                throw Object.assign(new Error(`Acessibilidade ${id} não encontrada`), { status: 404 });
        }
        await vinculos_repo_1.VinculosRepo.vincularAcessBarreira(barreiraId, acessibilidadeIds);
        return { ok: true };
    },
};
//# sourceMappingURL=vinculos.service.js.map