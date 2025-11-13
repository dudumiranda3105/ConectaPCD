import { prisma } from "./prisma";

export const VagasRepo = {
 list(empresaId?: number) {
  return prisma.vaga.findMany({
    where: empresaId ? { empresaId } : undefined,
    orderBy: { id: "asc" },
    include: {
      empresa: { select: { id: true, nome: true, companyData: true } },
      subtiposAceitos: {
        include: { subtipo: { select: { id: true, nome: true, tipoId: true } } },
        orderBy: { subtipoId: "asc" },
      },
      acessibilidades: {
        include: { acessibilidade: { select: { id: true, descricao: true } } },
        orderBy: { acessibilidadeId: "asc" },
      },
    },
  });
},

  findById(id: number) {
    return prisma.vaga.findUnique({
      where: { id },
      include: {
        empresa: { select: { id: true, nome: true, cnpj: true } },
        subtiposAceitos: {
          include: { subtipo: { select: { id: true, nome: true, tipoId: true } } },
          orderBy: { subtipoId: "asc" },
        },
        acessibilidades: {
          include: { acessibilidade: { select: { id: true, descricao: true } } },
          orderBy: { acessibilidadeId: "asc" },
        },
      },
    });
  },

  create(empresaId: number, titulo: string, descricao: string, escolaridade: string, tipo?: string, regimeTrabalho?: string, beneficios?: string) {
    return prisma.vaga.create({ data: { empresaId, titulo, descricao, escolaridade, tipo, regimeTrabalho, beneficios } });
  },

  linkSubtipos(vagaId: number, subtipoIds: number[]) {
    const data = subtipoIds.map((subtipoId) => ({ vagaId, subtipoId }));
    return prisma.vagaSubtipo.createMany({ data, skipDuplicates: true });
  },

  linkAcessibilidades(vagaId: number, acessibilidadeIds: number[]) {
    const data = acessibilidadeIds.map((acessibilidadeId) => ({ vagaId, acessibilidadeId }));
    return prisma.vagaAcessibilidade.createMany({ data, skipDuplicates: true });
  },

   async findByIdWithSubtiposBarreirasAcessibilidades(vagaId: number) {
    return prisma.vaga.findUnique({
      where: { id: vagaId },
      include: {
        subtiposAceitos: {
          include: {
            subtipo: {
              include: {
                barreiras: {
                  include: {
                    barreira: {
                      include: {
                        acessibilidades: {
                          include: { acessibilidade: true },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  },

  async getCandidaturas(vagaId: number) {
    console.log(`[VagasRepo] Buscando candidaturas para vagaId: ${vagaId}`);
    
    // Primeiro vamos verificar se existem candidaturas
    const totalCandidaturas = await prisma.candidatura.count({
      where: { vagaId }
    });
    console.log(`[VagasRepo] Total de candidaturas encontradas: ${totalCandidaturas}`);
    
    // Se não há candidaturas, retornar array vazio
    if (totalCandidaturas === 0) {
      console.log(`[VagasRepo] Nenhuma candidatura encontrada para a vaga ${vagaId}`);
      return [];
    }
    
    return prisma.candidatura.findMany({
      where: { vagaId },
      include: {
        candidato: {
          include: {
            user: {
              select: {
                email: true
              }
            },
            subtipos: {
              include: {
                subtipo: {
                  include: {
                    tipo: {
                      select: {
                        nome: true
                      }
                    }
                  }
                }
              }
            }
          }
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  update(vagaId: number, dados: {
    titulo?: string;
    descricao?: string;
    escolaridade?: string;
    tipo?: string;
    regimeTrabalho?: string;
    beneficios?: string;
    isActive?: boolean;
  }) {
    return prisma.vaga.update({
      where: { id: vagaId },
      data: dados,
      include: {
        empresa: { select: { id: true, nome: true, companyData: true } },
      },
    });
  },

};
