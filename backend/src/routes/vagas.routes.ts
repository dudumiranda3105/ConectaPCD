import { Router } from "express";
import { VagasController } from "../controllers/vagas.controller";

const r = Router();

r.get("/debug/candidaturas", VagasController.listarTodasCandidaturas);
r.get("/", VagasController.listar);
r.get("/empresa/:id", VagasController.listar);
r.get("/:id", VagasController.detalhar);
r.post("/", VagasController.criar);
r.put("/:id", VagasController.atualizar);

// N:N
r.post("/:id/subtipos", VagasController.vincularSubtipos);
r.post("/:id/acessibilidades", VagasController.vincularAcessibilidades);

r.get("/:id/acessibilidades-disponiveis", VagasController.getAcessibilidadesPossiveis);
r.get("/:id/candidaturas", VagasController.listarCandidaturas);

export default r;
