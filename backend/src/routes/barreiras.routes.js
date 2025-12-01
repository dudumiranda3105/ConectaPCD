"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const barreiras_controller_1 = require("../controllers/barreiras.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get("/", barreiras_controller_1.BarreirasController.list); // /barreiras - público
router.post("/", auth_middleware_1.authMiddleware, auth_middleware_1.adminOnly, barreiras_controller_1.BarreirasController.create); // apenas admin
router.get('/:barreiraId/acessibilidades', barreiras_controller_1.BarreirasController.listAcessibilidades); // público
router.post('/:barreiraId/acessibilidades', auth_middleware_1.authMiddleware, auth_middleware_1.adminOnly, barreiras_controller_1.BarreirasController.connect); // apenas admin
router.delete('/:barreiraId/acessibilidades/:acessibilidadeId', auth_middleware_1.authMiddleware, auth_middleware_1.adminOnly, barreiras_controller_1.BarreirasController.disconnect); // apenas admin
exports.default = router;
//# sourceMappingURL=barreiras.routes.js.map