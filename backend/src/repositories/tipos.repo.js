"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TiposRepo = void 0;
const prisma_1 = require("./prisma");
exports.TiposRepo = {
    list() {
        return prisma_1.prisma.tipoDeficiencia.findMany({ orderBy: { id: "asc" } });
    },
    listWithSubtipos() {
        return prisma_1.prisma.tipoDeficiencia.findMany({
            orderBy: { id: "asc" },
            include: { subtipos: { orderBy: { id: "asc" } } },
        });
    },
    create(nome, descricao, cor) {
        return prisma_1.prisma.tipoDeficiencia.create({ data: { nome, descricao, cor } });
    },
    update(id, nome, descricao, cor) {
        return prisma_1.prisma.tipoDeficiencia.update({
            where: { id },
            data: { nome, descricao, cor }
        });
    },
    findById(id) {
        return prisma_1.prisma.tipoDeficiencia.findUnique({ where: { id } });
    },
    async delete(id) {
        // Primeiro, deletar todos os subtipos relacionados
        await prisma_1.prisma.subtipoDeficiencia.deleteMany({ where: { tipoId: id } });
        // Depois, deletar o tipo
        return prisma_1.prisma.tipoDeficiencia.delete({ where: { id } });
    },
};
//# sourceMappingURL=tipos.repo.js.map