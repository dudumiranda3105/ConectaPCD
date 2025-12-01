"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VinculosController = void 0;
const vinculos_service_1 = require("../services/vinculos.service");
exports.VinculosController = {
    async vincularBarreiras(req, res) {
        const subtipoId = Number(req.params.id);
        const { barreiraIds } = req.body ?? {};
        const result = await vinculos_service_1.VinculosService.vincularBarreiras(subtipoId, barreiraIds);
        res.json(result);
    },
    async vincularAcessibilidades(req, res) {
        const barreiraId = Number(req.params.id);
        const { acessibilidadeIds } = req.body ?? {};
        const result = await vinculos_service_1.VinculosService.vincularAcessibilidades(barreiraId, acessibilidadeIds);
        res.json(result);
    },
};
//# sourceMappingURL=vinculos.controller.js.map