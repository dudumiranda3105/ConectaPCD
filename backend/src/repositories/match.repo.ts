// src/repositories/match.repo.ts
import { prisma } from "./prisma";

export const MatchRepo = {
  async getCandidatoComBarreiras(candidatoId: number) {
    return prisma.candidato.findUnique({
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
      },
    });
  },

  async getVagasComDetalhes() {
    return prisma.vaga.findMany({
      where: { isActive: true },
      include: {
        empresa: true,
        subtiposAceitos: { include: { subtipo: true } },
        acessibilidades: { include: { acessibilidade: true } },
      },
    });
  },

  async getMapaBarreiraAcessibilidade() {
    return prisma.barreiraAcessibilidade.findMany();
  },

  async saveMatchScore(data: {
    candidatoId: number;
    vagaId: number;
    scoreTotal: number;
    scoreAcessibilidades: number;
    scoreSubtipos: number;
    acessibilidadesAtendidas: number;
    acessibilidadesTotal: number;
    detalhes: any;
  }) {
    const result = await prisma.matchScore.upsert({
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
    return result
  },

  async getMatchScores(candidatoId: number) {
    return prisma.matchScore.findMany({
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
