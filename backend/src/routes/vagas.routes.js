"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vagas_controller_1 = require("../controllers/vagas.controller");
const r = (0, express_1.Router)();
r.get("/debug/candidaturas", vagas_controller_1.VagasController.listarTodasCandidaturas);
r.get("/", vagas_controller_1.VagasController.listar);
r.get("/empresa/:id", vagas_controller_1.VagasController.listar);
r.get("/:id", vagas_controller_1.VagasController.detalhar);
r.post("/", vagas_controller_1.VagasController.criar);
r.put("/:id", vagas_controller_1.VagasController.atualizar);
// Registrar visualização
r.post("/:id/view", vagas_controller_1.VagasController.registrarVisualizacao);
// N:N
r.post("/:id/subtipos", vagas_controller_1.VagasController.vincularSubtipos);
r.post("/:id/acessibilidades", vagas_controller_1.VagasController.vincularAcessibilidades);
r.get("/:id/acessibilidades-disponiveis", vagas_controller_1.VagasController.getAcessibilidadesPossiveis);
r.get("/:id/candidaturas", vagas_controller_1.VagasController.listarCandidaturas);
exports.default = r;
//# sourceMappingURL=vagas.routes.js.map