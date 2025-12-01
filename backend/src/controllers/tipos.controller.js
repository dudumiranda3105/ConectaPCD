"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TiposController = void 0;
const tipos_service_1 = require("../services/tipos.service");
exports.TiposController = {
    async list(_req, res) {
        const data = await tipos_service_1.TiposService.list();
        res.json(data);
    },
    async listWithSubtipos(_req, res) {
        const data = await tipos_service_1.TiposService.listWithSubtipos();
        res.json(data);
    },
    async create(req, res) {
        const { nome, descricao, cor } = req.body ?? {};
        const created = await tipos_service_1.TiposService.create(nome, descricao, cor);
        res.status(201).json(created);
    },
    async update(req, res) {
        const id = parseInt(req.params.id || '0');
        const { nome, descricao, cor } = req.body ?? {};
        const updated = await tipos_service_1.TiposService.update(id, nome, descricao, cor);
        res.json(updated);
    },
    async delete(req, res) {
        const id = parseInt(req.params.id || '0');
        try {
            await tipos_service_1.TiposService.delete(id);
            res.status(204).send();
        }
        catch (e) {
            res.status(e.status || 500).json({ error: e.message });
        }
    },
};
//# sourceMappingURL=tipos.controller.js.map