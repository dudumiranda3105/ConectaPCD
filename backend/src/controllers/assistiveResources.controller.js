"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssistiveResourcesController = void 0;
const assistiveResources_service_1 = require("../services/assistiveResources.service");
exports.AssistiveResourcesController = {
    async list(_req, res) {
        const data = await assistiveResources_service_1.AssistiveResourcesService.list();
        res.json(data.map(r => ({
            id: r.id,
            nome: r.nome,
            descricao: r.descricao,
            mitigacoes: r.mitigacoes.map(m => ({ barreiraId: m.barreiraId, eficiencia: m.eficiencia }))
        })));
    },
    async getById(req, res) {
        const id = parseInt(req.params.id || '0');
        const data = await assistiveResources_service_1.AssistiveResourcesService.getById(id);
        if (!data) {
            return res.status(404).json({ error: 'Recurso assistivo não encontrado' });
        }
        res.json({
            id: data.id,
            nome: data.nome,
            descricao: data.descricao,
            mitigacoes: data.mitigacoes.map(m => ({ barreiraId: m.barreiraId, eficiencia: m.eficiencia }))
        });
    },
    async create(req, res) {
        const { nome, descricao, mitigacoes } = req.body ?? {};
        const created = await assistiveResources_service_1.AssistiveResourcesService.create(nome, descricao, mitigacoes);
        res.status(201).json({
            id: created.id,
            nome: created.nome,
            descricao: created.descricao,
            mitigacoes: created.mitigacoes.map(m => ({ barreiraId: m.barreiraId, eficiencia: m.eficiencia }))
        });
    },
    async update(req, res) {
        const id = parseInt(req.params.id || '0');
        const { nome, descricao, mitigacoes } = req.body ?? {};
        const updated = await assistiveResources_service_1.AssistiveResourcesService.update(id, nome, descricao, mitigacoes);
        res.json({
            id: updated.id,
            nome: updated.nome,
            descricao: updated.descricao,
            mitigacoes: updated.mitigacoes.map(m => ({ barreiraId: m.barreiraId, eficiencia: m.eficiencia }))
        });
    },
    async delete(req, res) {
        const id = parseInt(req.params.id || '0');
        await assistiveResources_service_1.AssistiveResourcesService.delete(id);
        res.status(204).send();
    }
};
//# sourceMappingURL=assistiveResources.controller.js.map