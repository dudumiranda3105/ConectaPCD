// src/routes/match.routes.ts
import { Router } from "express";
import { MatchController } from "../controllers/match.controller";
import { authMiddleware } from "../middleware/auth.middleware";

export const matchRoutes = Router();

// Proteger todas as rotas com autenticação
matchRoutes.use(authMiddleware);

// GET /match/:candidatoId - Vagas compatíveis (filtradas, score >= 50)
matchRoutes.get("/:candidatoId", MatchController.listarVagasCompativeis);

// GET /match/:candidatoId/calculate - Calcular todos os matches com score detalhado
matchRoutes.get("/:candidatoId/calculate", MatchController.calcularMatches);

// GET /match/:candidatoId/scores - Buscar scores salvos no cache
matchRoutes.get("/:candidatoId/scores", MatchController.getMatchScores);

export default matchRoutes;
