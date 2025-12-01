"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VinculosRepo = void 0;
const prisma_1 = require("./prisma");
exports.VinculosRepo = {
    vincularBarreirasSubtipo(subtipoId, barreiraIds) {
        return prisma_1.prisma.subtipoBarreira.createMany({
            data: barreiraIds.map((barreiraId) => ({ subtipoId, barreiraId })),
            skipDuplicates: true,
        });
    },
    vincularAcessBarreira(barreiraId, acessibilidadeIds) {
        return prisma_1.prisma.barreiraAcessibilidade.createMany({
            data: acessibilidadeIds.map((acessibilidadeId) => ({ barreiraId, acessibilidadeId })),
            skipDuplicates: true,
        });
    },
};
//# sourceMappingURL=vinculos.repo.js.map