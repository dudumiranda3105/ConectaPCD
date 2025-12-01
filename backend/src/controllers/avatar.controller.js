"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarController = void 0;
const prisma_1 = require("../repositories/prisma");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.AvatarController = {
    async upload(req, res) {
        try {
            const user = req.user;
            if (!user || user.role !== 'CANDIDATE') {
                return res.status(403).json({ error: 'Acesso negado' });
            }
            const candidato = await prisma_1.prisma.candidato.findUnique({ where: { id: user.id } });
            if (!candidato)
                return res.status(404).json({ error: 'Perfil de candidato não encontrado' });
            const uploaded = req.file;
            if (!uploaded)
                return res.status(400).json({ error: 'Arquivo não enviado' });
            const url = `/uploads/${uploaded.filename}`;
            // remove avatar anterior (se existir)
            const previous = candidato.avatarUrl;
            if (previous) {
                const filenamePrev = previous.replace('/uploads/', '');
                const filePathPrev = path_1.default.resolve(process.cwd(), 'uploads', filenamePrev);
                fs_1.default.unlink(filePathPrev, () => { });
            }
            const updated = await prisma_1.prisma.candidato.update({
                where: { id: candidato.id },
                data: { avatarUrl: url },
                select: { id: true, avatarUrl: true },
            });
            res.status(200).json(updated);
        }
        catch (e) {
            res.status(400).json({ error: e.message || 'Erro ao enviar avatar' });
        }
    },
    async get(req, res) {
        try {
            const id = Number(req.params.candidatoId);
            const cand = await prisma_1.prisma.candidato.findUnique({ where: { id }, select: { avatarUrl: true } });
            if (!cand)
                return res.status(404).json({ error: 'Candidato não encontrado' });
            res.json(cand);
        }
        catch (e) {
            res.status(400).json({ error: e.message || 'Erro ao obter avatar' });
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
            const currentAvatar = candidato.avatarUrl;
            if (currentAvatar) {
                const filename = currentAvatar.replace('/uploads/', '');
                const filePath = path_1.default.resolve(process.cwd(), 'uploads', filename);
                fs_1.default.unlink(filePath, () => { });
            }
            const updated = await prisma_1.prisma.candidato.update({
                where: { id: candidato.id },
                data: { avatarUrl: null },
                select: { id: true, avatarUrl: true },
            });
            res.json(updated);
        }
        catch (e) {
            res.status(400).json({ error: e.message || 'Erro ao remover avatar' });
        }
    },
};
//# sourceMappingURL=avatar.controller.js.map