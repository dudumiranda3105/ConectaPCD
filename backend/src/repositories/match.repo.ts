// src/repositories/match.repo.ts
import { prisma } from "./prisma";

export const MatchRepo = {
  async getCandidatoComBarreiras(candidatoId: number) {
    return prisma.candidato.findUnique({
      where: { id: candidatoId },
      include: {
        subtipos: {
          include: {
            subtipo: true,
            barreiras: {
              include: { barreira: true },
            },
          },
        },
      },
    });
  },

  async getVagasComDetalhes() {
    return prisma.vaga.findMany({
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
};
