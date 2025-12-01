"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const laudo_controller_1 = require("../controllers/laudo.controller");
const upload_middleware_1 = require("../middleware/upload.middleware");
const router = (0, express_1.Router)();
// Upload de laudo médico (apenas PDF)
router.post('/upload', auth_middleware_1.authMiddleware, upload_middleware_1.laudoUpload.single('file'), laudo_controller_1.LaudoController.upload);
// Validar laudo antes de enviar (verifica se PDF é válido)
router.post('/validate', auth_middleware_1.authMiddleware, upload_middleware_1.laudoUpload.single('file'), laudo_controller_1.LaudoController.validate);
// Obter laudo de um candidato
router.get('/:candidatoId', auth_middleware_1.authMiddleware, laudo_controller_1.LaudoController.get);
// Remover laudo
router.delete('/', auth_middleware_1.authMiddleware, laudo_controller_1.LaudoController.delete);
exports.default = router;
//# sourceMappingURL=laudo.routes.js.map