"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const candidatos_controller_1 = require("../controllers/candidatos.controller");
const candidatoSubtipos_controller_1 = require("../controllers/candidatoSubtipos.controller");
const candidatoSubtipoBarreiras_controller_1 = require("../controllers/candidatoSubtipoBarreiras.controller");
const candidatoSubtipo_controller_1 = require("../controllers/candidatoSubtipo.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get("/", candidatos_controller_1.CandidatosController.listar);
router.post("/", candidatos_controller_1.CandidatosController.criar);
router.get("/:id", candidatos_controller_1.CandidatosController.buscarPorId);
router.get("/:id/subtipos", candidatoSubtipos_controller_1.CandidatoSubtiposController.listar);
router.post("/:id/subtipos", candidatoSubtipos_controller_1.CandidatoSubtiposController.vincular);
// Nova rota para substituir deficiências (protegida)
router.put("/:candidatoId/disabilities", auth_middleware_1.authMiddleware, candidatoSubtipo_controller_1.CandidatoSubtipoController.updateDisabilities);
router.get("/:id/subtipos/barreiras", candidatoSubtipoBarreiras_controller_1.CandidatoSubtipoBarreirasController.listar);
router.post("/:id/subtipos/:subtipoId/barreiras", candidatoSubtipoBarreiras_controller_1.CandidatoSubtipoBarreirasController.vincular);
// Candidaturas aprovadas (contratações)
router.get("/:id/candidaturas/aprovadas", candidatos_controller_1.CandidatosController.listarCandidaturasAprovadas);
exports.default = router;
//# sourceMappingURL=candidatos.routes.js.map