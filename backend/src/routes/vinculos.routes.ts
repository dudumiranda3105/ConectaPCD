import { Router } from "express";
import { VinculosController } from "../controllers/vinculos.controller";
import { authMiddleware, adminOnly } from "../middleware/auth.middleware";
const router = Router();

// POST /subtipos/:id/barreiras  (N:N) - apenas admin
router.post("/subtipos/:id/barreiras", authMiddleware, adminOnly, VinculosController.vincularBarreiras);

// POST /barreiras/:id/acessibilidades  (N:N) - apenas admin
router.post("/barreiras/:id/acessibilidades", authMiddleware, adminOnly, VinculosController.vincularAcessibilidades);

export default router;
