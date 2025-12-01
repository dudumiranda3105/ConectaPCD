"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const client_1 = require("@prisma/client");
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_config_1 = require("./config/swagger.config");
const rateLimiter_1 = require("./middleware/rateLimiter");
// importa suas rotas
const tipos_routes_1 = __importDefault(require("./routes/tipos.routes"));
const subtipos_routes_1 = __importDefault(require("./routes/subtipos.routes"));
const barreiras_routes_1 = __importDefault(require("./routes/barreiras.routes"));
const acessibilidades_routes_1 = __importDefault(require("./routes/acessibilidades.routes"));
const vinculos_routes_1 = __importDefault(require("./routes/vinculos.routes"));
const empresas_routes_1 = __importDefault(require("./routes/empresas.routes"));
const vagas_routes_1 = __importDefault(require("./routes/vagas.routes"));
const candidatos_routes_1 = __importDefault(require("./routes/candidatos.routes"));
const match_routes_1 = require("./routes/match.routes");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const profiles_routes_1 = __importDefault(require("./routes/profiles.routes"));
const candidaturas_routes_1 = __importDefault(require("./routes/candidaturas.routes"));
const matching_routes_1 = __importDefault(require("./routes/matching.routes"));
const smartMatch_routes_1 = __importDefault(require("./routes/smartMatch.routes"));
const curriculo_routes_1 = __importDefault(require("./routes/curriculo.routes"));
const avatar_routes_1 = __importDefault(require("./routes/avatar.routes"));
const assistiveResources_routes_1 = __importDefault(require("./routes/assistiveResources.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const mensagens_routes_1 = __importDefault(require("./routes/mensagens.routes"));
const laudo_routes_1 = __importDefault(require("./routes/laudo.routes"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const prisma = new client_1.PrismaClient();
// Segurança com Helmet
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false, // Desabilitar CSP para dev
}));
// Rate limiting removido para desenvolvimento
app.use((0, cors_1.default)({ origin: true })); // antes das rotas
app.use(express_1.default.json());
// Documentação Swagger
const combinedSwaggerSpec = {
    ...swagger_config_1.swaggerSpec,
    paths: { ...swagger_config_1.swaggerSpec.paths, ...swagger_config_1.swaggerDocs },
};
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(combinedSwaggerSpec, {
    customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info { margin: 20px 0 }
    .swagger-ui .info .title { color: #6366f1 }
  `,
    customSiteTitle: 'ConectaPCD API - Documentação',
}));
// usa os módulos de rotas
app.use("/tipos", tipos_routes_1.default);
app.use("/subtipos", subtipos_routes_1.default);
app.use("/vinculos", vinculos_routes_1.default);
app.use("/barreiras", barreiras_routes_1.default);
app.use("/acessibilidades", acessibilidades_routes_1.default);
app.use('/assistive-resources', assistiveResources_routes_1.default);
app.use("/empresas", empresas_routes_1.default);
app.use("/vagas", vagas_routes_1.default);
app.use("/candidatos", candidatos_routes_1.default);
// rotas de autenticação
app.use("/auth", auth_routes_1.default);
app.use("/profiles", profiles_routes_1.default);
// rota de candidaturas
app.use("/candidaturas", candidaturas_routes_1.default);
// nova rota de match
app.use("/match", match_routes_1.matchRoutes);
// sistema de matching inteligente
app.use("/matching", matching_routes_1.default);
// smart match com breakdown detalhado
app.use("/smart-match", smartMatch_routes_1.default);
// currículo upload & fetch
app.use('/curriculo', curriculo_routes_1.default);
// avatar upload & fetch
app.use('/avatar', avatar_routes_1.default);
// rotas de administração
app.use('/admin', admin_routes_1.default);
// rota pública de estatísticas (sem autenticação)
const admin_controller_1 = require("./controllers/admin.controller");
app.get('/stats', rateLimiter_1.statsLimiter, admin_controller_1.getPublicStats);
// rotas de mensagens/chat
app.use('/mensagens', mensagens_routes_1.default);
// rotas de laudo médico PCD
app.use('/laudo', laudo_routes_1.default);
// servir arquivos de upload
app.use('/uploads', express_1.default.static(path_1.default.resolve(process.cwd(), 'uploads')));
// middleware de erro genérico
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || "Erro interno" });
});
// sobe o servidor
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`);
    console.log(`Documentação em http://localhost:${PORT}/api-docs`);
});
//# sourceMappingURL=server.js.map