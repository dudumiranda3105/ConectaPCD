export declare const AcessRepo: {
    list(): import("@prisma/client").Prisma.PrismaPromise<({
        barreiras: ({
            barreira: {
                id: number;
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
        nome: string | null;
        descricao: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    create(nome: string | undefined, descricao: string): import("@prisma/client").Prisma.Prisma__AcessibilidadeClient<{
        id: number;
        nome: string | null;
        descricao: string;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findById(id: number): import("@prisma/client").Prisma.Prisma__AcessibilidadeClient<{
        id: number;
        nome: string | null;
        descricao: string;
        createdAt: Date;
        updatedAt: Date;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findByDescricao(descricao: string): import("@prisma/client").Prisma.Prisma__AcessibilidadeClient<{
        id: number;
        nome: string | null;
        descricao: string;
        createdAt: Date;
        updatedAt: Date;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    listBarreiras(id: number): import("@prisma/client").Prisma.Prisma__AcessibilidadeClient<({
        barreiras: ({
            barreira: {
                id: number;
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
        nome: string | null;
        descricao: string;
        createdAt: Date;
        updatedAt: Date;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    addBarreira(acessibilidadeId: number, barreiraId: number): Promise<({
        barreiras: ({
            barreira: {
                id: number;
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
        nome: string | null;
        descricao: string;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    removeBarreira(acessibilidadeId: number, barreiraId: number): Promise<({
        barreiras: ({
            barreira: {
                id: number;
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
        nome: string | null;
        descricao: string;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    delete(id: number): Promise<{
        id: number;
        nome: string | null;
        descricao: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
};
//# sourceMappingURL=acessibilidades.repo.d.ts.map