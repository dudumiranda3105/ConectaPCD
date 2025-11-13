import { Router } from "express";
import { CandidatosController } from "../controllers/candidatos.controller";
import { CandidatoSubtiposController } from "../controllers/candidatoSubtipos.controller";
import { CandidatoSubtipoBarreirasController } from "../controllers/candidatoSubtipoBarreiras.controller";
import { CandidatoSubtipoController } from "../controllers/candidatoSubtipo.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", CandidatosController.listar);
router.post("/", CandidatosController.criar);
router.get("/:id", CandidatosController.buscarPorId);

router.get("/:id/subtipos", CandidatoSubtiposController.listar);
router.post("/:id/subtipos", CandidatoSubtiposController.vincular);

// Nova rota para substituir deficiências (protegida)
router.put("/:candidatoId/disabilities", authMiddleware, CandidatoSubtipoController.updateDisabilities);

router.get("/:id/subtipos/barreiras", CandidatoSubtipoBarreirasController.listar);
router.post("/:id/subtipos/:subtipoId/barreiras", CandidatoSubtipoBarreirasController.vincular);

export default router;