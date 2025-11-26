import { Router } from "express";
import { AcessibilidadesController } from "../controllers/acessibilidades.controller";
import { authMiddleware, adminOnly } from "../middleware/auth.middleware";

const router = Router();

router.get("/", AcessibilidadesController.list); // /acessibilidades - público
router.post("/seed-missing", AcessibilidadesController.seedMissing); // Endpoint temporário para criar acessibilidades faltantes

// Rotas protegidas apenas para admin
router.post("/", authMiddleware, adminOnly, AcessibilidadesController.create);
router.get('/:acessibilidadeId/barreiras', AcessibilidadesController.listBarreiras);
router.post('/:acessibilidadeId/barreiras', authMiddleware, adminOnly, AcessibilidadesController.connect);
router.delete('/:acessibilidadeId/barreiras/:barreiraId', authMiddleware, adminOnly, AcessibilidadesController.disconnect);
router.delete('/:id', authMiddleware, adminOnly, AcessibilidadesController.delete);

export default router;
