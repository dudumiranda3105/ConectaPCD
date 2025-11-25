import { prisma } from "./prisma";

export const AcessRepo = {
  list() {
    return prisma.acessibilidade.findMany({ 
      orderBy: { id: "asc" },
      include: {
        barreiras: {
          include: { barreira: true },
          orderBy: { barreiraId: 'asc' },
        },
      },
    });
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
    
    // Verificar se a ligação já existe
    const existing = await prisma.barreiraAcessibilidade.findUnique({
      where: { barreiraId_acessibilidadeId: { barreiraId, acessibilidadeId } }
    });
    
    if (existing) {
      // Se já existe, retornar sem erro
      return prisma.acessibilidade.findUnique({
        where: { id: acessibilidadeId },
        include: { barreiras: { include: { barreira: true } } },
      });
    }
    
    await prisma.barreiraAcessibilidade.create({ data: { barreiraId, acessibilidadeId } });
    
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