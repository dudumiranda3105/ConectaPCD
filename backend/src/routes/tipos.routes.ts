import { Router } from "express";
import { TiposController } from "../controllers/tipos.controller";
import { authMiddleware, adminOnly } from "../middleware/auth.middleware";
const router = Router();

router.get("/", TiposController.list);                 // /tipos - público
router.get("/com-subtipos", TiposController.listWithSubtipos); // /tipos/com-subtipos - público
router.post("/", authMiddleware, adminOnly, TiposController.create);              // /tipos - apenas admin
router.put("/:id", authMiddleware, adminOnly, TiposController.update);            // /tipos/:id - apenas admin
router.delete("/:id", authMiddleware, adminOnly, TiposController.delete);         // /tipos/:id - apenas admin

export default router;
