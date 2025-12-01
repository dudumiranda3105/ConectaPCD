"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const candidaturas_controller_1 = require("../controllers/candidaturas.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const r = (0, express_1.Router)();
r.post("/", auth_middleware_1.authMiddleware, candidaturas_controller_1.CandidaturasController.candidatar);
r.get("/candidato/:candidatoId", auth_middleware_1.authMiddleware, candidaturas_controller_1.CandidaturasController.listarPorCandidato);
r.get("/vaga/:vagaId", auth_middleware_1.authMiddleware, candidaturas_controller_1.CandidaturasController.listarPorVaga);
r.patch("/:id/status", auth_middleware_1.authMiddleware, candidaturas_controller_1.CandidaturasController.atualizarStatus);
exports.default = r;
//# sourceMappingURL=candidaturas.routes.js.map