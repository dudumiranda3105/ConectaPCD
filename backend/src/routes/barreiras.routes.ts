import { Router } from "express";
import { BarreirasController } from "../controllers/barreiras.controller";
import { authMiddleware, adminOnly } from "../middleware/auth.middleware";
const router = Router();

router.get("/", BarreirasController.list);  // /barreiras - público
router.post("/", authMiddleware, adminOnly, BarreirasController.create); // apenas admin
router.get('/:barreiraId/acessibilidades', BarreirasController.listAcessibilidades); // público
router.post('/:barreiraId/acessibilidades', authMiddleware, adminOnly, BarreirasController.connect); // apenas admin
router.delete('/:barreiraId/acessibilidades/:acessibilidadeId', authMiddleware, adminOnly, BarreirasController.disconnect); // apenas admin

export default router;
