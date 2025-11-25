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
  create(nome: string, descricao?: string) {
    return prisma.tipoDeficiencia.create({ data: { nome, descricao } });
  },
  update(id: number, nome: string, descricao?: string) {
    return prisma.tipoDeficiencia.update({ 
      where: { id }, 
      data: { nome, descricao } 
    });
  },
  findById(id: number) {
    return prisma.tipoDeficiencia.findUnique({ where: { id } });
  },
};