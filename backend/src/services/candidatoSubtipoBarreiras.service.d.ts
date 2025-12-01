export declare const CandidatoSubtipoBarreirasService: {
    listarPorCandidato(candidatoId: number): Promise<({
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
    })[]>;
    vincular(candidatoId: number, subtipoId: number, barreiraIds: number[]): Promise<{
        ok: boolean;
    }>;
};
//# sourceMappingURL=candidatoSubtipoBarreiras.service.d.ts.map