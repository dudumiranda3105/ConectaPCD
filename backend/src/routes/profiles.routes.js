"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const candidateProfile_controller_1 = __importDefault(require("../controllers/candidateProfile.controller"));
const companyProfile_controller_1 = __importDefault(require("../controllers/companyProfile.controller"));
const router = (0, express_1.Router)();
// rotas protegidas: /profiles/candidate, /profiles/company
router.use('/candidate', auth_middleware_1.authMiddleware, candidateProfile_controller_1.default);
router.use('/company', auth_middleware_1.authMiddleware, companyProfile_controller_1.default);
exports.default = router;
//# sourceMappingURL=profiles.routes.js.map