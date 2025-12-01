"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subtipos_controller_1 = require("../controllers/subtipos.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get("/:id", subtipos_controller_1.SubtiposController.getOne); // /subtipos/:id - público
router.get("/", subtipos_controller_1.SubtiposController.list); // /subtipo - público
router.post("/", auth_middleware_1.authMiddleware, auth_middleware_1.adminOnly, subtipos_controller_1.SubtiposController.create); // /subtipos - apenas admin
router.post("/:subtipoId/barreiras", auth_middleware_1.authMiddleware, auth_middleware_1.adminOnly, subtipos_controller_1.SubtiposController.connectBarreira); // apenas admin
router.delete("/:subtipoId/barreiras/:barreiraId", auth_middleware_1.authMiddleware, auth_middleware_1.adminOnly, subtipos_controller_1.SubtiposController.disconnectBarreira); // apenas admin
router.delete("/:id", auth_middleware_1.authMiddleware, auth_middleware_1.adminOnly, subtipos_controller_1.SubtiposController.delete); // /subtipos/:id - apenas admin
exports.default = router;
//# sourceMappingURL=subtipos.routes.js.map