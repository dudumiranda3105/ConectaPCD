"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const acessibilidades_controller_1 = require("../controllers/acessibilidades.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get("/", acessibilidades_controller_1.AcessibilidadesController.list); // /acessibilidades - público
router.post("/seed-missing", acessibilidades_controller_1.AcessibilidadesController.seedMissing); // Endpoint temporário para criar acessibilidades faltantes
// Rotas protegidas apenas para admin
router.post("/", auth_middleware_1.authMiddleware, auth_middleware_1.adminOnly, acessibilidades_controller_1.AcessibilidadesController.create);
router.get('/:acessibilidadeId/barreiras', acessibilidades_controller_1.AcessibilidadesController.listBarreiras);
router.post('/:acessibilidadeId/barreiras', auth_middleware_1.authMiddleware, auth_middleware_1.adminOnly, acessibilidades_controller_1.AcessibilidadesController.connect);
router.delete('/:acessibilidadeId/barreiras/:barreiraId', auth_middleware_1.authMiddleware, auth_middleware_1.adminOnly, acessibilidades_controller_1.AcessibilidadesController.disconnect);
router.delete('/:id', auth_middleware_1.authMiddleware, auth_middleware_1.adminOnly, acessibilidades_controller_1.AcessibilidadesController.delete);
exports.default = router;
//# sourceMappingURL=acessibilidades.routes.js.map