"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidatosService = void 0;
const candidatos_repo_1 = require("../repositories/candidatos.repo");
exports.CandidatosService = {
    async listar() {
        return candidatos_repo_1.CandidatosRepo.findAll();
    },
    async buscarPorId(id) {
        const candidato = await candidatos_repo_1.CandidatosRepo.findById(id);
        if (!candidato)
            throw new Error("Candidato não encontrado");
        return candidato;
    },
    async criar(data) {
        if (!data.nome?.trim())
            throw new Error("O campo 'nome' é obrigatório");
        return candidatos_repo_1.CandidatosRepo.create({
            nome: data.nome.trim(),
            email: data.email?.trim(),
            telefone: data.telefone?.trim(),
            escolaridade: data.escolaridade.trim()
        });
    },
};
//# sourceMappingURL=candidatos.service.js.map