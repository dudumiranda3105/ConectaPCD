// src/server.ts
import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

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
import curriculoRoutes from "./routes/curriculo.routes";
import avatarRoutes from "./routes/avatar.routes";
import assistiveResourcesRoutes from './routes/assistiveResources.routes';
import adminRoutes from './routes/admin.routes';
import mensagensRoutes from './routes/mensagens.routes';
import path from 'path';
const app = express();
const prisma = new PrismaClient();
app.use(cors({ origin: true })); // antes das rotas
app.use(express.json());

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
// currículo upload & fetch
app.use('/curriculo', curriculoRoutes);
// avatar upload & fetch
app.use('/avatar', avatarRoutes);
// rotas de administração
app.use('/admin', adminRoutes);
// rotas de mensagens/chat
app.use('/mensagens', mensagensRoutes);
// servir arquivos de upload
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

// middleware de erro genérico
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Erro interno" });
});

// sobe o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
}); 