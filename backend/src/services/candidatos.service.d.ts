export declare const CandidatosService: {
    listar(): Promise<({
        subtipos: ({
            subtipo: {
                id: number;
                nome: string;
                createdAt: Date;
                updatedAt: Date;
                tipoId: number;
            };
        } & {
            subtipoId: number;
            candidatoId: number;
            acessibilidadeId: number | null;
            observacoes: string | null;
            prioridade: string | null;
        })[];
    } & {
        id: number;
        nome: string;
        createdAt: Date;
        updatedAt: Date;
        escolaridade: string | null;
        isActive: boolean;
        email: string | null;
        cpf: string | null;
        telefone: string | null;
        profileData: import("@prisma/client/runtime/library").JsonValue | null;
        curriculoUrl: string | null;
        laudoMedicoUrl: string | null;
        cep: string | null;
        cidade: string | null;
        dataNascimento: Date | null;
        endereco: string | null;
        estado: string | null;
        genero: string | null;
        linkedin: string | null;
        password: string | null;
        portfolio: string | null;
        avatarUrl: string | null;
        experiencias: string | null;
    })[]>;
    buscarPorId(id: number): Promise<{
        subtipos: ({
            barreiras: ({
                barreira: {
                    id: number;
                    descricao: string;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                subtipoId: number;
                candidatoId: number;
                barreiraId: number;
            })[];
            subtipo: {
                id: number;
                nome: string;
                createdAt: Date;
                updatedAt: Date;
                tipoId: number;
            };
        } & {
            subtipoId: number;
            candidatoId: number;
            acessibilidadeId: number | null;
            observacoes: string | null;
            prioridade: string | null;
        })[];
    } & {
        id: number;
        nome: string;
        createdAt: Date;
        updatedAt: Date;
        escolaridade: string | null;
        isActive: boolean;
        email: string | null;
        cpf: string | null;
        telefone: string | null;
        profileData: import("@prisma/client/runtime/library").JsonValue | null;
        curriculoUrl: string | null;
        laudoMedicoUrl: string | null;
        cep: string | null;
        cidade: string | null;
        dataNascimento: Date | null;
        endereco: string | null;
        estado: string | null;
        genero: string | null;
        linkedin: string | null;
        password: string | null;
        portfolio: string | null;
        avatarUrl: string | null;
        experiencias: string | null;
    }>;
    criar(data: {
        nome: string;
        email?: string;
        telefone?: string;
        escolaridade: string;
    }): Promise<{
        id: number;
        nome: string;
        createdAt: Date;
        updatedAt: Date;
        escolaridade: string | null;
        isActive: boolean;
        email: string | null;
        cpf: string | null;
        telefone: string | null;
        profileData: import("@prisma/client/runtime/library").JsonValue | null;
        curriculoUrl: string | null;
        laudoMedicoUrl: string | null;
        cep: string | null;
        cidade: string | null;
        dataNascimento: Date | null;
        endereco: string | null;
        estado: string | null;
        genero: string | null;
        linkedin: string | null;
        password: string | null;
        portfolio: string | null;
        avatarUrl: string | null;
        experiencias: string | null;
    }>;
};
//# sourceMappingURL=candidatos.service.d.ts.map