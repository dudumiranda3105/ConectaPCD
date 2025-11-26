import { prisma } from '../repositories/prisma';

export type ActivityType = 
  | 'CANDIDATURA'      // Candidato se candidatou a uma vaga
  | 'VAGA'             // Nova vaga criada
  | 'CADASTRO'         // Novo usuário cadastrado
  | 'CONTRATACAO'      // Candidato foi contratado
  | 'REJEICAO'         // Candidato foi rejeitado
  | 'LOGIN'            // Usuário fez login
  | 'PERFIL'           // Perfil atualizado
  | 'CURRICULO'        // Currículo enviado
  | 'LAUDO'            // Laudo médico enviado
  | 'CHAT'             // Mensagem enviada no chat
  | 'MATCH'            // Match calculado
  | 'VAGA_FECHADA'     // Vaga foi fechada
  | 'APROVACAO_VAGA'   // Vaga foi aprovada pelo admin
  | 'VISUALIZACAO';    // Visualização de vaga

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

export const ActivityLogService = {
  /**
   * Registra uma nova atividade no log
   */
  async log(params: LogActivityParams) {
    try {
      await prisma.activityLog.create({
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
    } catch (error) {
      // Log silencioso - não queremos que erros de log afetem a aplicação
      console.error('[ActivityLog] Erro ao registrar atividade:', error);
    }
  },

  /**
   * Busca atividades recentes com paginação
   */
  async getRecent(limit: number = 20) {
    return prisma.activityLog.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  },

  /**
   * Busca atividades por tipo
   */
  async getByType(tipo: ActivityType, limit: number = 20) {
    return prisma.activityLog.findMany({
      where: { tipo },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  },

  /**
   * Busca atividades de um usuário específico
   */
  async getByUser(usuarioId: number, usuarioTipo: UserType, limit: number = 20) {
    return prisma.activityLog.findMany({
      where: { usuarioId, usuarioTipo },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  },

  // === Métodos helper para facilitar o registro de atividades específicas ===

  async logCadastro(nome: string, tipo: 'CANDIDATO' | 'EMPRESA', id: number) {
    await this.log({
      tipo: 'CADASTRO',
      acao: tipo === 'CANDIDATO' ? 'se cadastrou como candidato' : 'se cadastrou como empresa',
      usuarioNome: nome,
      usuarioTipo: tipo,
      usuarioId: id,
    });
  },

  async logLogin(nome: string, tipo: UserType, id: number) {
    await this.log({
      tipo: 'LOGIN',
      acao: 'fez login na plataforma',
      usuarioNome: nome,
      usuarioTipo: tipo,
      usuarioId: id,
    });
  },

  async logCandidatura(candidatoNome: string, candidatoId: number, vagaTitulo: string, vagaId: number) {
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

  async logNovaVaga(empresaNome: string, empresaId: number, vagaTitulo: string, vagaId: number) {
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

  async logContratacao(empresaNome: string, empresaId: number, candidatoNome: string, vagaTitulo: string, candidaturaId: number) {
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

  async logRejeicao(empresaNome: string, empresaId: number, candidatoNome: string, vagaTitulo: string, candidaturaId: number) {
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

  async logPerfilAtualizado(nome: string, tipo: UserType, id: number) {
    await this.log({
      tipo: 'PERFIL',
      acao: 'atualizou seu perfil',
      usuarioNome: nome,
      usuarioTipo: tipo,
      usuarioId: id,
    });
  },

  async logCurriculoEnviado(nome: string, candidatoId: number) {
    await this.log({
      tipo: 'CURRICULO',
      acao: 'enviou um novo currículo',
      usuarioNome: nome,
      usuarioTipo: 'CANDIDATO',
      usuarioId: candidatoId,
    });
  },

  async logLaudoEnviado(nome: string, candidatoId: number) {
    await this.log({
      tipo: 'LAUDO',
      acao: 'enviou seu laudo médico PCD',
      usuarioNome: nome,
      usuarioTipo: 'CANDIDATO',
      usuarioId: candidatoId,
    });
  },

  async logMensagemChat(remetenteNome: string, remetenteTipo: UserType, remetenteId: number, destinatarioNome: string) {
    await this.log({
      tipo: 'CHAT',
      acao: `enviou uma mensagem para ${destinatarioNome}`,
      usuarioNome: remetenteNome,
      usuarioTipo: remetenteTipo,
      usuarioId: remetenteId,
      detalhes: { destinatarioNome },
    });
  },

  async logVagaFechada(empresaNome: string, empresaId: number, vagaTitulo: string, vagaId: number) {
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

  async logAprovacaoVaga(adminNome: string, adminId: number, vagaTitulo: string, vagaId: number, aprovada: boolean) {
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

  async logVisualizacaoVaga(candidatoNome: string, candidatoId: number, vagaTitulo: string, vagaId: number) {
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
