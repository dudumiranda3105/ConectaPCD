import { Router } from "express";
import { EmpresasController } from "../controllers/empresas.controller";

const r = Router();

r.get("/", EmpresasController.listar);
r.get("/:id", EmpresasController.detalhar);
r.get("/:id/stats", EmpresasController.stats);
r.get("/:id/candidaturas/em-processo", EmpresasController.listarCandidaturasEmProcesso);
r.get("/:id/candidaturas/aprovadas", EmpresasController.listarCandidaturasAprovadas);
r.post("/", EmpresasController.criar);

export default r;
