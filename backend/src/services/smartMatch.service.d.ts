/**
 * Sistema de Match Inteligente com Score Ponderado
 * Analisa múltiplos critérios para gerar um score de compatibilidade
 */
export interface ScoreBreakdown {
    categoria: string;
    nome: string;
    score: number;
    peso: number;
    contribuicao: number;
    detalhes: string;
    icon: string;
}
export interface SmartMatchResult {
    candidatoId: number;
    vagaId: number;
    scoreTotal: number;
    scoreNormalizado: number;
    classificacao: 'perfeito' | 'excelente' | 'bom' | 'razoavel' | 'baixo';
    compativel: boolean;
    breakdown: ScoreBreakdown[];
    razoes: string[];
    alertas: string[];
    vaga?: any;
}
export declare const SmartMatchService: {
    /**
     * Calcula match inteligente com múltiplos critérios
     */
    calcularSmartMatch(candidatoId: number, vagaId: number): Promise<SmartMatchResult>;
    /**
     * Score de Acessibilidades - verifica se a vaga atende às necessidades
     * Considera recursos assistivos do candidato que podem mitigar barreiras
     */
    calcularScoreAcessibilidades(candidato: any, vaga: any): {
        score: number;
        detalhes: string;
        razoes: string[];
        alertas: string[];
    };
    /**
     * Score de Subtipos - verifica se a vaga aceita o tipo de deficiência
     */
    calcularScoreSubtipos(candidato: any, vaga: any): {
        score: number;
        detalhes: string;
        razoes: string[];
        alertas: string[];
    };
    /**
     * Score de Escolaridade - compara nível educacional
     */
    calcularScoreEscolaridade(candidato: any, vaga: any): {
        score: number;
        detalhes: string;
        razoes: string[];
        alertas: string[];
    };
    /**
     * Score de Regime de Trabalho - preferências de trabalho
     */
    calcularScoreRegime(candidato: any, vaga: any): {
        score: number;
        detalhes: any;
        razoes: string[];
        alertas: string[];
    };
    /**
     * Score de Localização - proximidade geográfica
     */
    calcularScoreLocalizacao(candidato: any, vaga: any): {
        score: number;
        detalhes: string;
        razoes: string[];
        alertas: string[];
    };
    /**
     * Determina classificação baseada no score
     */
    getClassificacao(score: number): "perfeito" | "excelente" | "bom" | "razoavel" | "baixo";
    /**
     * Busca todas as vagas com smart match para um candidato
     */
    buscarVagasComSmartMatch(candidatoId: number, limite?: number): Promise<SmartMatchResult[]>;
};
//# sourceMappingURL=smartMatch.service.d.ts.map