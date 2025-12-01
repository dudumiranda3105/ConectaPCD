interface MatchResult {
    candidatoId: number;
    vagaId: number;
    scoreTotal: number;
    scoreAcessibilidades: number;
    scoreSubtipos: number;
    acessibilidadesAtendidas: number;
    acessibilidadesTotal: number;
    detalhes: {
        atendidas: Array<{
            id: number;
            descricao: string;
            qualidade?: string;
        }>;
        nao_atendidas: Array<{
            id: number;
            descricao: string;
            prioridade: string;
        }>;
        extras: Array<{
            id: number;
            descricao: string;
        }>;
    };
}
export declare const MatchingService: {
    /**
     * Calcula compatibilidade entre um candidato e uma vaga
     */
    calcularMatch(candidatoId: number, vagaId: number): Promise<MatchResult>;
    /**
     * Salva o resultado do matching no banco (caso a tabela MatchScore exista)
     */
    salvarMatch(match: MatchResult): Promise<void>;
    /**
     * Busca as melhores vagas para um candidato
     */
    buscarMelhoresVagas(candidatoId: number, limite?: number): Promise<{
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
        candidatoId: number;
        vagaId: number;
        scoreTotal: number;
        scoreAcessibilidades: number;
        scoreSubtipos: number;
        acessibilidadesAtendidas: number;
        acessibilidadesTotal: number;
        detalhes: {
            atendidas: Array<{
                id: number;
                descricao: string;
                qualidade?: string;
            }>;
            nao_atendidas: Array<{
                id: number;
                descricao: string;
                prioridade: string;
            }>;
            extras: Array<{
                id: number;
                descricao: string;
            }>;
        };
    }[]>;
    /**
     * Busca os melhores candidatos para uma vaga
     */
    buscarMelhoresCandidatos(vagaId: number, limite?: number): Promise<{
        candidato: {
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
        };
        candidatoId: number;
        vagaId: number;
        scoreTotal: number;
        scoreAcessibilidades: number;
        scoreSubtipos: number;
        acessibilidadesAtendidas: number;
        acessibilidadesTotal: number;
        detalhes: {
            atendidas: Array<{
                id: number;
                descricao: string;
                qualidade?: string;
            }>;
            nao_atendidas: Array<{
                id: number;
                descricao: string;
                prioridade: string;
            }>;
            extras: Array<{
                id: number;
                descricao: string;
            }>;
        };
    }[]>;
};
export {};
//# sourceMappingURL=matching.service.d.ts.map