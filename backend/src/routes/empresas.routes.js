"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const empresas_controller_1 = require("../controllers/empresas.controller");
const r = (0, express_1.Router)();
r.get("/", empresas_controller_1.EmpresasController.listar);
r.get("/:id", empresas_controller_1.EmpresasController.detalhar);
r.get("/:id/stats", empresas_controller_1.EmpresasController.stats);
r.get("/:id/candidaturas/em-processo", empresas_controller_1.EmpresasController.listarCandidaturasEmProcesso);
r.get("/:id/candidaturas/aprovadas", empresas_controller_1.EmpresasController.listarCandidaturasAprovadas);
r.post("/", empresas_controller_1.EmpresasController.criar);
exports.default = r;
//# sourceMappingURL=empresas.routes.js.map