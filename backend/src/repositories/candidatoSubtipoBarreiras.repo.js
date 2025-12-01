"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidatoSubtipoBarreirasRepo = void 0;
const prisma_1 = require("./prisma");
exports.CandidatoSubtipoBarreirasRepo = {
    findByCandidato(candidatoId) {
        return prisma_1.prisma.candidatoSubtipoBarreira.findMany({
            where: { candidatoId },
            include: { barreira: true },
        });
    },
    create(candidatoId, subtipoId, barreiraIds) {
        const data = barreiraIds.map((barreiraId) => ({
            candidatoId,
            subtipoId,
            barreiraId,
        }));
        return prisma_1.prisma.candidatoSubtipoBarreira.createMany({
            data,
            skipDuplicates: true,
        });
    },
};
//# sourceMappingURL=candidatoSubtipoBarreiras.repo.js.map