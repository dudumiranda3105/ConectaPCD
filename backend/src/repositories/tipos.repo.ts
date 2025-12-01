import { prisma } from "./prisma";

export const TiposRepo = {
  list() {
    return prisma.tipoDeficiencia.findMany({ orderBy: { id: "asc" } });
  },
  listWithSubtipos() {
    return prisma.tipoDeficiencia.findMany({
      orderBy: { id: "asc" },
      include: { subtipos: { orderBy: { id: "asc" } } },
    });
  },
  create(nome: string, descricao?: string, cor?: string) {
    return prisma.tipoDeficiencia.create({ data: { nome, descricao, cor } });
  },
  update(id: number, nome: string, descricao?: string, cor?: string) {
    return prisma.tipoDeficiencia.update({ 
      where: { id }, 
      data: { nome, descricao, cor } 
    });
  },
  findById(id: number) {
    return prisma.tipoDeficiencia.findUnique({ where: { id } });
  },
  async delete(id: number) {
    // Primeiro, deletar todos os subtipos relacionados
    await prisma.subtipoDeficiencia.deleteMany({ where: { tipoId: id } });
    // Depois, deletar o tipo
    return prisma.tipoDeficiencia.delete({ where: { id } });
  },
};