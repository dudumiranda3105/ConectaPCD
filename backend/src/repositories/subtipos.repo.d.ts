export declare const SubtiposRepo: {
    list(): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        nome: string;
        createdAt: Date;
        updatedAt: Date;
        tipoId: number;
    }[]>;
    findById(id: number): import("@prisma/client").Prisma.Prisma__SubtipoDeficienciaClient<{
        id: number;
        nome: string;
        createdAt: Date;
        updatedAt: Date;
        tipoId: number;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findDeepById(id: number): import("@prisma/client").Prisma.Prisma__SubtipoDeficienciaClient<({
        barreiras: ({
            barreira: {
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
            };
        } & {
            subtipoId: number;
            barreiraId: number;
        })[];
        tipo: {
            id: number;
            nome: string;
            descricao: string | null;
            createdAt: Date;
            updatedAt: Date;
            cor: string | null;
        };
    } & {
        id: number;
        nome: string;
        createdAt: Date;
        updatedAt: Date;
        tipoId: number;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    create(nome: string, tipoId: number): import("@prisma/client").Prisma.Prisma__SubtipoDeficienciaClient<{
        id: number;
        nome: string;
        createdAt: Date;
        updatedAt: Date;
        tipoId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    addBarreira(subtipoId: number, barreiraId: number): Promise<({
        barreiras: ({
            barreira: {
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
            };
        } & {
            subtipoId: number;
            barreiraId: number;
        })[];
        tipo: {
            id: number;
            nome: string;
            descricao: string | null;
            createdAt: Date;
            updatedAt: Date;
            cor: string | null;
        };
    } & {
        id: number;
        nome: string;
        createdAt: Date;
        updatedAt: Date;
        tipoId: number;
    }) | null>;
    removeBarreira(subtipoId: number, barreiraId: number): Promise<({
        barreiras: ({
            barreira: {
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
            };
        } & {
            subtipoId: number;
            barreiraId: number;
        })[];
        tipo: {
            id: number;
            nome: string;
            descricao: string | null;
            createdAt: Date;
            updatedAt: Date;
            cor: string | null;
        };
    } & {
        id: number;
        nome: string;
        createdAt: Date;
        updatedAt: Date;
        tipoId: number;
    }) | null>;
    delete(id: number): Promise<{
        id: number;
        nome: string;
        createdAt: Date;
        updatedAt: Date;
        tipoId: number;
    }>;
};
//# sourceMappingURL=subtipos.repo.d.ts.map