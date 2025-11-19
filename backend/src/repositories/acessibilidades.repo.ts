import { prisma } from "./prisma";

export const AcessRepo = {
  list() {
    return prisma.acessibilidade.findMany({ orderBy: { id: "asc" } });
  },
  create(descricao: string) {
    return prisma.acessibilidade.create({ data: { descricao } });
  },
  findById(id: number) {
    return prisma.acessibilidade.findUnique({ where: { id } });
  },
  findByDescricao(descricao: string) {
    return prisma.acessibilidade.findFirst({ 
      where: { descricao: { equals: descricao, mode: 'insensitive' } } 
    });
  },
  listBarreiras(id: number) {
    return prisma.acessibilidade.findUnique({
      where: { id },
      include: {
        barreiras: {
          include: { barreira: true },
          orderBy: { barreiraId: 'asc' },
        },
      },
    });
  },
  async addBarreira(acessibilidadeId: number, barreiraId: number) {
    const acess = await prisma.acessibilidade.findUnique({ where: { id: acessibilidadeId } });
    if (!acess) throw Object.assign(new Error('Acessibilidade não encontrada'), { status: 404 });
    const barreira = await prisma.barreira.findUnique({ where: { id: barreiraId } });
    if (!barreira) throw Object.assign(new Error('Barreira não encontrada'), { status: 404 });
    try {
      await prisma.barreiraAcessibilidade.create({ data: { barreiraId, acessibilidadeId } });
    } catch (e: any) {
      if (e.code === 'P2002') throw Object.assign(new Error('Ligação já existe'), { status: 409 });
      throw e;
    }
    return prisma.acessibilidade.findUnique({
      where: { id: acessibilidadeId },
      include: { barreiras: { include: { barreira: true } } },
    });
  },
  async removeBarreira(acessibilidadeId: number, barreiraId: number) {
    await prisma.barreiraAcessibilidade.delete({ where: { barreiraId_acessibilidadeId: { barreiraId, acessibilidadeId } } }).catch(() => {});
    return prisma.acessibilidade.findUnique({
      where: { id: acessibilidadeId },
      include: { barreiras: { include: { barreira: true } } },
    });
  },
};