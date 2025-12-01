"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityLogService = void 0;
const prisma_1 = require("../repositories/prisma");
exports.ActivityLogService = {
    /**
     * Registra uma nova atividade no log
     */
    async log(params) {
        try {
            await prisma_1.prisma.activityLog.create({
                data: {
                    tipo: params.tipo,
                    acao: params.acao,
                    usuarioNome: params.usuarioNome,
                    usuarioTipo: params.usuarioTipo,
                    usuarioId: params.usuarioId,
                    entidadeId: params.entidadeId,
                    detalhes: params.detalhes,
                },
            });
        }
        catch (error) {
            // Log silencioso - não queremos que erros de log afetem a aplicação
            console.error('[ActivityLog] Erro ao registrar atividade:', error);
        }
    },
    /**
     * Busca atividades recentes com paginação
     */
    async getRecent(limit = 20) {
        return prisma_1.prisma.activityLog.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
    },
    /**
     * Busca atividades por tipo
     */
    async getByType(tipo, limit = 20) {
        return prisma_1.prisma.activityLog.findMany({
            where: { tipo },
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
    },
    /**
     * Busca atividades de um usuário específico
     */
    async getByUser(usuarioId, usuarioTipo, limit = 20) {
        return prisma_1.prisma.activityLog.findMany({
            where: { usuarioId, usuarioTipo },
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
    },
    // === Métodos helper para facilitar o registro de atividades específicas ===
    async logCadastro(nome, tipo, id) {
        await this.log({
            tipo: 'CADASTRO',
            acao: tipo === 'CANDIDATO' ? 'se cadastrou como candidato' : 'se cadastrou como empresa',
            usuarioNome: nome,
            usuarioTipo: tipo,
            usuarioId: id,
        });
    },
    async logLogin(nome, tipo, id) {
        await this.log({
            tipo: 'LOGIN',
            acao: 'fez login na plataforma',
            usuarioNome: nome,
            usuarioTipo: tipo,
            usuarioId: id,
        });
    },
    async logCandidatura(candidatoNome, candidatoId, vagaTitulo, vagaId) {
        await this.log({
            tipo: 'CANDIDATURA',
            acao: `se candidatou à vaga "${vagaTitulo}"`,
            usuarioNome: candidatoNome,
            usuarioTipo: 'CANDIDATO',
            usuarioId: candidatoId,
            entidadeId: vagaId,
            detalhes: { vagaTitulo },
        });
    },
    async logNovaVaga(empresaNome, empresaId, vagaTitulo, vagaId) {
        await this.log({
            tipo: 'VAGA',
            acao: `publicou a vaga "${vagaTitulo}"`,
            usuarioNome: empresaNome,
            usuarioTipo: 'EMPRESA',
            usuarioId: empresaId,
            entidadeId: vagaId,
            detalhes: { vagaTitulo },
        });
    },
    async logContratacao(empresaNome, empresaId, candidatoNome, vagaTitulo, candidaturaId) {
        await this.log({
            tipo: 'CONTRATACAO',
            acao: `contratou ${candidatoNome} para a vaga "${vagaTitulo}"`,
            usuarioNome: empresaNome,
            usuarioTipo: 'EMPRESA',
            usuarioId: empresaId,
            entidadeId: candidaturaId,
            detalhes: { candidatoNome, vagaTitulo },
        });
    },
    async logRejeicao(empresaNome, empresaId, candidatoNome, vagaTitulo, candidaturaId) {
        await this.log({
            tipo: 'REJEICAO',
            acao: `rejeitou a candidatura de ${candidatoNome} para "${vagaTitulo}"`,
            usuarioNome: empresaNome,
            usuarioTipo: 'EMPRESA',
            usuarioId: empresaId,
            entidadeId: candidaturaId,
            detalhes: { candidatoNome, vagaTitulo },
        });
    },
    async logPerfilAtualizado(nome, tipo, id) {
        await this.log({
            tipo: 'PERFIL',
            acao: 'atualizou seu perfil',
            usuarioNome: nome,
            usuarioTipo: tipo,
            usuarioId: id,
        });
    },
    async logCurriculoEnviado(nome, candidatoId) {
        await this.log({
            tipo: 'CURRICULO',
            acao: 'enviou um novo currículo',
            usuarioNome: nome,
            usuarioTipo: 'CANDIDATO',
            usuarioId: candidatoId,
        });
    },
    async logLaudoEnviado(nome, candidatoId) {
        await this.log({
            tipo: 'LAUDO',
            acao: 'enviou seu laudo médico PCD',
            usuarioNome: nome,
            usuarioTipo: 'CANDIDATO',
            usuarioId: candidatoId,
        });
    },
    async logMensagemChat(remetenteNome, remetenteTipo, remetenteId, destinatarioNome) {
        await this.log({
            tipo: 'CHAT',
            acao: `enviou uma mensagem para ${destinatarioNome}`,
            usuarioNome: remetenteNome,
            usuarioTipo: remetenteTipo,
            usuarioId: remetenteId,
            detalhes: { destinatarioNome },
        });
    },
    async logVagaFechada(empresaNome, empresaId, vagaTitulo, vagaId) {
        await this.log({
            tipo: 'VAGA_FECHADA',
            acao: `fechou a vaga "${vagaTitulo}"`,
            usuarioNome: empresaNome,
            usuarioTipo: 'EMPRESA',
            usuarioId: empresaId,
            entidadeId: vagaId,
            detalhes: { vagaTitulo },
        });
    },
    async logAprovacaoVaga(adminNome, adminId, vagaTitulo, vagaId, aprovada) {
        await this.log({
            tipo: 'APROVACAO_VAGA',
            acao: aprovada ? `aprovou a vaga "${vagaTitulo}"` : `reprovou a vaga "${vagaTitulo}"`,
            usuarioNome: adminNome,
            usuarioTipo: 'ADMIN',
            usuarioId: adminId,
            entidadeId: vagaId,
            detalhes: { vagaTitulo, aprovada },
        });
    },
    async logVisualizacaoVaga(candidatoNome, candidatoId, vagaTitulo, vagaId) {
        await this.log({
            tipo: 'VISUALIZACAO',
            acao: `visualizou a vaga "${vagaTitulo}"`,
            usuarioNome: candidatoNome,
            usuarioTipo: 'CANDIDATO',
            usuarioId: candidatoId,
            entidadeId: vagaId,
            detalhes: { vagaTitulo },
        });
    },
};
//# sourceMappingURL=activityLog.service.js.map