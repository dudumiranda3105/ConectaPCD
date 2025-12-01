"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpresasController = void 0;
const empresas_repo_1 = require("../repositories/empresas.repo");
const empresas_service_1 = require("../services/empresas.service");
exports.EmpresasController = {
    async listar(req, res) {
        const data = await empresas_repo_1.EmpresasRepo.list();
        res.json(data);
    },
    async detalhar(req, res) {
        const id = Number(req.params.id);
        const empresa = await empresas_repo_1.EmpresasRepo.findById(id);
        if (!empresa)
            return res.status(404).json({ error: "Empresa não encontrada" });
        res.json(empresa);
    },
    async criar(req, res) {
        try {
            const { nome, cnpj, email } = req.body;
            const empresa = await empresas_service_1.EmpresasService.criarEmpresa(nome, cnpj, email);
            res.status(201).json(empresa);
        }
        catch (e) {
            res.status(400).json({ error: e.message ?? "Erro ao criar empresa" });
        }
    },
    async stats(req, res) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id))
                return res.status(400).json({ error: 'ID inválido' });
            const data = await empresas_service_1.EmpresasService.getStats(id);
            res.json(data);
        }
        catch (e) {
            res.status(500).json({ error: e.message ?? 'Erro ao buscar estatísticas' });
        }
    },
    async listarCandidaturasEmProcesso(req, res) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id))
                return res.status(400).json({ error: 'ID inválido' });
            const data = await empresas_service_1.EmpresasService.listarCandidaturasEmProcesso(id);
            res.json(data);
        }
        catch (e) {
            res.status(500).json({ error: e.message ?? 'Erro ao buscar candidaturas em processo' });
        }
    },
    async listarCandidaturasAprovadas(req, res) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id))
                return res.status(400).json({ error: 'ID inválido' });
            const data = await empresas_service_1.EmpresasService.listarCandidaturasAprovadas(id);
            res.json(data);
        }
        catch (e) {
            res.status(500).json({ error: e.message ?? 'Erro ao buscar candidaturas aprovadas' });
        }
    }
};
//# sourceMappingURL=empresas.controller.js.map