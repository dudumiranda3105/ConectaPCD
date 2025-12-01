export declare const EmpresasService: {
    criarEmpresa(nome: string, cnpj?: string, email?: string): Promise<{
        id: number;
        nome: string;
        descricao: string | null;
        createdAt: Date;
        updatedAt: Date;
        barreiras: string | null;
        isActive: boolean;
        email: string | null;
        telefone: string | null;
        cep: string | null;
        cidade: string | null;
        endereco: string | null;
        estado: string | null;
        password: string | null;
        cnpj: string | null;
        companyData: import("@prisma/client/runtime/library").JsonValue | null;
        nomeFantasia: string | null;
        porte: string | null;
        razaoSocial: string | null;
        setor: string | null;
        site: string | null;
        acessibilidadesOferecidas: string | null;
        bairro: string | null;
        complemento: string | null;
        logradouro: string | null;
        numero: string | null;
        outrasBarreiras: string | null;
        outrosRecursosAcessibilidade: string | null;
        politicasInclusao: string | null;
        possuiSistemaInterno: boolean | null;
        responsavelCargo: string | null;
        responsavelEmail: string | null;
        responsavelNome: string | null;
        responsavelTelefone: string | null;
    }>;
    getStats(empresaId: number): Promise<{
        totalJobs: number;
        activeJobs: number;
        closedJobs: number;
        totalApplications: number;
        applicationsByStatus: any;
        jobsByRegime: any;
        totalViews: number;
    }>;
    listarCandidaturasEmProcesso(empresaId: number): Promise<({
        vaga: {
            id: number;
            descricao: string;
            titulo: string;
            regimeTrabalho: string | null;
        };
        candidato: {
            id: number;
            nome: string;
            escolaridade: string | null;
            email: string | null;
            telefone: string | null;
            curriculoUrl: string | null;
            cidade: string | null;
            estado: string | null;
            avatarUrl: string | null;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        vagaId: number;
        candidatoId: number;
        status: string;
    })[]>;
    listarCandidaturasAprovadas(empresaId: number): Promise<({
        vaga: {
            id: number;
            descricao: string;
            titulo: string;
            regimeTrabalho: string | null;
        };
        candidato: {
            id: number;
            nome: string;
            escolaridade: string | null;
            email: string | null;
            telefone: string | null;
            curriculoUrl: string | null;
            cidade: string | null;
            estado: string | null;
            avatarUrl: string | null;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        vagaId: number;
        candidatoId: number;
        status: string;
    })[]>;
};
//# sourceMappingURL=empresas.service.d.ts.map