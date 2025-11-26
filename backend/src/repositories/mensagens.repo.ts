import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const MensagensRepo = {
  // Criar ou obter conversa para uma candidatura
  async getOrCreateConversa(candidaturaId: number) {
    let conversa = await prisma.conversa.findUnique({
      where: { candidaturaId },
      include: {
        candidatura: {
          select: {
            id: true,
            status: true,
            candidato: {
              select: {
                id: true,
                nome: true,
                avatarUrl: true,
                email: true
              }
            },
            vaga: {
              include: {
                empresa: {
                  select: {
                    id: true,
                    nome: true,
                    email: true
                  }
                }
              }
            }
          }
        },
        mensagens: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!conversa) {
      conversa = await prisma.conversa.create({
        data: { candidaturaId },
        include: {
          candidatura: {
            select: {
              id: true,
              status: true,
              candidato: {
                select: {
                  id: true,
                  nome: true,
                  avatarUrl: true,
                  email: true
                }
              },
              vaga: {
                include: {
                  empresa: {
                    select: {
                      id: true,
                      nome: true,
                      email: true
                    }
                  }
                }
              }
            }
          },
          mensagens: {
            orderBy: { createdAt: 'asc' }
          }
        }
      });
    }

    return conversa;
  },

  // Buscar conversa por ID
  async getConversaById(conversaId: number) {
    return prisma.conversa.findUnique({
      where: { id: conversaId },
      include: {
        candidatura: {
          select: {
            id: true,
            status: true,
            candidato: {
              select: {
                id: true,
                nome: true,
                avatarUrl: true,
                email: true
              }
            },
            vaga: {
              include: {
                empresa: {
                  select: {
                    id: true,
                    nome: true,
                    email: true
                  }
                }
              }
            }
          }
        },
        mensagens: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });
  },

  // Listar conversas de um candidato
  async listarConversasCandidato(candidatoId: number) {
    return prisma.conversa.findMany({
      where: {
        candidatura: {
          candidatoId,
          status: 'EM_PROCESSO'
        }
      },
      include: {
        candidatura: {
          include: {
            candidato: {
              select: {
                id: true,
                nome: true,
                avatarUrl: true
              }
            },
            vaga: {
              include: {
                empresa: {
                  select: {
                    id: true,
                    nome: true
                  }
                }
              }
            }
          }
        },
        mensagens: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
  },

  // Listar conversas de uma empresa
  async listarConversasEmpresa(empresaId: number) {
    return prisma.conversa.findMany({
      where: {
        candidatura: {
          vaga: {
            empresaId
          },
          status: 'EM_PROCESSO'
        }
      },
      include: {
        candidatura: {
          include: {
            candidato: {
              select: {
                id: true,
                nome: true,
                avatarUrl: true
              }
            },
            vaga: {
              select: {
                id: true,
                titulo: true
              }
            }
          }
        },
        mensagens: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
  },

  // Enviar mensagem
  async enviarMensagem(conversaId: number, remetenteId: number, tipoRemetente: string, conteudo: string) {
    const mensagem = await prisma.mensagem.create({
      data: {
        conversaId,
        remetenteId,
        tipoRemetente,
        conteudo
      }
    });

    // Atualizar updatedAt da conversa
    await prisma.conversa.update({
      where: { id: conversaId },
      data: { updatedAt: new Date() }
    });

    return mensagem;
  },

  // Buscar mensagens de uma conversa
  async getMensagens(conversaId: number) {
    return prisma.mensagem.findMany({
      where: { conversaId },
      orderBy: { createdAt: 'asc' }
    });
  },

  // Marcar mensagens como lidas
  async marcarComoLidas(conversaId: number, tipoLeitor: string) {
    // Marca como lidas todas as mensagens que não são do leitor
    const tipoRemetente = tipoLeitor === 'CANDIDATO' ? 'EMPRESA' : 'CANDIDATO';
    
    return prisma.mensagem.updateMany({
      where: {
        conversaId,
        tipoRemetente,
        lida: false
      },
      data: { lida: true }
    });
  },

  // Contar mensagens não lidas
  async contarNaoLidas(conversaId: number, tipoLeitor: string) {
    const tipoRemetente = tipoLeitor === 'CANDIDATO' ? 'EMPRESA' : 'CANDIDATO';
    
    return prisma.mensagem.count({
      where: {
        conversaId,
        tipoRemetente,
        lida: false
      }
    });
  },

  // Contar total de mensagens não lidas para um usuário
  async contarTotalNaoLidas(userId: number, tipoUsuario: string) {
    if (tipoUsuario === 'CANDIDATO') {
      return prisma.mensagem.count({
        where: {
          tipoRemetente: 'EMPRESA',
          lida: false,
          conversa: {
            candidatura: {
              candidatoId: userId
            }
          }
        }
      });
    } else {
      return prisma.mensagem.count({
        where: {
          tipoRemetente: 'CANDIDATO',
          lida: false,
          conversa: {
            candidatura: {
              vaga: {
                empresaId: userId
              }
            }
          }
        }
      });
    }
  }
};
