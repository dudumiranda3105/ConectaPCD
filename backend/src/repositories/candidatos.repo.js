"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidatosRepo = void 0;
const prisma_1 = require("./prisma");
exports.CandidatosRepo = {
    findAll() {
        return prisma_1.prisma.candidato.findMany({
            orderBy: { id: "asc" },
            include: { subtipos: { include: { subtipo: true } } },
        });
    },
    findById(id) {
        return prisma_1.prisma.candidato.findUnique({
            where: { id },
            include: {
                subtipos: {
                    include: {
                        subtipo: true,
                        barreiras: { include: { barreira: true } },
                    },
                },
            },
        });
    },
    create(data) {
        return prisma_1.prisma.candidato.create({ data });
    },
};
//# sourceMappingURL=candidatos.repo.js.map