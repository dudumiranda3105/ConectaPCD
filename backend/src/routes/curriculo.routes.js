"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const curriculo_controller_1 = require("../controllers/curriculo.controller");
const upload_middleware_1 = require("../middleware/upload.middleware");
const router = (0, express_1.Router)();
router.post('/upload', auth_middleware_1.authMiddleware, upload_middleware_1.resumeUpload.single('file'), curriculo_controller_1.CurriculoController.upload);
router.get('/:candidatoId', auth_middleware_1.authMiddleware, curriculo_controller_1.CurriculoController.get);
router.delete('/', auth_middleware_1.authMiddleware, curriculo_controller_1.CurriculoController.delete);
exports.default = router;
//# sourceMappingURL=curriculo.routes.js.map