import { Router } from "express";
import { SubtiposController } from "../controllers/subtipos.controller";
import { authMiddleware, adminOnly } from "../middleware/auth.middleware";
const router = Router();

router.get("/:id", SubtiposController.getOne); // /subtipos/:id - público
router.get("/", SubtiposController.list) // /subtipo - público
router.post("/", authMiddleware, adminOnly, SubtiposController.create);   // /subtipos - apenas admin
router.post("/:subtipoId/barreiras", authMiddleware, adminOnly, SubtiposController.connectBarreira); // apenas admin
router.delete("/:subtipoId/barreiras/:barreiraId", authMiddleware, adminOnly, SubtiposController.disconnectBarreira); // apenas admin

export default router;
