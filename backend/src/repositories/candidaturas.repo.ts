import { prisma } from "./prisma";

export const CandidaturasRepo = {
  async create(candidatoId: number, vagaId: number) {
    return prisma.candidatura.create({
      data: { candidatoId, vagaId, status: "Pendente" },
    });
  },

  async findByCandidatoAndVaga(candidatoId: number, vagaId: number) {
    return prisma.candidatura.findUnique({
      where: { candidatoId_vagaId: { candidatoId, vagaId } },
    });
  },

  async listByCandidato(candidatoId: number) {
    return prisma.candidatura.findMany({
      where: { candidatoId },
      include: {
        vaga: {
          include: {
            empresa: { select: { id: true, nome: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async listByVaga(vagaId: number) {
    return prisma.candidatura.findMany({
      where: { vagaId },
      include: {
        candidato: { select: { id: true, nome: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async updateStatus(id: number, status: string) {
    return prisma.candidatura.update({
      where: { id },
      data: { status },
    });
  },

  async listByEmpresaAndStatus(empresaId: number, status: string) {
    return prisma.candidatura.findMany({
      where: {
        vaga: { empresaId },
        status: status,
      },
      include: {
        vaga: { select: { id: true, titulo: true } },
        candidato: { select: { id: true, nome: true, email: true, telefone: true, avatarUrl: true, cidade: true, estado: true, escolaridade: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },
};
