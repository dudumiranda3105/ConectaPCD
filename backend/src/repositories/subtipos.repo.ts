import { prisma } from "./prisma";

export const SubtiposRepo = {
  list() {
    return prisma.subtipoDeficiencia.findMany({ orderBy: { id: "asc" } });
  },
  findById(id: number) {
    return prisma.subtipoDeficiencia.findUnique({ 
      where: { id } });
  },
   // usado pelo GET /subtipos/:id (com joins + ordenações)
  findDeepById(id: number) {
    return prisma.subtipoDeficiencia.findUnique({
      where: { id },
      include: {
        tipo: true,
        barreiras: {
          include: {
            barreira: {
              include: {
                acessibilidades: {
                  include: { acessibilidade: true },
                  orderBy: { acessibilidadeId: "asc" },
                },
              },
            },
          },
          orderBy: { barreiraId: "asc" },
        },
      },
    });
  },

  create(nome: string, tipoId: number) {
    return prisma.subtipoDeficiencia.create({ data: { nome, tipoId } });
  },
  async addBarreira(subtipoId: number, barreiraId: number) {
    const subtipo = await prisma.subtipoDeficiencia.findUnique({ where: { id: subtipoId } });
    if (!subtipo) throw Object.assign(new Error('Subtipo não encontrado'), { status: 404 });
    const barreira = await prisma.barreira.findUnique({ where: { id: barreiraId } });
    if (!barreira) throw Object.assign(new Error('Barreira não encontrada'), { status: 404 });
    try {
      await prisma.subtipoBarreira.create({ data: { subtipoId, barreiraId } });
    } catch (e: any) {
      if (e.code === 'P2002') throw Object.assign(new Error('Ligação já existe'), { status: 409 });
      throw e;
    }
    return this.findDeepById(subtipoId);
  },
  async removeBarreira(subtipoId: number, barreiraId: number) {
    await prisma.subtipoBarreira.delete({ where: { subtipoId_barreiraId: { subtipoId, barreiraId } } }).catch(() => {});
    return this.findDeepById(subtipoId);
  },
};