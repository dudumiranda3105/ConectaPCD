export declare const CandidaturasService: {
    candidatar(candidatoId: number, vagaId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        vagaId: number;
        candidatoId: number;
        status: string;
    }>;
    listarPorCandidato(candidatoId: number): Promise<({
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
    listarPorVaga(vagaId: number): Promise<({
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
    atualizarStatus(id: number, status: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        vagaId: number;
        candidatoId: number;
        status: string;
    }>;
};
//# sourceMappingURL=candidaturas.service.d.ts.map