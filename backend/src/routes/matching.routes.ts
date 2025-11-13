import { Router } from 'express'
import { MatchingController } from '../controllers/matching.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()

// Todas as rotas protegidas por autenticação
router.use(authMiddleware)

// Buscar vagas compatíveis para um candidato
router.get('/candidato/:candidatoId/vagas', MatchingController.buscarVagasParaCandidato)

// Buscar candidatos compatíveis para uma vaga
router.get('/vaga/:vagaId/candidatos', MatchingController.buscarCandidatosParaVaga)

// Calcular compatibilidade específica
router.get('/candidato/:candidatoId/vaga/:vagaId', MatchingController.calcularCompatibilidade)

export default router