export declare const CandidatoSubtipoBarreirasRepo: {
    findByCandidato(candidatoId: number): import("@prisma/client").Prisma.PrismaPromise<({
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
    create(candidatoId: number, subtipoId: number, barreiraIds: number[]): import("@prisma/client").Prisma.PrismaPromise<import("@prisma/client").Prisma.BatchPayload>;
};
//# sourceMappingURL=candidatoSubtipoBarreiras.repo.d.ts.map