export declare const AssistiveResourcesService: {
    list(): Promise<({
        mitigacoes: {
            barreiraId: number;
            recursoId: number;
            eficiencia: string | null;
        }[];
    } & {
        id: number;
        nome: string;
        descricao: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getById(id: number): Promise<({
        mitigacoes: {
            barreiraId: number;
            recursoId: number;
            eficiencia: string | null;
        }[];
    } & {
        id: number;
        nome: string;
        descricao: string | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    create(nome: string, descricao?: string, mitigacoes?: {
        barreiraId: number;
        eficiencia?: string;
    }[]): Promise<{
        mitigacoes: {
            barreiraId: number;
            recursoId: number;
            eficiencia: string | null;
        }[];
    } & {
        id: number;
        nome: string;
        descricao: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: number, nome: string, descricao?: string, mitigacoes?: {
        barreiraId: number;
        eficiencia?: string;
    }[]): Promise<{
        mitigacoes: {
            barreiraId: number;
            recursoId: number;
            eficiencia: string | null;
        }[];
    } & {
        id: number;
        nome: string;
        descricao: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(id: number): Promise<{
        id: number;
        nome: string;
        descricao: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
};
//# sourceMappingURL=assistiveResources.service.d.ts.map