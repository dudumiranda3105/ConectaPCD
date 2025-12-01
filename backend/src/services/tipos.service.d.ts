export declare const TiposService: {
    list(): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        nome: string;
        descricao: string | null;
        createdAt: Date;
        updatedAt: Date;
        cor: string | null;
    }[]>;
    listWithSubtipos(): import("@prisma/client").Prisma.PrismaPromise<({
        subtipos: {
            id: number;
            nome: string;
            createdAt: Date;
            updatedAt: Date;
            tipoId: number;
        }[];
    } & {
        id: number;
        nome: string;
        descricao: string | null;
        createdAt: Date;
        updatedAt: Date;
        cor: string | null;
    })[]>;
    create(nome: string, descricao?: string, cor?: string): Promise<{
        id: number;
        nome: string;
        descricao: string | null;
        createdAt: Date;
        updatedAt: Date;
        cor: string | null;
    }>;
    update(id: number, nome: string, descricao?: string, cor?: string): Promise<{
        id: number;
        nome: string;
        descricao: string | null;
        createdAt: Date;
        updatedAt: Date;
        cor: string | null;
    }>;
    delete(id: number): Promise<{
        id: number;
        nome: string;
        descricao: string | null;
        createdAt: Date;
        updatedAt: Date;
        cor: string | null;
    }>;
};
//# sourceMappingURL=tipos.service.d.ts.map