"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubtiposRepo = void 0;
const prisma_1 = require("./prisma");
exports.SubtiposRepo = {
    list() {
        return prisma_1.prisma.subtipoDeficiencia.findMany({ orderBy: { id: "asc" } });
    },
    findById(id) {
        return prisma_1.prisma.subtipoDeficiencia.findUnique({
            where: { id }
        });
    },
    // usado pelo GET /subtipos/:id (com joins + ordenações)
    findDeepById(id) {
        return prisma_1.prisma.subtipoDeficiencia.findUnique({
            where: { id },
            include: {
                tipo: true,
                barreiras: {
                    include: {
                        barreira: {
                            include: {
                                acessibilidades: {
                                    include: { acessibilidade: true },
                                    orderBy: { acessibilidadeId: "asc" },
                                },
                            },
                        },
                    },
                    orderBy: { barreiraId: "asc" },
                },
            },
        });
    },
    create(nome, tipoId) {
        return prisma_1.prisma.subtipoDeficiencia.create({ data: { nome, tipoId } });
    },
    async addBarreira(subtipoId, barreiraId) {
        const subtipo = await prisma_1.prisma.subtipoDeficiencia.findUnique({ where: { id: subtipoId } });
        if (!subtipo)
            throw Object.assign(new Error('Subtipo não encontrado'), { status: 404 });
        const barreira = await prisma_1.prisma.barreira.findUnique({ where: { id: barreiraId } });
        if (!barreira)
            throw Object.assign(new Error('Barreira não encontrada'), { status: 404 });
        try {
            await prisma_1.prisma.subtipoBarreira.create({ data: { subtipoId, barreiraId } });
        }
        catch (e) {
            if (e.code === 'P2002')
                throw Object.assign(new Error('Ligação já existe'), { status: 409 });
            throw e;
        }
        return this.findDeepById(subtipoId);
    },
    async removeBarreira(subtipoId, barreiraId) {
        await prisma_1.prisma.subtipoBarreira.delete({ where: { subtipoId_barreiraId: { subtipoId, barreiraId } } }).catch(() => { });
        return this.findDeepById(subtipoId);
    },
    async delete(id) {
        // Primeiro, remover todas as barreiras vinculadas
        await prisma_1.prisma.subtipoBarreira.deleteMany({ where: { subtipoId: id } });
        // Remover vínculos com candidatos
        await prisma_1.prisma.candidatoSubtipo.deleteMany({ where: { subtipoId: id } });
        // Remover vínculos com vagas
        await prisma_1.prisma.vagaSubtipo.deleteMany({ where: { subtipoId: id } });
        // Depois, deletar o subtipo
        return prisma_1.prisma.subtipoDeficiencia.delete({ where: { id } });
    },
};
//# sourceMappingURL=subtipos.repo.js.map