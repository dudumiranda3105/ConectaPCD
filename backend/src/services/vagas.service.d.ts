export declare const VagasService: {
    listarVagasPublicas(): Promise<({
        empresa: {
            id: number;
            nome: string;
            companyData: import("@prisma/client/runtime/library").JsonValue;
        };
        acessibilidades: ({
            acessibilidade: {
                id: number;
                descricao: string;
            };
        } & {
            createdAt: Date;
            updatedAt: Date;
            vagaId: number;
            acessibilidadeId: number;
            observacoes: string | null;
            disponivel: boolean;
            qualidade: string;
        })[];
        subtiposAceitos: ({
            subtipo: {
                id: number;
                nome: string;
                tipo: {
                    id: number;
                    nome: string;
                };
                tipoId: number;
            };
        } & {
            vagaId: number;
            subtipoId: number;
        })[];
    } & {
        id: number;
        descricao: string;
        createdAt: Date;
        updatedAt: Date;
        empresaId: number;
        escolaridade: string;
        isActive: boolean;
        titulo: string;
        beneficios: string | null;
        regimeTrabalho: string | null;
        tipo: string | null;
        views: number;
    })[]>;
    criarVaga(empresaId: number, titulo: string, descricao: string, escolaridade: string, tipo?: string, regimeTrabalho?: string, beneficios?: string, acessibilidades?: string[], subtiposAceitos?: number[]): Promise<{
        id: number;
        descricao: string;
        createdAt: Date;
        updatedAt: Date;
        empresaId: number;
        escolaridade: string;
        isActive: boolean;
        titulo: string;
        beneficios: string | null;
        regimeTrabalho: string | null;
        tipo: string | null;
        views: number;
    }>;
    vincularSubtipos(vagaId: number, subtipoIds: number[]): Promise<import("@prisma/client").Prisma.BatchPayload | {
        ok: boolean;
        message: string;
    }>;
    vincularAcessibilidades(vagaId: number, acessibilidadeIds: number[]): Promise<import("@prisma/client").Prisma.BatchPayload>;
    listarAcessibilidadesPossiveis(vagaId: number): Promise<{
        id: number;
        nome: string | null;
        descricao: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    listarCandidaturasPorVaga(vagaId: number): Promise<any[]>;
    atualizarVaga(vagaId: number, dados: {
        titulo?: string;
        descricao?: string;
        escolaridade?: string;
        tipo?: string;
        regimeTrabalho?: string;
        beneficios?: string;
        acessibilidades?: string[];
        subtiposAceitos?: number[];
        isActive?: boolean;
    }): Promise<{
        empresa: {
            id: number;
            nome: string;
            companyData: import("@prisma/client/runtime/library").JsonValue;
        };
    } & {
        id: number;
        descricao: string;
        createdAt: Date;
        updatedAt: Date;
        empresaId: number;
        escolaridade: string;
        isActive: boolean;
        titulo: string;
        beneficios: string | null;
        regimeTrabalho: string | null;
        tipo: string | null;
        views: number;
    }>;
    vincularAcessibilidadesPorNome(vagaId: number, nomes: string[]): Promise<void>;
    registrarVisualizacao(vagaId: number): Promise<{
        id: number;
        views: number;
    }>;
};
//# sourceMappingURL=vagas.service.d.ts.map