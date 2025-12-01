export declare const CandidaturasRepo: {
    create(candidatoId: number, vagaId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        vagaId: number;
        candidatoId: number;
        status: string;
    }>;
    findByCandidatoAndVaga(candidatoId: number, vagaId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        vagaId: number;
        candidatoId: number;
        status: string;
    } | null>;
    listByCandidato(candidatoId: number): Promise<({
        vaga: {
            empresa: {
                id: number;
                nome: string;
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
        createdAt: Date;
        updatedAt: Date;
        vagaId: number;
        candidatoId: number;
        status: string;
    })[]>;
    listByVaga(vagaId: number): Promise<({
        candidato: {
            id: number;
            nome: string;
            email: string | null;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        vagaId: number;
        candidatoId: number;
        status: string;
    })[]>;
    updateStatus(id: number, status: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        vagaId: number;
        candidatoId: number;
        status: string;
    }>;
    listByEmpresaAndStatus(empresaId: number, status: string): Promise<({
        vaga: {
            id: number;
            descricao: string;
            titulo: string;
            regimeTrabalho: string | null;
        };
        candidato: {
            id: number;
            nome: string;
            escolaridade: string | null;
            email: string | null;
            telefone: string | null;
            curriculoUrl: string | null;
            cidade: string | null;
            estado: string | null;
            avatarUrl: string | null;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        vagaId: number;
        candidatoId: number;
        status: string;
    })[]>;
};
//# sourceMappingURL=candidaturas.repo.d.ts.map