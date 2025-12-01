export declare const TiposRepo: {
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
    create(nome: string, descricao?: string, cor?: string): import("@prisma/client").Prisma.Prisma__TipoDeficienciaClient<{
        id: number;
        nome: string;
        descricao: string | null;
        createdAt: Date;
        updatedAt: Date;
        cor: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, nome: string, descricao?: string, cor?: string): import("@prisma/client").Prisma.Prisma__TipoDeficienciaClient<{
        id: number;
        nome: string;
        descricao: string | null;
        createdAt: Date;
        updatedAt: Date;
        cor: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findById(id: number): import("@prisma/client").Prisma.Prisma__TipoDeficienciaClient<{
        id: number;
        nome: string;
        descricao: string | null;
        createdAt: Date;
        updatedAt: Date;
        cor: string | null;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    delete(id: number): Promise<{
        id: number;
        nome: string;
        descricao: string | null;
        createdAt: Date;
        updatedAt: Date;
        cor: string | null;
    }>;
};
//# sourceMappingURL=tipos.repo.d.ts.map