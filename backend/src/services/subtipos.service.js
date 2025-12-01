"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubtiposService = void 0;
const subtipos_repo_1 = require("../repositories/subtipos.repo");
const tipos_repo_1 = require("../repositories/tipos.repo");
exports.SubtiposService = {
    list() {
        return subtipos_repo_1.SubtiposRepo.list();
    },
    async findDeep(id) {
        const subtipo = await subtipos_repo_1.SubtiposRepo.findDeepById(id);
        if (!subtipo)
            throw Object.assign(new Error("Subtipo não encontrado"), { status: 404 });
        // “achata” a resposta como no server.ts
        const barreiras = subtipo.barreiras.map((sb) => ({
            id: sb.barreira.id,
            descricao: sb.barreira.descricao,
            acessibilidades: sb.barreira.acessibilidades.map((ba) => ({
                id: ba.acessibilidade.id,
                descricao: ba.acessibilidade.descricao,
            })),
        }));
        return {
            id: subtipo.id,
            nome: subtipo.nome,
            tipo: { id: subtipo.tipo.id, nome: subtipo.tipo.nome },
            barreiras,
        };
    },
    async create(nome, tipoId) {
        const final = (nome ?? "").trim();
        if (!final)
            throw Object.assign(new Error("Campos 'nome' e 'tipoId' são obrigatórios"), { status: 400 });
        if (!Number.isInteger(tipoId))
            throw Object.assign(new Error("tipoId inválido"), { status: 400 });
        const tipo = await tipos_repo_1.TiposRepo.findById(tipoId);
        if (!tipo)
            throw Object.assign(new Error("Tipo não encontrado"), { status: 404 });
        return subtipos_repo_1.SubtiposRepo.create(final, tipoId);
    },
    connectBarreira(subtipoId, barreiraId) {
        return subtipos_repo_1.SubtiposRepo.addBarreira(subtipoId, barreiraId);
    },
    disconnectBarreira(subtipoId, barreiraId) {
        return subtipos_repo_1.SubtiposRepo.removeBarreira(subtipoId, barreiraId);
    },
    async delete(id) {
        const subtipo = await subtipos_repo_1.SubtiposRepo.findById(id);
        if (!subtipo)
            throw Object.assign(new Error("Subtipo não encontrado"), { status: 404 });
        return subtipos_repo_1.SubtiposRepo.delete(id);
    },
};
//# sourceMappingURL=subtipos.service.js.map