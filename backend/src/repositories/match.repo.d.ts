export declare const MatchRepo: {
    getCandidatoComBarreiras(candidatoId: number): Promise<({
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
            candidatoId: number;
            acessibilidadeId: number;
            observacoes: string | null;
            prioridade: string;
        })[];
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
            subtipoId: number;
            candidatoId: number;
            acessibilidadeId: number | null;
            observacoes: string | null;
            prioridade: string | null;
        })[];
    } & {
        id: number;
        nome: string;
        createdAt: Date;
        updatedAt: Date;
        escolaridade: string | null;
        isActive: boolean;
        email: string | null;
        cpf: string | null;
        telefone: string | null;
        profileData: import("@prisma/client/runtime/library").JsonValue | null;
        curriculoUrl: string | null;
        laudoMedicoUrl: string | null;
        cep: string | null;
        cidade: string | null;
        dataNascimento: Date | null;
        endereco: string | null;
        estado: string | null;
        genero: string | null;
        linkedin: string | null;
        password: string | null;
        portfolio: string | null;
        avatarUrl: string | null;
        experiencias: string | null;
    }) | null>;
    getVagasComDetalhes(): Promise<({
        empresa: {
            id: number;
            nome: string;
            descricao: string | null;
            createdAt: Date;
            updatedAt: Date;
            barreiras: string | null;
            isActive: boolean;
            email: string | null;
            telefone: string | null;
            cep: string | null;
            cidade: string | null;
            endereco: string | null;
            estado: string | null;
            password: string | null;
            cnpj: string | null;
            companyData: import("@prisma/client/runtime/library").JsonValue | null;
            nomeFantasia: string | null;
            porte: string | null;
            razaoSocial: string | null;
            setor: string | null;
            site: string | null;
            acessibilidadesOferecidas: string | null;
            bairro: string | null;
            complemento: string | null;
            logradouro: string | null;
            numero: string | null;
            outrasBarreiras: string | null;
            outrosRecursosAcessibilidade: string | null;
            politicasInclusao: string | null;
            possuiSistemaInterno: boolean | null;
            responsavelCargo: string | null;
            responsavelEmail: string | null;
            responsavelNome: string | null;
            responsavelTelefone: string | null;
        };
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
    })[]>;
    getMapaBarreiraAcessibilidade(): Promise<{
        acessibilidadeId: number;
        barreiraId: number;
    }[]>;
    saveMatchScore(data: {
        candidatoId: number;
        vagaId: number;
        scoreTotal: number;
        scoreAcessibilidades: number;
        scoreSubtipos: number;
        acessibilidadesAtendidas: number;
        acessibilidadesTotal: number;
        detalhes: any;
    }): Promise<{
        id: number;
        updatedAt: Date;
        vagaId: number;
        candidatoId: number;
        scoreTotal: number;
        scoreAcessibilidades: number;
        scoreSubtipos: number;
        acessibilidadesAtendidas: number;
        acessibilidadesTotal: number;
        detalhes: import("@prisma/client/runtime/library").JsonValue | null;
        calculadoEm: Date;
    }>;
    getMatchScores(candidatoId: number): Promise<({
        vaga: {
            empresa: {
                id: number;
                nome: string;
                descricao: string | null;
                createdAt: Date;
                updatedAt: Date;
                barreiras: string | null;
                isActive: boolean;
                email: string | null;
                telefone: string | null;
                cep: string | null;
                cidade: string | null;
                endereco: string | null;
                estado: string | null;
                password: string | null;
                cnpj: string | null;
                companyData: import("@prisma/client/runtime/library").JsonValue | null;
                nomeFantasia: string | null;
                porte: string | null;
                razaoSocial: string | null;
                setor: string | null;
                site: string | null;
                acessibilidadesOferecidas: string | null;
                bairro: string | null;
                complemento: string | null;
                logradouro: string | null;
                numero: string | null;
                outrasBarreiras: string | null;
                outrosRecursosAcessibilidade: string | null;
                politicasInclusao: string | null;
                possuiSistemaInterno: boolean | null;
                responsavelCargo: string | null;
                responsavelEmail: string | null;
                responsavelNome: string | null;
                responsavelTelefone: string | null;
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
        };
    } & {
        id: number;
        updatedAt: Date;
        vagaId: number;
        candidatoId: number;
        scoreTotal: number;
        scoreAcessibilidades: number;
        scoreSubtipos: number;
        acessibilidadesAtendidas: number;
        acessibilidadesTotal: number;
        detalhes: import("@prisma/client/runtime/library").JsonValue | null;
        calculadoEm: Date;
    })[]>;
};
//# sourceMappingURL=match.repo.d.ts.map