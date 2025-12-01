"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const matching_controller_1 = require("../controllers/matching.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Todas as rotas protegidas por autenticação
router.use(auth_middleware_1.authMiddleware);
// Buscar vagas compatíveis para um candidato
router.get('/candidato/:candidatoId/vagas', matching_controller_1.MatchingController.buscarVagasParaCandidato);
// Buscar candidatos compatíveis para uma vaga
router.get('/vaga/:vagaId/candidatos', matching_controller_1.MatchingController.buscarCandidatosParaVaga);
// Calcular compatibilidade específica
router.get('/candidato/:candidatoId/vaga/:vagaId', matching_controller_1.MatchingController.calcularCompatibilidade);
exports.default = router;
//# sourceMappingURL=matching.routes.js.map