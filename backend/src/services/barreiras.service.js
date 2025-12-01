"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarreirasService = void 0;
const barreiras_repo_1 = require("../repositories/barreiras.repo");
exports.BarreirasService = {
    list() {
        return barreiras_repo_1.BarreirasRepo.list();
    },
    async create(descricao) {
        const final = (descricao ?? "").trim();
        if (!final)
            throw Object.assign(new Error("O campo 'descricao' é obrigatório"), { status: 400 });
        return barreiras_repo_1.BarreirasRepo.create(final);
    },
    listAcessibilidades(barreiraId) {
        return barreiras_repo_1.BarreirasRepo.listAcessibilidades(barreiraId);
    },
    connect(barreiraId, acessibilidadeId) {
        return barreiras_repo_1.BarreirasRepo.addAcessibilidade(barreiraId, acessibilidadeId);
    },
    disconnect(barreiraId, acessibilidadeId) {
        return barreiras_repo_1.BarreirasRepo.removeAcessibilidade(barreiraId, acessibilidadeId);
    },
};
//# sourceMappingURL=barreiras.service.js.map