"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tipos_routes_1 = __importDefault(require("./tipos.routes"));
const subtipos_routes_1 = __importDefault(require("./subtipos.routes"));
const barreiras_routes_1 = __importDefault(require("./barreiras.routes"));
const acessibilidades_routes_1 = __importDefault(require("./acessibilidades.routes"));
const vinculos_routes_1 = __importDefault(require("./vinculos.routes"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const vagas_routes_1 = __importDefault(require("./vagas.routes"));
const candidaturas_routes_1 = __importDefault(require("./candidaturas.routes"));
const match_routes_1 = __importDefault(require("./match.routes"));
const admin_routes_1 = __importDefault(require("./admin.routes"));
const mensagens_routes_1 = __importDefault(require("./mensagens.routes"));
const laudo_routes_1 = __importDefault(require("./laudo.routes"));
const router = (0, express_1.Router)();
router.use("/tipos", tipos_routes_1.default);
router.use("/subtipos", subtipos_routes_1.default);
router.use("/barreiras", barreiras_routes_1.default);
router.use("/acessibilidades", acessibilidades_routes_1.default);
router.use("/", vinculos_routes_1.default); // rotas de vínculo
router.use("/auth", auth_routes_1.default);
router.use("/vagas", vagas_routes_1.default);
router.use("/candidaturas", candidaturas_routes_1.default);
router.use("/match", match_routes_1.default);
router.use("/admin", admin_routes_1.default);
router.use("/mensagens", mensagens_routes_1.default);
router.use("/laudo", laudo_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map