import { Router } from "express";
import tipos from "./tipos.routes";
import subtipos from "./subtipos.routes";
import barreiras from "./barreiras.routes";
import acessibilidades from "./acessibilidades.routes";
import vinculos from "./vinculos.routes";
import auth from "./auth.routes";
import vagas from "./vagas.routes";
import candidaturas from "./candidaturas.routes";
import match from "./match.routes";
import admin from "./admin.routes";
import mensagens from "./mensagens.routes";
import laudo from "./laudo.routes";

const router = Router();


router.use("/tipos", tipos);
router.use("/subtipos", subtipos);
router.use("/barreiras", barreiras);
router.use("/acessibilidades", acessibilidades);
router.use("/", vinculos); // rotas de vínculo
router.use("/auth", auth);
router.use("/vagas", vagas);
router.use("/candidaturas", candidaturas);
router.use("/match", match);
router.use("/admin", admin);
router.use("/mensagens", mensagens);
router.use("/laudo", laudo);

export default router;