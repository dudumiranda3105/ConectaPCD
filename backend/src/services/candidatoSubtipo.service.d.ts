export declare const CandidatoSubtipoService: {
    updateDisabilities(candidatoId: number, disabilities: Array<{
        typeId: number;
        subtypeId: number;
        barriers: number[];
    }>, accessibilities?: Array<{
        acessibilidadeId: number;
        prioridade: string;
    }>, assistiveResources?: Array<{
        recursoId: number;
        usoFrequencia: string;
        impactoMobilidade: string;
    }>): Promise<({
        acessibilidades: ({
            acessibilidade: {
                id: number;
                nome: string | null;
                descricao: string;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            createdAt: Date;
            updatedAt: Date;
            candidatoId: number;
            acessibilidadeId: number;
            observacoes: string | null;
            prioridade: string;
        })[];
        recursosAssistivos: ({
            recurso: {
                id: number;
                nome: string;
                descricao: string | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            candidatoId: number;
            recursoId: number;
            usoFrequencia: string | null;
            impactoMobilidade: string | null;
        })[];
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
    }) | null>;
};
//# sourceMappingURL=candidatoSubtipo.service.d.ts.map