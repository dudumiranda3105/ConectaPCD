export type ActivityType = 'CANDIDATURA' | 'VAGA' | 'CADASTRO' | 'CONTRATACAO' | 'REJEICAO' | 'LOGIN' | 'PERFIL' | 'CURRICULO' | 'LAUDO' | 'CHAT' | 'MATCH' | 'VAGA_FECHADA' | 'APROVACAO_VAGA' | 'VISUALIZACAO';
export type UserType = 'CANDIDATO' | 'EMPRESA' | 'ADMIN';
interface LogActivityParams {
    tipo: ActivityType;
    acao: string;
    usuarioNome: string;
    usuarioTipo: UserType;
    usuarioId?: number;
    entidadeId?: number;
    detalhes?: any;
}
export declare const ActivityLogService: {
    /**
     * Registra uma nova atividade no log
     */
    log(params: LogActivityParams): Promise<void>;
    /**
     * Busca atividades recentes com paginação
     */
    getRecent(limit?: number): Promise<{
        id: number;
        createdAt: Date;
        tipo: string;
        detalhes: import("@prisma/client/runtime/library").JsonValue | null;
        acao: string;
        usuarioNome: string;
        usuarioTipo: string;
        usuarioId: number | null;
        entidadeId: number | null;
    }[]>;
    /**
     * Busca atividades por tipo
     */
    getByType(tipo: ActivityType, limit?: number): Promise<{
        id: number;
        createdAt: Date;
        tipo: string;
        detalhes: import("@prisma/client/runtime/library").JsonValue | null;
        acao: string;
        usuarioNome: string;
        usuarioTipo: string;
        usuarioId: number | null;
        entidadeId: number | null;
    }[]>;
    /**
     * Busca atividades de um usuário específico
     */
    getByUser(usuarioId: number, usuarioTipo: UserType, limit?: number): Promise<{
        id: number;
        createdAt: Date;
        tipo: string;
        detalhes: import("@prisma/client/runtime/library").JsonValue | null;
        acao: string;
        usuarioNome: string;
        usuarioTipo: string;
        usuarioId: number | null;
        entidadeId: number | null;
    }[]>;
    logCadastro(nome: string, tipo: "CANDIDATO" | "EMPRESA", id: number): Promise<void>;
    logLogin(nome: string, tipo: UserType, id: number): Promise<void>;
    logCandidatura(candidatoNome: string, candidatoId: number, vagaTitulo: string, vagaId: number): Promise<void>;
    logNovaVaga(empresaNome: string, empresaId: number, vagaTitulo: string, vagaId: number): Promise<void>;
    logContratacao(empresaNome: string, empresaId: number, candidatoNome: string, vagaTitulo: string, candidaturaId: number): Promise<void>;
    logRejeicao(empresaNome: string, empresaId: number, candidatoNome: string, vagaTitulo: string, candidaturaId: number): Promise<void>;
    logPerfilAtualizado(nome: string, tipo: UserType, id: number): Promise<void>;
    logCurriculoEnviado(nome: string, candidatoId: number): Promise<void>;
    logLaudoEnviado(nome: string, candidatoId: number): Promise<void>;
    logMensagemChat(remetenteNome: string, remetenteTipo: UserType, remetenteId: number, destinatarioNome: string): Promise<void>;
    logVagaFechada(empresaNome: string, empresaId: number, vagaTitulo: string, vagaId: number): Promise<void>;
    logAprovacaoVaga(adminNome: string, adminId: number, vagaTitulo: string, vagaId: number, aprovada: boolean): Promise<void>;
    logVisualizacaoVaga(candidatoNome: string, candidatoId: number, vagaTitulo: string, vagaId: number): Promise<void>;
};
export {};
//# sourceMappingURL=activityLog.service.d.ts.map