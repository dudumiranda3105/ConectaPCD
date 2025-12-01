export declare const BarreirasRepo: {
    list(): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        descricao: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    create(descricao: string): import("@prisma/client").Prisma.Prisma__BarreiraClient<{
        id: number;
        descricao: string;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findById(id: number): import("@prisma/client").Prisma.Prisma__BarreiraClient<{
        id: number;
        descricao: string;
        createdAt: Date;
        updatedAt: Date;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    listAcessibilidades(id: number): import("@prisma/client").Prisma.Prisma__BarreiraClient<({
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
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    addAcessibilidade(barreiraId: number, acessibilidadeId: number): Promise<({
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
    }) | null>;
    removeAcessibilidade(barreiraId: number, acessibilidadeId: number): Promise<({
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
    }) | null>;
};
//# sourceMappingURL=barreiras.repo.d.ts.map