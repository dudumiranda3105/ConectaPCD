export declare const VagasRepo: {
    list(empresaId?: number): Promise<({
        empresa: {
            id: number;
            nome: string;
            companyData: import("@prisma/client/runtime/library").JsonValue;
        };
        acessibilidades: ({
            acessibilidade: {
                id: number;
                descricao: string;
            };
        } & {
            createdAt: Date;
            updatedAt: Date;
            vagaId: number;
            acessibilidadeId: number;
            observacoes: string | null;
            disponivel: boolean;
            qualidade: string;
        })[];
        subtiposAceitos: ({
            subtipo: {
                id: number;
                nome: string;
                tipo: {
                    id: number;
                    nome: string;
                };
                tipoId: number;
            };
        } & {
            vagaId: number;
            subtipoId: number;
        })[];
    } & {
        id: number;
        descricao: string;
        createdAt: Date;
        updatedAt: Date;
        empresaId: number;
        escolaridade: string;
        isActive: boolean;
        titulo: string;
        beneficios: string | null;
        regimeTrabalho: string | null;
        tipo: string | null;
        views: number;
    })[]>;
    findById(id: number): import("@prisma/client").Prisma.Prisma__VagaClient<({
        empresa: {
            id: number;
            nome: string;
            cnpj: string | null;
            nomeFantasia: string | null;
            razaoSocial: string | null;
        };
        acessibilidades: ({
            acessibilidade: {
                id: number;
                descricao: string;
            };
        } & {
            createdAt: Date;
            updatedAt: Date;
            vagaId: number;
            acessibilidadeId: number;
            observacoes: string | null;
            disponivel: boolean;
            qualidade: string;
        })[];
        subtiposAceitos: ({
            subtipo: {
                id: number;
                nome: string;
                tipo: {
                    id: number;
                    nome: string;
                };
                tipoId: number;
            };
        } & {
            vagaId: number;
            subtipoId: number;
        })[];
    } & {
        id: number;
        descricao: string;
        createdAt: Date;
        updatedAt: Date;
        empresaId: number;
        escolaridade: string;
        isActive: boolean;
        titulo: string;
        beneficios: string | null;
        regimeTrabalho: string | null;
        tipo: string | null;
        views: number;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    create(empresaId: number, titulo: string, descricao: string, escolaridade: string, tipo?: string, regimeTrabalho?: string, beneficios?: string): import("@prisma/client").Prisma.Prisma__VagaClient<{
        id: number;
        descricao: string;
        createdAt: Date;
        updatedAt: Date;
        empresaId: number;
        escolaridade: string;
        isActive: boolean;
        titulo: string;
        beneficios: string | null;
        regimeTrabalho: string | null;
        tipo: string | null;
        views: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    linkSubtipos(vagaId: number, subtipoIds: number[]): import("@prisma/client").Prisma.PrismaPromise<import("@prisma/client").Prisma.BatchPayload>;
    linkAcessibilidades(vagaId: number, acessibilidadeIds: number[]): import("@prisma/client").Prisma.PrismaPromise<import("@prisma/client").Prisma.BatchPayload>;
    findByIdWithSubtiposBarreirasAcessibilidades(vagaId: number): Promise<({
        subtiposAceitos: ({
            subtipo: {
                barreiras: ({
                    barreira: {
                        acessibilidades: ({
                            acessibilidade: {
                                id: number;
                                nome: string | null;
                                descricao: string;
                                createdAt: Date;
                                updatedAt: Date;
                            };
                        } & {
                            acessibilidadeId: number;
                            barreiraId: number;
                        })[];
                    } & {
                        id: number;
                        descricao: string;
                        createdAt: Date;
                        updatedAt: Date;
                    };
                } & {
                    subtipoId: number;
                    barreiraId: number;
                })[];
            } & {
                id: number;
                nome: string;
                createdAt: Date;
                updatedAt: Date;
                tipoId: number;
            };
        } & {
            vagaId: number;
            subtipoId: number;
        })[];
    } & {
        id: number;
        descricao: string;
        createdAt: Date;
        updatedAt: Date;
        empresaId: number;
        escolaridade: string;
        isActive: boolean;
        titulo: string;
        beneficios: string | null;
        regimeTrabalho: string | null;
        tipo: string | null;
        views: number;
    }) | null>;
    getCandidaturas(vagaId: number): Promise<({
        vaga: {
            acessibilidades: ({
                acessibilidade: {
                    id: number;
                    nome: string | null;
                    descricao: string;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                createdAt: Date;
                updatedAt: Date;
                vagaId: number;
                acessibilidadeId: number;
                observacoes: string | null;
                disponivel: boolean;
                qualidade: string;
            })[];
            subtiposAceitos: ({
                subtipo: {
                    tipo: {
                        id: number;
                        nome: string;
                        descricao: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        cor: string | null;
                    };
                } & {
                    id: number;
                    nome: string;
                    createdAt: Date;
                    updatedAt: Date;
                    tipoId: number;
                };
            } & {
                vagaId: number;
                subtipoId: number;
            })[];
        } & {
            id: number;
            descricao: string;
            createdAt: Date;
            updatedAt: Date;
            empresaId: number;
            escolaridade: string;
            isActive: boolean;
            titulo: string;
            beneficios: string | null;
            regimeTrabalho: string | null;
            tipo: string | null;
            views: number;
        };
        candidato: {
            id: number;
            nome: string;
            escolaridade: string | null;
            acessibilidades: ({
                acessibilidade: {
                    id: number;
                    descricao: string;
                };
            } & {
                createdAt: Date;
                updatedAt: Date;
                candidatoId: number;
                acessibilidadeId: number;
                observacoes: string | null;
                prioridade: string;
            })[];
            email: string | null;
            telefone: string | null;
            profileData: import("@prisma/client/runtime/library").JsonValue;
            curriculoUrl: string | null;
            cidade: string | null;
            dataNascimento: Date | null;
            estado: string | null;
            genero: string | null;
            linkedin: string | null;
            portfolio: string | null;
            avatarUrl: string | null;
            recursosAssistivos: ({
                recurso: {
                    mitigacoes: {
                        barreiraId: number;
                        recursoId: number;
                        eficiencia: string | null;
                    }[];
                } & {
                    id: number;
                    nome: string;
                    descricao: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                candidatoId: number;
                recursoId: number;
                usoFrequencia: string | null;
                impactoMobilidade: string | null;
            })[];
            subtipos: ({
                barreiras: ({
                    barreira: {
                        id: number;
                        descricao: string;
                        createdAt: Date;
                        updatedAt: Date;
                    };
                } & {
                    subtipoId: number;
                    candidatoId: number;
                    barreiraId: number;
                })[];
                subtipo: {
                    tipo: {
                        id: number;
                        nome: string;
                        descricao: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        cor: string | null;
                    };
                } & {
                    id: number;
                    nome: string;
                    createdAt: Date;
                    updatedAt: Date;
                    tipoId: number;
                };
            } & {
                subtipoId: number;
                candidatoId: number;
                acessibilidadeId: number | null;
                observacoes: string | null;
                prioridade: string | null;
            })[];
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        vagaId: number;
        candidatoId: number;
        status: string;
    })[]>;
    update(vagaId: number, dados: {
        titulo?: string;
        descricao?: string;
        escolaridade?: string;
        tipo?: string;
        regimeTrabalho?: string;
        beneficios?: string;
        isActive?: boolean;
    }): import("@prisma/client").Prisma.Prisma__VagaClient<{
        empresa: {
            id: number;
            nome: string;
            companyData: import("@prisma/client/runtime/library").JsonValue;
        };
    } & {
        id: number;
        descricao: string;
        createdAt: Date;
        updatedAt: Date;
        empresaId: number;
        escolaridade: string;
        isActive: boolean;
        titulo: string;
        beneficios: string | null;
        regimeTrabalho: string | null;
        tipo: string | null;
        views: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    incrementViews(vagaId: number): import("@prisma/client").Prisma.Prisma__VagaClient<{
        id: number;
        views: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
};
//# sourceMappingURL=vagas.repo.d.ts.map