// src/server.ts
import express from "express";
import { createServer } from "http";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec, swaggerDocs } from "./config/swagger.config";
import { generalLimiter, statsLimiter } from "./middleware/rateLimiter";
import { socketService } from "./services/socket.service";

// importa suas rotas
import tiposRoutes from "./routes/tipos.routes";
import subtiposRoutes from "./routes/subtipos.routes";
import barreirasRoutes from "./routes/barreiras.routes";
import acessibilidadesRoutes from "./routes/acessibilidades.routes";
import vinculosRoutes from "./routes/vinculos.routes"
import empresasRoutes from "./routes/empresas.routes";
import vagasRoutes from "./routes/vagas.routes";
import candidatoRoutes from "./routes/candidatos.routes";
import { matchRoutes } from "./routes/match.routes";
import authRoutes from "./routes/auth.routes";
import profilesRoutes from "./routes/profiles.routes";
import candidaturasRoutes from "./routes/candidaturas.routes";
import matchingRoutes from "./routes/matching.routes";
import smartMatchRoutes from "./routes/smartMatch.routes";
import curriculoRoutes from "./routes/curriculo.routes";
import avatarRoutes from "./routes/avatar.routes";
import assistiveResourcesRoutes from './routes/assistiveResources.routes';
import adminRoutes from './routes/admin.routes';
import mensagensRoutes from './routes/mensagens.routes';
import laudoRoutes from './routes/laudo.routes';
import path from 'path';
const app = express();
const httpServer = createServer(app);
const prisma = new PrismaClient();

// Inicializa Socket.io
socketService.initialize(httpServer);

// Segurança com Helmet
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false, // Desabilitar CSP para dev
}));

// Rate limiting geral
app.use(generalLimiter);

app.use(cors({ origin: true })); // antes das rotas
app.use(express.json());

// Documentação Swagger
const combinedSwaggerSpec = {
  ...swaggerSpec,
  paths: { ...(swaggerSpec as any).paths, ...swaggerDocs },
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(combinedSwaggerSpec, {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info { margin: 20px 0 }
    .swagger-ui .info .title { color: #6366f1 }
  `,
  customSiteTitle: 'ConectaPCD API - Documentação',
}));

// usa os módulos de rotas
app.use("/tipos", tiposRoutes);
app.use("/subtipos", subtiposRoutes);
app.use("/vinculos", vinculosRoutes)
app.use("/barreiras", barreirasRoutes);
app.use("/acessibilidades", acessibilidadesRoutes);
app.use('/assistive-resources', assistiveResourcesRoutes);

app.use("/empresas", empresasRoutes);
app.use("/vagas", vagasRoutes);

app.use("/candidatos", candidatoRoutes);

// rotas de autenticação
app.use("/auth", authRoutes);
app.use("/profiles", profilesRoutes);

// rota de candidaturas
app.use("/candidaturas", candidaturasRoutes);

// nova rota de match
app.use("/match", matchRoutes);

// sistema de matching inteligente
app.use("/matching", matchingRoutes);
// smart match com breakdown detalhado
app.use("/smart-match", smartMatchRoutes);
// currículo upload & fetch
app.use('/curriculo', curriculoRoutes);
// avatar upload & fetch
app.use('/avatar', avatarRoutes);
// rotas de administração
app.use('/admin', adminRoutes);

// rota pública de estatísticas (sem autenticação)
import { getPublicStats } from './controllers/admin.controller';
app.get('/stats', statsLimiter, getPublicStats);
// rotas de mensagens/chat
app.use('/mensagens', mensagensRoutes);
// rotas de laudo médico PCD
app.use('/laudo', laudoRoutes);
// servir arquivos de upload
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

// middleware de erro genérico
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Erro interno" });
});

// sobe o servidor
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
  console.log(`WebSocket disponível em ws://localhost:${PORT}`);
  console.log(`Documentação em http://localhost:${PORT}/api-docs`);
}); 