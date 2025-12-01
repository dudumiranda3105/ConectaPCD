"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurriculoController = void 0;
const prisma_1 = require("../repositories/prisma");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const activityLog_service_1 = require("../services/activityLog.service");
exports.CurriculoController = {
    async upload(req, res) {
        try {
            const user = req.user;
            if (!user || user.role !== 'CANDIDATE') {
                return res.status(403).json({ error: 'Acesso negado' });
            }
            const candidato = await prisma_1.prisma.candidato.findUnique({ where: { id: user.id } });
            if (!candidato) {
                return res.status(404).json({ error: 'Perfil de candidato não encontrado' });
            }
            const uploaded = req.file;
            if (!uploaded)
                return res.status(400).json({ error: 'Arquivo não enviado' });
            const url = `/uploads/${uploaded.filename}`;
            const updated = await prisma_1.prisma.candidato.update({
                where: { id: candidato.id },
                data: { curriculoUrl: url },
                select: { id: true, curriculoUrl: true },
            });
            // Registrar atividade de envio de currículo
            await activityLog_service_1.ActivityLogService.logCurriculoEnviado(candidato.nome, candidato.id);
            res.status(200).json(updated);
        }
        catch (e) {
            res.status(400).json({ error: e.message || 'Erro ao enviar currículo' });
        }
    },
    async get(req, res) {
        try {
            const id = Number(req.params.candidatoId);
            const cand = await prisma_1.prisma.candidato.findUnique({ where: { id }, select: { curriculoUrl: true } });
            if (!cand)
                return res.status(404).json({ error: 'Candidato não encontrado' });
            res.json(cand);
        }
        catch (e) {
            res.status(400).json({ error: e.message || 'Erro ao obter currículo' });
        }
    },
    async delete(req, res) {
        try {
            const user = req.user;
            if (!user || user.role !== 'CANDIDATE') {
                return res.status(403).json({ error: 'Acesso negado' });
            }
            const candidato = await prisma_1.prisma.candidato.findUnique({ where: { id: user.id } });
            if (!candidato)
                return res.status(404).json({ error: 'Perfil de candidato não encontrado' });
            const current = await prisma_1.prisma.candidato.findUnique({ where: { id: candidato.id }, select: { curriculoUrl: true } });
            if (current?.curriculoUrl) {
                const filename = current.curriculoUrl.replace('/uploads/', '');
                const filePath = path_1.default.resolve(process.cwd(), 'uploads', filename);
                fs_1.default.unlink(filePath, () => { }); // silencioso
            }
            const updated = await prisma_1.prisma.candidato.update({ where: { id: candidato.id }, data: { curriculoUrl: null }, select: { id: true, curriculoUrl: true } });
            res.json(updated);
        }
        catch (e) {
            res.status(400).json({ error: e.message || 'Erro ao remover currículo' });
        }
    }
};
//# sourceMappingURL=curriculo.controller.js.map