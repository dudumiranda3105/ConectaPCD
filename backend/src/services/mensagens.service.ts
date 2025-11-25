import { MensagensRepo } from "../repositories/mensagens.repo";

export const MensagensService = {
  // Obter ou criar conversa para uma candidatura
  async getOrCreateConversa(candidaturaId: number) {
    return MensagensRepo.getOrCreateConversa(candidaturaId);
  },

  // Buscar conversa por ID
  async getConversaById(conversaId: number) {
    const conversa = await MensagensRepo.getConversaById(conversaId);
    if (!conversa) {
      throw new Error("Conversa não encontrada");
    }
    return conversa;
  },

  // Listar conversas de um candidato
  async listarConversasCandidato(candidatoId: number) {
    const conversas = await MensagensRepo.listarConversasCandidato(candidatoId);
    
    // Adicionar contagem de não lidas para cada conversa
    const conversasComContagem = await Promise.all(
      conversas.map(async (conversa) => {
        const naoLidas = await MensagensRepo.contarNaoLidas(conversa.id, 'CANDIDATO');
        return { ...conversa, naoLidas };
      })
    );
    
    return conversasComContagem;
  },

  // Listar conversas de uma empresa
  async listarConversasEmpresa(empresaId: number) {
    const conversas = await MensagensRepo.listarConversasEmpresa(empresaId);
    
    // Adicionar contagem de não lidas para cada conversa
    const conversasComContagem = await Promise.all(
      conversas.map(async (conversa) => {
        const naoLidas = await MensagensRepo.contarNaoLidas(conversa.id, 'EMPRESA');
        return { ...conversa, naoLidas };
      })
    );
    
    return conversasComContagem;
  },

  // Enviar mensagem
  async enviarMensagem(conversaId: number, remetenteId: number, tipoRemetente: string, conteudo: string) {
    if (!conteudo || conteudo.trim().length === 0) {
      throw new Error("Conteúdo da mensagem não pode ser vazio");
    }
    
    if (!['CANDIDATO', 'EMPRESA'].includes(tipoRemetente)) {
      throw new Error("Tipo de remetente inválido");
    }
    
    return MensagensRepo.enviarMensagem(conversaId, remetenteId, tipoRemetente, conteudo.trim());
  },

  // Buscar mensagens de uma conversa
  async getMensagens(conversaId: number) {
    return MensagensRepo.getMensagens(conversaId);
  },

  // Marcar mensagens como lidas
  async marcarComoLidas(conversaId: number, tipoLeitor: string) {
    return MensagensRepo.marcarComoLidas(conversaId, tipoLeitor);
  },

  // Contar mensagens não lidas
  async contarNaoLidas(conversaId: number, tipoLeitor: string) {
    return MensagensRepo.contarNaoLidas(conversaId, tipoLeitor);
  },

  // Contar total de mensagens não lidas
  async contarTotalNaoLidas(userId: number, tipoUsuario: string) {
    return MensagensRepo.contarTotalNaoLidas(userId, tipoUsuario);
  }
};
