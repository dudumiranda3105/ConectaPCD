import { prisma } from "./prisma";

export const CandidatoSubtiposRepo = {
  findByCandidato(candidatoId: number) {
    return prisma.candidatoSubtipo.findMany({
      where: { candidatoId },
      include: { subtipo: true },
    });
  },

  create(candidatoId: number, subtipoIds: number[]) {
    const data = subtipoIds.map((subtipoId) => ({ candidatoId, subtipoId }));
    return prisma.candidatoSubtipo.createMany({ data, skipDuplicates: true });
  },
};