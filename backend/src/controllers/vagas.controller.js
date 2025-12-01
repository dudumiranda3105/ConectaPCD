"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VagasController = void 0;
const vagas_repo_1 = require("../repositories/vagas.repo");
const vagas_service_1 = require("../services/vagas.service");
const prisma_1 = require("../repositories/prisma");
exports.VagasController = {
    // Debug: listar todas as candidaturas
    async listarTodasCandidaturas(req, res) {
        try {
            const todasCandidaturas = await prisma_1.prisma.candidatura.findMany({
                include: {
                    candidato: { select: { nome: true } },
                    vaga: { select: { titulo: true } }
                }
            });
            console.log(`[Debug] Total de candidaturas no banco: ${todasCandidaturas.length}`);
            res.json(todasCandidaturas);
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    async listar(req, res) {
        const empresaIdParam = req.params.empresaId ?? req.params.id;
        const empresaId = empresaIdParam ? Number(empresaIdParam) : undefined;
        const data = await vagas_repo_1.VagasRepo.list(empresaId);
        // Log para debug das acessibilidades
        if (data.length > 0) {
            console.log(`[VagasController] Retornando ${data.length} vaga(s)`);
            data.forEach(vaga => {
                console.log(`[VagasController] Vaga ID ${vaga.id}: ${vaga.acessibilidades?.length || 0} acessibilidades`);
                if (vaga.acessibilidades && vaga.acessibilidades.length > 0) {
                    vaga.acessibilidades.forEach(acc => {
                        console.log(`  - ${acc.acessibilidade.descricao}`);
                    });
                }
            });
        }
        res.json(data);
    },
    async detalhar(req, res) {
        const id = Number(req.params.id);
        const vaga = await vagas_repo_1.VagasRepo.findById(id);
        if (!vaga)
            return res.status(404).json({ error: "Vaga não encontrada" });
        // “achatar” as N:N para resposta mais amigável
        const subtipos = vaga.subtiposAceitos.map((vs) => vs.subtipo);
        const acessibilidades = vaga.acessibilidades.map((va) => va.acessibilidade);
        res.json({
            id: vaga.id,
            titulo: vaga.titulo,
            descricao: vaga.descricao,
            escolaridade: vaga.escolaridade,
            empresa: vaga.empresa,
            subtipos,
            acessibilidades,
        });
    },
    async criar(req, res) {
        try {
            const { empresaId, titulo, descricao, escolaridade, tipo, regimeTrabalho, beneficios, acessibilidades, subtiposAceitos } = req.body;
            console.log('[VagasController] ========== CRIANDO VAGA ==========');
            console.log('[VagasController] Body completo recebido:', JSON.stringify(req.body, null, 2));
            console.log('[VagasController] Acessibilidades:', {
                valor: acessibilidades,
                tipo: typeof acessibilidades,
                isArray: Array.isArray(acessibilidades),
                length: Array.isArray(acessibilidades) ? acessibilidades.length : 'N/A',
                conteudo: Array.isArray(acessibilidades) ? acessibilidades : 'não é array'
            });
            console.log('[VagasController] SubtiposAceitos:', {
                valor: subtiposAceitos,
                tipo: typeof subtiposAceitos,
                isArray: Array.isArray(subtiposAceitos),
                length: Array.isArray(subtiposAceitos) ? subtiposAceitos.length : 'N/A',
                conteudo: Array.isArray(subtiposAceitos) ? subtiposAceitos : 'não é array'
            });
            console.log('[VagasController] =======================================');
            const vaga = await vagas_service_1.VagasService.criarVaga(Number(empresaId), titulo, descricao, escolaridade, tipo, regimeTrabalho, beneficios, acessibilidades, subtiposAceitos);
            res.status(201).json(vaga);
        }
        catch (e) {
            console.error('[VagasController] Erro ao criar vaga:', e);
            res.status(400).json({ error: e.message ?? "Erro ao criar vaga" });
        }
    },
    async vincularSubtipos(req, res) {
        try {
            const vagaId = Number(req.params.id);
            const { subtipoIds } = req.body;
            await vagas_service_1.VagasService.vincularSubtipos(vagaId, subtipoIds);
            res.json({ ok: true });
        }
        catch (e) {
            res.status(400).json({ error: e.message ?? "Erro ao vincular subtipos" });
        }
    },
    async vincularAcessibilidades(req, res) {
        try {
            const vagaId = Number(req.params.id);
            const { acessibilidadeIds } = req.body;
            await vagas_service_1.VagasService.vincularAcessibilidades(vagaId, acessibilidadeIds);
            res.json({ ok: true });
        }
        catch (e) {
            res.status(400).json({ error: e.message ?? "Erro ao vincular acessibilidades" });
        }
    },
    async getAcessibilidadesPossiveis(req, res) {
        try {
            const vagaId = Number(req.params.id);
            if (isNaN(vagaId)) {
                return res.status(400).json({ error: "ID inválido" });
            }
            const acess = await vagas_service_1.VagasService.listarAcessibilidadesPossiveis(vagaId);
            res.json(acess);
        }
        catch (err) {
            res.status(500).json({ error: err.message || "Erro ao listar acessibilidades" });
        }
    },
    async listarCandidaturas(req, res) {
        try {
            const vagaId = Number(req.params.id);
            console.log(`[VagasController] Buscando candidaturas para vaga ID: ${vagaId}`);
            if (isNaN(vagaId)) {
                return res.status(400).json({ error: "ID da vaga inválido" });
            }
            const candidaturas = await vagas_service_1.VagasService.listarCandidaturasPorVaga(vagaId);
            console.log(`[VagasController] Retornando ${candidaturas.length} candidaturas`);
            res.json(candidaturas);
        }
        catch (err) {
            console.error(`[VagasController] Erro ao listar candidaturas:`, err.message);
            res.status(500).json({ error: err.message || "Erro ao listar candidaturas" });
        }
    },
    async atualizar(req, res) {
        try {
            const vagaId = Number(req.params.id);
            const { titulo, descricao, escolaridade, tipo, regimeTrabalho, beneficios, acessibilidades, subtiposAceitos, isActive } = req.body;
            console.log('[VagasController] ========== ATUALIZANDO VAGA ==========');
            console.log('[VagasController] VagaId:', vagaId);
            console.log('[VagasController] Body completo recebido:', JSON.stringify(req.body, null, 2));
            console.log('[VagasController] Acessibilidades:', {
                valor: acessibilidades,
                tipo: typeof acessibilidades,
                isArray: Array.isArray(acessibilidades),
                length: Array.isArray(acessibilidades) ? acessibilidades.length : 'N/A',
                conteudo: Array.isArray(acessibilidades) ? acessibilidades : 'não é array'
            });
            console.log('[VagasController] SubtiposAceitos:', {
                valor: subtiposAceitos,
                tipo: typeof subtiposAceitos,
                isArray: Array.isArray(subtiposAceitos),
                length: Array.isArray(subtiposAceitos) ? subtiposAceitos.length : 'N/A',
                conteudo: Array.isArray(subtiposAceitos) ? subtiposAceitos : 'não é array'
            });
            console.log('[VagasController] =======================================');
            if (isNaN(vagaId)) {
                return res.status(400).json({ error: "ID da vaga inválido" });
            }
            const vaga = await vagas_service_1.VagasService.atualizarVaga(vagaId, { titulo, descricao, escolaridade, tipo, regimeTrabalho, beneficios, acessibilidades, subtiposAceitos, isActive });
            res.json(vaga);
        }
        catch (err) {
            console.error('[VagasController] Erro ao atualizar vaga:', err);
            res.status(400).json({ error: err.message || "Erro ao atualizar vaga" });
        }
    },
    async registrarVisualizacao(req, res) {
        try {
            const vagaId = Number(req.params.id);
            if (isNaN(vagaId))
                return res.status(400).json({ error: "ID da vaga inválido" });
            const result = await vagas_service_1.VagasService.registrarVisualizacao(vagaId);
            res.json(result);
        }
        catch (err) {
            res.status(400).json({ error: err.message || "Erro ao registrar visualização" });
        }
    },
};
//# sourceMappingURL=vagas.controller.js.map