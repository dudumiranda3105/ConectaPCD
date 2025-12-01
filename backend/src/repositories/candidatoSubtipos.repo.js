"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidatoSubtiposRepo = void 0;
const prisma_1 = require("./prisma");
exports.CandidatoSubtiposRepo = {
    findByCandidato(candidatoId) {
        return prisma_1.prisma.candidatoSubtipo.findMany({
            where: { candidatoId },
            include: { subtipo: true },
        });
    },
    create(candidatoId, subtipoIds) {
        const data = subtipoIds.map((subtipoId) => ({ candidatoId, subtipoId }));
        return prisma_1.prisma.candidatoSubtipo.createMany({ data, skipDuplicates: true });
    },
};
//# sourceMappingURL=candidatoSubtipos.repo.js.map