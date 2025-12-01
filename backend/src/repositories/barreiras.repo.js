"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarreirasRepo = void 0;
const prisma_1 = require("./prisma");
exports.BarreirasRepo = {
    list() {
        return prisma_1.prisma.barreira.findMany({ orderBy: { id: "asc" } });
    },
    create(descricao) {
        return prisma_1.prisma.barreira.create({ data: { descricao } });
    },
    findById(id) {
        return prisma_1.prisma.barreira.findUnique({ where: { id } });
    },
    // opcional: listar acessibilidades já diretamente pela barreira
    listAcessibilidades(id) {
        return prisma_1.prisma.barreira.findUnique({
            where: { id },
            include: {
                acessibilidades: {
                    include: { acessibilidade: true },
                    orderBy: { acessibilidadeId: "asc" },
                },
            },
        });
    },
    async addAcessibilidade(barreiraId, acessibilidadeId) {
        // verificação de existência
        const barreira = await prisma_1.prisma.barreira.findUnique({ where: { id: barreiraId } });
        if (!barreira)
            throw Object.assign(new Error('Barreira não encontrada'), { status: 404 });
        const acess = await prisma_1.prisma.acessibilidade.findUnique({ where: { id: acessibilidadeId } });
        if (!acess)
            throw Object.assign(new Error('Acessibilidade não encontrada'), { status: 404 });
        // criação (duplica protegido por PK composta)
        try {
            await prisma_1.prisma.barreiraAcessibilidade.create({ data: { barreiraId, acessibilidadeId } });
        }
        catch (e) {
            if (e.code === 'P2002') {
                throw Object.assign(new Error('Ligação já existe'), { status: 409 });
            }
            throw e;
        }
        return prisma_1.prisma.barreira.findUnique({
            where: { id: barreiraId },
            include: { acessibilidades: { include: { acessibilidade: true } } },
        });
    },
    async removeAcessibilidade(barreiraId, acessibilidadeId) {
        await prisma_1.prisma.barreiraAcessibilidade.delete({ where: { barreiraId_acessibilidadeId: { barreiraId, acessibilidadeId } } }).catch(() => { });
        return prisma_1.prisma.barreira.findUnique({
            where: { id: barreiraId },
            include: { acessibilidades: { include: { acessibilidade: true } } },
        });
    },
};
//# sourceMappingURL=barreiras.repo.js.map