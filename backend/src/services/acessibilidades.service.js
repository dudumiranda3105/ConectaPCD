"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcessService = void 0;
const acessibilidades_repo_1 = require("../repositories/acessibilidades.repo");
exports.AcessService = {
    list() {
        return acessibilidades_repo_1.AcessRepo.list();
    },
    async create(nome, descricao) {
        const finalDescricao = (descricao ?? "").trim();
        if (!finalDescricao)
            throw Object.assign(new Error("O campo 'descricao' é obrigatório"), { status: 400 });
        const finalNome = nome?.trim() || undefined;
        return acessibilidades_repo_1.AcessRepo.create(finalNome, finalDescricao);
    },
    async findByDescricao(descricao) {
        return acessibilidades_repo_1.AcessRepo.findByDescricao(descricao);
    },
    listBarreiras(acessibilidadeId) {
        return acessibilidades_repo_1.AcessRepo.listBarreiras(acessibilidadeId);
    },
    connect(acessibilidadeId, barreiraId) {
        return acessibilidades_repo_1.AcessRepo.addBarreira(acessibilidadeId, barreiraId);
    },
    disconnect(acessibilidadeId, barreiraId) {
        return acessibilidades_repo_1.AcessRepo.removeBarreira(acessibilidadeId, barreiraId);
    },
    async delete(id) {
        const existing = await acessibilidades_repo_1.AcessRepo.findById(id);
        if (!existing)
            throw Object.assign(new Error('Acessibilidade não encontrada'), { status: 404 });
        return acessibilidades_repo_1.AcessRepo.delete(id);
    },
};
//# sourceMappingURL=acessibilidades.service.js.map