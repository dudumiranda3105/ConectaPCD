"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const smartMatch_controller_1 = require("../controllers/smartMatch.controller");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /smart-match/candidato/{candidatoId}/vagas:
 *   get:
 *     tags: [Smart Match]
 *     summary: Buscar vagas com match inteligente
 *     description: Retorna vagas ordenadas por compatibilidade com breakdown detalhado
 *     parameters:
 *       - name: candidatoId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: limite
 *         in: query
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Lista de vagas com smart match
 */
router.get('/candidato/:candidatoId/vagas', smartMatch_controller_1.SmartMatchController.buscarVagasSmartMatch);
/**
 * @swagger
 * /smart-match/candidato/{candidatoId}/vaga/{vagaId}:
 *   get:
 *     tags: [Smart Match]
 *     summary: Calcular smart match específico
 *     description: Calcula match detalhado entre candidato e vaga
 *     parameters:
 *       - name: candidatoId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: vagaId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Resultado do smart match com breakdown
 */
router.get('/candidato/:candidatoId/vaga/:vagaId', smartMatch_controller_1.SmartMatchController.calcularSmartMatch);
/**
 * @swagger
 * /smart-match/vaga/{vagaId}/top-candidatos:
 *   get:
 *     tags: [Smart Match]
 *     summary: Buscar melhores candidatos para vaga
 *     description: Retorna candidatos mais compatíveis com a vaga
 *     parameters:
 *       - name: vagaId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: limite
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Lista de candidatos com smart match
 */
router.get('/vaga/:vagaId/top-candidatos', smartMatch_controller_1.SmartMatchController.buscarTopCandidatos);
exports.default = router;
//# sourceMappingURL=smartMatch.routes.js.map