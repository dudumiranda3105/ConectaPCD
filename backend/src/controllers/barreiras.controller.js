"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarreirasController = void 0;
const barreiras_service_1 = require("../services/barreiras.service");
exports.BarreirasController = {
    async list(_req, res) {
        const data = await barreiras_service_1.BarreirasService.list();
        res.json(data);
    },
    async create(req, res) {
        const { descricao } = req.body ?? {};
        const created = await barreiras_service_1.BarreirasService.create(descricao);
        res.status(201).json(created);
    },
    async listAcessibilidades(req, res) {
        const barreiraId = Number(req.params.barreiraId);
        const data = await barreiras_service_1.BarreirasService.listAcessibilidades(barreiraId);
        if (!data)
            return res.status(404).json({ error: 'Barreira não encontrada' });
        res.json(data.acessibilidades.map(a => ({
            barreiraId: a.barreiraId,
            acessibilidadeId: a.acessibilidadeId,
            acessibilidade: a.acessibilidade,
        })));
    },
    async connect(req, res) {
        const barreiraId = Number(req.params.barreiraId);
        const { acessibilidadeId } = req.body;
        try {
            const updated = await barreiras_service_1.BarreirasService.connect(barreiraId, Number(acessibilidadeId));
            res.status(201).json({
                barreiraId,
                acessibilidades: updated?.acessibilidades.map(a => ({ acessibilidadeId: a.acessibilidadeId, descricao: a.acessibilidade.descricao })) || [],
            });
        }
        catch (e) {
            res.status(e.status || 400).json({ error: e.message });
        }
    },
    async disconnect(req, res) {
        const barreiraId = Number(req.params.barreiraId);
        const acessibilidadeId = Number(req.params.acessibilidadeId);
        const updated = await barreiras_service_1.BarreirasService.disconnect(barreiraId, acessibilidadeId);
        res.json({
            barreiraId,
            acessibilidades: updated?.acessibilidades.map(a => ({ acessibilidadeId: a.acessibilidadeId, descricao: a.acessibilidade.descricao })) || [],
        });
    },
};
//# sourceMappingURL=barreiras.controller.js.map