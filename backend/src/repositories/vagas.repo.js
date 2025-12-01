"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VagasRepo = void 0;
const prisma_1 = require("./prisma");
exports.VagasRepo = {
    list(empresaId) {
        return prisma_1.prisma.vaga.findMany({
            where: empresaId ? { empresaId } : undefined,
            orderBy: { id: "asc" },
            include: {
                empresa: { select: { id: true, nome: true, companyData: true } },
                subtiposAceitos: {
                    include: {
                        subtipo: {
                            select: {
                                id: true,
                                nome: true,
                                tipoId: true,
                                tipo: { select: { id: true, nome: true } }
                            }
                        }
                    },
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
    findById(id) {
        return prisma_1.prisma.vaga.findUnique({
            where: { id },
            include: {
                empresa: { select: { id: true, nome: true, cnpj: true, nomeFantasia: true, razaoSocial: true } },
                subtiposAceitos: {
                    include: {
                        subtipo: {
                            select: {
                                id: true,
                                nome: true,
                                tipoId: true,
                                tipo: { select: { id: true, nome: true } }
                            }
                        }
                    },
                    orderBy: { subtipoId: "asc" },
                },
                acessibilidades: {
                    include: { acessibilidade: { select: { id: true, descricao: true } } },
                    orderBy: { acessibilidadeId: "asc" },
                },
            },
        });
    },
    create(empresaId, titulo, descricao, escolaridade, tipo, regimeTrabalho, beneficios) {
        return prisma_1.prisma.vaga.create({ data: { empresaId, titulo, descricao, escolaridade, tipo, regimeTrabalho, beneficios } });
    },
    linkSubtipos(vagaId, subtipoIds) {
        const data = subtipoIds.map((subtipoId) => ({ vagaId, subtipoId }));
        return prisma_1.prisma.vagaSubtipo.createMany({ data, skipDuplicates: true });
    },
    linkAcessibilidades(vagaId, acessibilidadeIds) {
        console.log('[VagasRepo] linkAcessibilidades chamado:', { vagaId, acessibilidadeIds });
        const data = acessibilidadeIds.map((acessibilidadeId) => ({ vagaId, acessibilidadeId }));
        console.log('[VagasRepo] Dados a serem inseridos:', data);
        return prisma_1.prisma.vagaAcessibilidade.createMany({ data, skipDuplicates: true });
    },
    async findByIdWithSubtiposBarreirasAcessibilidades(vagaId) {
        return prisma_1.prisma.vaga.findUnique({
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
    async getCandidaturas(vagaId) {
        console.log(`[VagasRepo] Buscando candidaturas para vagaId: ${vagaId}, tipo: ${typeof vagaId}`);
        // Garantir que vagaId é um número
        const vagaIdNumber = Number(vagaId);
        if (isNaN(vagaIdNumber)) {
            console.error(`[VagasRepo] vagaId inválido: ${vagaId}`);
            return [];
        }
        const candidaturas = await prisma_1.prisma.candidatura.findMany({
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
                        linkedin: true,
                        portfolio: true,
                        profileData: true,
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
    update(vagaId, dados) {
        return prisma_1.prisma.vaga.update({
            where: { id: vagaId },
            data: dados,
            include: {
                empresa: { select: { id: true, nome: true, companyData: true } },
            },
        });
    },
    incrementViews(vagaId) {
        return prisma_1.prisma.vaga.update({
            where: { id: vagaId },
            // usar as any para evitar erro de tipos caso Prisma Client não tenha sido regenerado
            data: { views: { increment: 1 } },
            select: { id: true, views: true },
        });
    },
};
//# sourceMappingURL=vagas.repo.js.map