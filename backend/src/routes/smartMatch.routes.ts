import { Router } from 'express'
import { SmartMatchController } from '../controllers/smartMatch.controller'

const router = Router()

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
router.get('/candidato/:candidatoId/vagas', SmartMatchController.buscarVagasSmartMatch)

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
router.get('/candidato/:candidatoId/vaga/:vagaId', SmartMatchController.calcularSmartMatch)

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
router.get('/vaga/:vagaId/top-candidatos', SmartMatchController.buscarTopCandidatos)

export default router
