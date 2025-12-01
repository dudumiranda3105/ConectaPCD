"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const avatarUpload_middleware_1 = require("../middleware/avatarUpload.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
const avatar_controller_1 = require("../controllers/avatar.controller");
const router = (0, express_1.Router)();
router.post('/upload', auth_middleware_1.authMiddleware, auth_middleware_1.candidateOnly, avatarUpload_middleware_1.avatarUpload.single('file'), avatar_controller_1.AvatarController.upload);
router.get('/:candidatoId', avatar_controller_1.AvatarController.get);
router.delete('/', auth_middleware_1.authMiddleware, auth_middleware_1.candidateOnly, avatar_controller_1.AvatarController.delete);
exports.default = router;
//# sourceMappingURL=avatar.routes.js.map