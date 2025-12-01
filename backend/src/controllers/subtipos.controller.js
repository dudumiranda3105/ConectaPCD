"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubtiposController = void 0;
const subtipos_service_1 = require("../services/subtipos.service");
exports.SubtiposController = {
    async list(_req, res) {
        const data = await subtipos_service_1.SubtiposService.list();
        res.json(data);
    },
    async getOne(req, res) {
        const id = Number(req.params.id);
        const data = await subtipos_service_1.SubtiposService.findDeep(id);
        res.json(data);
    },
    async create(req, res) {
        const { nome, tipoId } = req.body ?? {};
        const created = await subtipos_service_1.SubtiposService.create(nome, Number(tipoId));
        res.status(201).json(created);
    },
    async connectBarreira(req, res) {
        const subtipoId = Number(req.params.subtipoId);
        const { barreiraId } = req.body;
        try {
            const updated = await subtipos_service_1.SubtiposService.connectBarreira(subtipoId, Number(barreiraId));
            res.status(201).json(updated);
        }
        catch (e) {
            res.status(e.status || 400).json({ error: e.message });
        }
    },
    async disconnectBarreira(req, res) {
        const subtipoId = Number(req.params.subtipoId);
        const barreiraId = Number(req.params.barreiraId);
        const updated = await subtipos_service_1.SubtiposService.disconnectBarreira(subtipoId, barreiraId);
        res.json(updated);
    },
    async delete(req, res) {
        const id = Number(req.params.id);
        try {
            await subtipos_service_1.SubtiposService.delete(id);
            res.status(204).send();
        }
        catch (e) {
            res.status(e.status || 500).json({ error: e.message });
        }
    },
};
//# sourceMappingURL=subtipos.controller.js.map