import { Router } from "express";
import { CandidaturasController } from "../controllers/candidaturas.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const r = Router();

r.post("/", authMiddleware, CandidaturasController.candidatar);
r.get("/candidato/:candidatoId", authMiddleware, CandidaturasController.listarPorCandidato);
r.get("/vaga/:vagaId", authMiddleware, CandidaturasController.listarPorVaga);
r.patch("/:id/status", authMiddleware, CandidaturasController.atualizarStatus);

export default r;
