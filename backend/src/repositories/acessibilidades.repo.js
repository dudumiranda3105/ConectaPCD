"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcessRepo = void 0;
const prisma_1 = require("./prisma");
exports.AcessRepo = {
    list() {
        return prisma_1.prisma.acessibilidade.findMany({
            orderBy: { id: "asc" },
            include: {
                barreiras: {
                    include: { barreira: true },
                    orderBy: { barreiraId: 'asc' },
                },
            },
        });
    },
    create(nome, descricao) {
        return prisma_1.prisma.acessibilidade.create({ data: { nome, descricao } });
    },
    findById(id) {
        return prisma_1.prisma.acessibilidade.findUnique({ where: { id } });
    },
    findByDescricao(descricao) {
        return prisma_1.prisma.acessibilidade.findFirst({
            where: { descricao: { equals: descricao, mode: 'insensitive' } }
        });
    },
    listBarreiras(id) {
        return prisma_1.prisma.acessibilidade.findUnique({
            where: { id },
            include: {
                barreiras: {
                    include: { barreira: true },
                    orderBy: { barreiraId: 'asc' },
                },
            },
        });
    },
    async addBarreira(acessibilidadeId, barreiraId) {
        const acess = await prisma_1.prisma.acessibilidade.findUnique({ where: { id: acessibilidadeId } });
        if (!acess)
            throw Object.assign(new Error('Acessibilidade não encontrada'), { status: 404 });
        const barreira = await prisma_1.prisma.barreira.findUnique({ where: { id: barreiraId } });
        if (!barreira)
            throw Object.assign(new Error('Barreira não encontrada'), { status: 404 });
        // Verificar se a ligação já existe
        const existing = await prisma_1.prisma.barreiraAcessibilidade.findUnique({
            where: { barreiraId_acessibilidadeId: { barreiraId, acessibilidadeId } }
        });
        if (existing) {
            // Se já existe, retornar sem erro
            return prisma_1.prisma.acessibilidade.findUnique({
                where: { id: acessibilidadeId },
                include: { barreiras: { include: { barreira: true } } },
            });
        }
        await prisma_1.prisma.barreiraAcessibilidade.create({ data: { barreiraId, acessibilidadeId } });
        return prisma_1.prisma.acessibilidade.findUnique({
            where: { id: acessibilidadeId },
            include: { barreiras: { include: { barreira: true } } },
        });
    },
    async removeBarreira(acessibilidadeId, barreiraId) {
        await prisma_1.prisma.barreiraAcessibilidade.delete({ where: { barreiraId_acessibilidadeId: { barreiraId, acessibilidadeId } } }).catch(() => { });
        return prisma_1.prisma.acessibilidade.findUnique({
            where: { id: acessibilidadeId },
            include: { barreiras: { include: { barreira: true } } },
        });
    },
    async delete(id) {
        // Primeiro remove todas as conexões com barreiras
        await prisma_1.prisma.barreiraAcessibilidade.deleteMany({ where: { acessibilidadeId: id } });
        // Depois remove a acessibilidade
        return prisma_1.prisma.acessibilidade.delete({ where: { id } });
    },
};
//# sourceMappingURL=acessibilidades.repo.js.map