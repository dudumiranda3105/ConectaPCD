"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchRoutes = void 0;
// src/routes/match.routes.ts
const express_1 = require("express");
const match_controller_1 = require("../controllers/match.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
exports.matchRoutes = (0, express_1.Router)();
// Proteger todas as rotas com autenticação
exports.matchRoutes.use(auth_middleware_1.authMiddleware);
// GET /match/:candidatoId - Vagas compatíveis (filtradas, score >= 50)
exports.matchRoutes.get("/:candidatoId", match_controller_1.MatchController.listarVagasCompativeis);
// GET /match/:candidatoId/calculate - Calcular todos os matches com score detalhado
exports.matchRoutes.get("/:candidatoId/calculate", match_controller_1.MatchController.calcularMatches);
// GET /match/:candidatoId/scores - Buscar scores salvos no cache
exports.matchRoutes.get("/:candidatoId/scores", match_controller_1.MatchController.getMatchScores);
exports.default = exports.matchRoutes;
//# sourceMappingURL=match.routes.js.map