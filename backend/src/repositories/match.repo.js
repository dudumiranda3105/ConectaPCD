"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchRepo = void 0;
// src/repositories/match.repo.ts
const prisma_1 = require("./prisma");
exports.MatchRepo = {
    async getCandidatoComBarreiras(candidatoId) {
        return prisma_1.prisma.candidato.findUnique({
            where: { id: candidatoId },
            include: {
                subtipos: {
                    include: {
                        subtipo: {
                            include: {
                                barreiras: {
                                    include: {
                                        barreira: {
                                            include: {
                                                acessibilidades: {
                                                    include: { acessibilidade: true },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        barreiras: {
                            include: { barreira: true },
                        },
                    },
                },
                acessibilidades: {
                    include: { acessibilidade: true },
                },
                recursosAssistivos: {
                    include: {
                        recurso: {
                            include: {
                                mitigacoes: true,
                            },
                        },
                    },
                },
            },
        });
    },
    async getVagasComDetalhes() {
        return prisma_1.prisma.vaga.findMany({
            where: { isActive: true },
            include: {
                empresa: true,
                subtiposAceitos: { include: { subtipo: true } },
                acessibilidades: { include: { acessibilidade: true } },
            },
        });
    },
    async getMapaBarreiraAcessibilidade() {
        return prisma_1.prisma.barreiraAcessibilidade.findMany();
    },
    async saveMatchScore(data) {
        const result = await prisma_1.prisma.matchScore.upsert({
            where: {
                candidatoId_vagaId: {
                    candidatoId: data.candidatoId,
                    vagaId: data.vagaId,
                },
            },
            create: data,
            update: {
                scoreTotal: data.scoreTotal,
                scoreAcessibilidades: data.scoreAcessibilidades,
                scoreSubtipos: data.scoreSubtipos,
                acessibilidadesAtendidas: data.acessibilidadesAtendidas,
                acessibilidadesTotal: data.acessibilidadesTotal,
                detalhes: data.detalhes,
                updatedAt: new Date(),
            },
        });
        return result;
    },
    async getMatchScores(candidatoId) {
        return prisma_1.prisma.matchScore.findMany({
            where: { candidatoId },
            include: {
                vaga: {
                    include: {
                        empresa: true,
                    },
                },
            },
            orderBy: { scoreTotal: 'desc' },
        });
    },
};
//# sourceMappingURL=match.repo.js.map