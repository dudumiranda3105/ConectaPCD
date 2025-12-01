"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidaturasRepo = void 0;
const prisma_1 = require("./prisma");
exports.CandidaturasRepo = {
    async create(candidatoId, vagaId) {
        return prisma_1.prisma.candidatura.create({
            data: { candidatoId, vagaId, status: "Pendente" },
        });
    },
    async findByCandidatoAndVaga(candidatoId, vagaId) {
        return prisma_1.prisma.candidatura.findUnique({
            where: { candidatoId_vagaId: { candidatoId, vagaId } },
        });
    },
    async listByCandidato(candidatoId) {
        return prisma_1.prisma.candidatura.findMany({
            where: { candidatoId },
            include: {
                vaga: {
                    include: {
                        empresa: { select: { id: true, nome: true } },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    },
    async listByVaga(vagaId) {
        return prisma_1.prisma.candidatura.findMany({
            where: { vagaId },
            include: {
                candidato: { select: { id: true, nome: true, email: true } },
            },
            orderBy: { createdAt: "desc" },
        });
    },
    async updateStatus(id, status) {
        return prisma_1.prisma.candidatura.update({
            where: { id },
            data: { status },
        });
    },
    async listByEmpresaAndStatus(empresaId, status) {
        return prisma_1.prisma.candidatura.findMany({
            where: {
                vaga: { empresaId },
                status: status,
            },
            include: {
                vaga: { select: { id: true, titulo: true, descricao: true, regimeTrabalho: true } },
                candidato: { select: { id: true, nome: true, email: true, telefone: true, avatarUrl: true, cidade: true, estado: true, escolaridade: true, curriculoUrl: true } },
            },
            orderBy: { updatedAt: "desc" },
        });
    },
};
//# sourceMappingURL=candidaturas.repo.js.map