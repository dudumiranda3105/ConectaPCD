export declare const AcessService: {
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
    create(nome: string | undefined, descricao: string): Promise<{
        id: number;
        nome: string | null;
        descricao: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByDescricao(descricao: string): Promise<{
        id: number;
        nome: string | null;
        descricao: string;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    listBarreiras(acessibilidadeId: number): import("@prisma/client").Prisma.Prisma__AcessibilidadeClient<({
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
    connect(acessibilidadeId: number, barreiraId: number): Promise<({
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
    disconnect(acessibilidadeId: number, barreiraId: number): Promise<({
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
//# sourceMappingURL=acessibilidades.service.d.ts.map