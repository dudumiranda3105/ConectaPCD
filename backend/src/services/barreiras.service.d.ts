export declare const BarreirasService: {
    list(): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        descricao: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    create(descricao: string): Promise<{
        id: number;
        descricao: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    listAcessibilidades(barreiraId: number): import("@prisma/client").Prisma.Prisma__BarreiraClient<({
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
    connect(barreiraId: number, acessibilidadeId: number): Promise<({
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
    disconnect(barreiraId: number, acessibilidadeId: number): Promise<({
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
//# sourceMappingURL=barreiras.service.d.ts.map