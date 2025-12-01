export declare const CandidatoSubtiposService: {
    listarPorCandidato(candidatoId: number): Promise<({
        subtipo: {
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
    })[]>;
    vincular(candidatoId: number, subtipoIds: number[]): Promise<{
        ok: boolean;
    }>;
};
//# sourceMappingURL=candidatoSubtipos.service.d.ts.map