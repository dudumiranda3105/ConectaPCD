export declare const SubtiposService: {
    list(): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        nome: string;
        createdAt: Date;
        updatedAt: Date;
        tipoId: number;
    }[]>;
    findDeep(id: number): Promise<{
        id: number;
        nome: string;
        tipo: {
            id: number;
            nome: string;
        };
        barreiras: {
            id: number;
            descricao: string;
            acessibilidades: {
                id: number;
                descricao: string;
            }[];
        }[];
    }>;
    create(nome: string, tipoId: number): Promise<{
        id: number;
        nome: string;
        createdAt: Date;
        updatedAt: Date;
        tipoId: number;
    }>;
    connectBarreira(subtipoId: number, barreiraId: number): Promise<({
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
    disconnectBarreira(subtipoId: number, barreiraId: number): Promise<({
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
//# sourceMappingURL=subtipos.service.d.ts.map