import { prisma } from "./prisma";

export const CandidatoSubtipoBarreirasRepo = {
  findByCandidato(candidatoId: number) {
    return prisma.candidatoSubtipoBarreira.findMany({
      where: { candidatoId },
      include: { barreira: true },
    });
  },

  create(candidatoId: number, subtipoId: number, barreiraIds: number[]) {
    const data = barreiraIds.map((barreiraId) => ({
      candidatoId,
      subtipoId,
      barreiraId,
    }));
    return prisma.candidatoSubtipoBarreira.createMany({
      data,
      skipDuplicates: true,
    });
  },
};