import { prisma } from "./prisma";

export const BarreirasRepo = {
  list() {
    return prisma.barreira.findMany({ orderBy: { id: "asc" } });
  },
  create(descricao: string) {
    return prisma.barreira.create({ data: { descricao } });
  },
  findById(id: number) {
    return prisma.barreira.findUnique({ where: { id } });
  },
  // opcional: listar acessibilidades já diretamente pela barreira
  listAcessibilidades(id: number) {
    return prisma.barreira.findUnique({
      where: { id },
      include: {
        acessibilidades: {
          include: { acessibilidade: true },
          orderBy: { acessibilidadeId: "asc" },
        },
      },
    });
  },
  async addAcessibilidade(barreiraId: number, acessibilidadeId: number) {
    // verificação de existência
    const barreira = await prisma.barreira.findUnique({ where: { id: barreiraId } });
    if (!barreira) throw Object.assign(new Error('Barreira não encontrada'), { status: 404 });
    const acess = await prisma.acessibilidade.findUnique({ where: { id: acessibilidadeId } });
    if (!acess) throw Object.assign(new Error('Acessibilidade não encontrada'), { status: 404 });
    // criação (duplica protegido por PK composta)
    try {
      await prisma.barreiraAcessibilidade.create({ data: { barreiraId, acessibilidadeId } });
    } catch (e: any) {
      if (e.code === 'P2002') {
        throw Object.assign(new Error('Ligação já existe'), { status: 409 });
      }
      throw e;
    }
    return prisma.barreira.findUnique({
      where: { id: barreiraId },
      include: { acessibilidades: { include: { acessibilidade: true } } },
    });
  },
  async removeAcessibilidade(barreiraId: number, acessibilidadeId: number) {
    await prisma.barreiraAcessibilidade.delete({ where: { barreiraId_acessibilidadeId: { barreiraId, acessibilidadeId } } }).catch(() => {});
    return prisma.barreira.findUnique({
      where: { id: barreiraId },
      include: { acessibilidades: { include: { acessibilidade: true } } },
    });
  },
};