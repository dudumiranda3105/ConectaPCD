"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tipos_controller_1 = require("../controllers/tipos.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get("/", tipos_controller_1.TiposController.list); // /tipos - público
router.get("/com-subtipos", tipos_controller_1.TiposController.listWithSubtipos); // /tipos/com-subtipos - público
router.post("/", auth_middleware_1.authMiddleware, auth_middleware_1.adminOnly, tipos_controller_1.TiposController.create); // /tipos - apenas admin
router.put("/:id", auth_middleware_1.authMiddleware, auth_middleware_1.adminOnly, tipos_controller_1.TiposController.update); // /tipos/:id - apenas admin
router.delete("/:id", auth_middleware_1.authMiddleware, auth_middleware_1.adminOnly, tipos_controller_1.TiposController.delete); // /tipos/:id - apenas admin
exports.default = router;
//# sourceMappingURL=tipos.routes.js.map