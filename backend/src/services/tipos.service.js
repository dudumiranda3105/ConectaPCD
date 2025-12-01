"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TiposService = void 0;
const tipos_repo_1 = require("../repositories/tipos.repo");
exports.TiposService = {
    list() {
        return tipos_repo_1.TiposRepo.list();
    },
    listWithSubtipos() {
        return tipos_repo_1.TiposRepo.listWithSubtipos();
    },
    async create(nome, descricao, cor) {
        const final = (nome ?? "").trim();
        if (!final)
            throw Object.assign(new Error("O campo 'nome' é obrigatório"), { status: 400 });
        return tipos_repo_1.TiposRepo.create(final, descricao, cor);
    },
    async update(id, nome, descricao, cor) {
        const final = (nome ?? "").trim();
        if (!final)
            throw Object.assign(new Error("O campo 'nome' é obrigatório"), { status: 400 });
        return tipos_repo_1.TiposRepo.update(id, final, descricao, cor);
    },
    async delete(id) {
        const tipo = await tipos_repo_1.TiposRepo.findById(id);
        if (!tipo)
            throw Object.assign(new Error("Tipo não encontrado"), { status: 404 });
        return tipos_repo_1.TiposRepo.delete(id);
    },
};
//# sourceMappingURL=tipos.service.js.map