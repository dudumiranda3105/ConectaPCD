import { prisma } from "./prisma";

export const CandidatosRepo = {
  findAll() {
    return prisma.candidato.findMany({
      orderBy: { id: "asc" },
      include: { subtipos: { include: { subtipo: true } } },
    });
  },

  findById(id: number) {
    return prisma.candidato.findUnique({
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

  create(data: { nome: string; email?: string; telefone?: string ; escolaridade: string}) {
    return prisma.candidato.create({ data });
  },
};