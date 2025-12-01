interface BarreiraInfo {
    id: number;
    descricao: string;
    atendida: boolean;
    mitigadaPorRecurso: boolean;
    eficienciaMitigacao?: string;
    acessibilidadesNecessarias: string[];
    acessibilidadesOferecidas: string[];
}
interface MatchResult {
    vaga: any;
    scoreTotal: number;
    scoreAcessibilidades: number;
    scoreSubtipos: number;
    scoreRecursosAssistivos: number;
    compativel: boolean;
    detalhes: {
        subtiposAceitos: number;
        subtiposTotal: number;
        barreirasAtendidas: number;
        barreirasMitigadas: number;
        barreirasTotal: number;
        barreirasPorSubtipo: Array<{
            subtipo: string;
            barreiras: BarreiraInfo[];
        }>;
    };
}
export declare function calcularMatchScore(candidatoId: number): Promise<MatchResult[]>;
export declare function encontrarVagasCompativeis(candidatoId: number): Promise<any[]>;
export declare function getMatchScoresFromCache(candidatoId: number): Promise<({
    vaga: {
        empresa: {
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
    };
} & {
    id: number;
    updatedAt: Date;
    vagaId: number;
    candidatoId: number;
    scoreTotal: number;
    scoreAcessibilidades: number;
    scoreSubtipos: number;
    acessibilidadesAtendidas: number;
    acessibilidadesTotal: number;
    detalhes: import("@prisma/client/runtime/library").JsonValue | null;
    calculadoEm: Date;
})[]>;
export {};
//# sourceMappingURL=match.service.d.ts.map