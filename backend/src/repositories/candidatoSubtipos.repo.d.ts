export declare const CandidatoSubtiposRepo: {
    findByCandidato(candidatoId: number): import("@prisma/client").Prisma.PrismaPromise<({
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
    create(candidatoId: number, subtipoIds: number[]): import("@prisma/client").Prisma.PrismaPromise<import("@prisma/client").Prisma.BatchPayload>;
};
//# sourceMappingURL=candidatoSubtipos.repo.d.ts.map