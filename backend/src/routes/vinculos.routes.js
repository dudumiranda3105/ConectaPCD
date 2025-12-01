"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vinculos_controller_1 = require("../controllers/vinculos.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// POST /subtipos/:id/barreiras  (N:N) - apenas admin
router.post("/subtipos/:id/barreiras", auth_middleware_1.authMiddleware, auth_middleware_1.adminOnly, vinculos_controller_1.VinculosController.vincularBarreiras);
// POST /barreiras/:id/acessibilidades  (N:N) - apenas admin
router.post("/barreiras/:id/acessibilidades", auth_middleware_1.authMiddleware, auth_middleware_1.adminOnly, vinculos_controller_1.VinculosController.vincularAcessibilidades);
exports.default = router;
//# sourceMappingURL=vinculos.routes.js.map