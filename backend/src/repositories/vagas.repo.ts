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
  }).then(vagas => {
    console.log('[VagasRepo] Vagas carregadas do banco:', vagas.length);
    vagas.forEach(v => {
      console.log(`[VagasRepo] Vaga ${v.id}: ${v.acessibilidades?.length || 0} acessibilidades no banco`);
    });
    return vagas;
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
    console.log('[VagasRepo] linkAcessibilidades chamado:', { vagaId, acessibilidadeIds });
    const data = acessibilidadeIds.map((acessibilidadeId) => ({ vagaId, acessibilidadeId }));
    console.log('[VagasRepo] Dados a serem inseridos:', data);
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
    console.log(`[VagasRepo] Buscando candidaturas para vagaId: ${vagaId}, tipo: ${typeof vagaId}`);
    
    // Garantir que vagaId é um número
    const vagaIdNumber = Number(vagaId);
    if (isNaN(vagaIdNumber)) {
      console.error(`[VagasRepo] vagaId inválido: ${vagaId}`);
      return [];
    }
    
    const candidaturas = await prisma.candidatura.findMany({
      where: { vagaId: vagaIdNumber },
      include: {
        vaga: {
          include: {
            subtiposAceitos: {
              include: {
                subtipo: {
                  include: {
                    tipo: true
                  }
                }
              }
            },
            acessibilidades: {
              include: {
                acessibilidade: true
              }
            }
          }
        },
        candidato: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            escolaridade: true,
            curriculoUrl: true,
            avatarUrl: true,
            dataNascimento: true,
            genero: true,
            cidade: true,
            estado: true,
            biografia: true,
            linkedin: true,
            portfolio: true,
            subtipos: {
              include: {
                subtipo: {
                  include: {
                    tipo: true
                  }
                },
                barreiras: {
                  include: {
                    barreira: true
                  }
                }
              }
            },
            acessibilidades: {
              include: {
                acessibilidade: {
                  select: {
                    id: true,
                    descricao: true
                  }
                }
              }
            },
            recursosAssistivos: {
              include: {
                recurso: {
                  include: {
                    mitigacoes: true
                  }
                }
              }
            }
          }
        },
      },
      orderBy: { createdAt: "desc" },
    });
    
    console.log(`[VagasRepo] Retornando ${candidaturas.length} candidaturas para vaga ${vagaIdNumber}`);
    return candidaturas;
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

  incrementViews(vagaId: number) {
    return prisma.vaga.update({
      where: { id: vagaId },
      // usar as any para evitar erro de tipos caso Prisma Client não tenha sido regenerado
      data: ({ views: { increment: 1 } } as any),
      select: { id: true, views: true },
    });
  },

};
