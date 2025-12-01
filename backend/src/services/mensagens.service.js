"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MensagensService = void 0;
const mensagens_repo_1 = require("../repositories/mensagens.repo");
exports.MensagensService = {
    // Obter ou criar conversa para uma candidatura
    async getOrCreateConversa(candidaturaId) {
        return mensagens_repo_1.MensagensRepo.getOrCreateConversa(candidaturaId);
    },
    // Buscar conversa por ID
    async getConversaById(conversaId) {
        const conversa = await mensagens_repo_1.MensagensRepo.getConversaById(conversaId);
        if (!conversa) {
            throw new Error("Conversa não encontrada");
        }
        return conversa;
    },
    // Listar conversas de um candidato
    async listarConversasCandidato(candidatoId) {
        const conversas = await mensagens_repo_1.MensagensRepo.listarConversasCandidato(candidatoId);
        // Adicionar contagem de não lidas para cada conversa
        const conversasComContagem = await Promise.all(conversas.map(async (conversa) => {
            const naoLidas = await mensagens_repo_1.MensagensRepo.contarNaoLidas(conversa.id, 'CANDIDATO');
            return { ...conversa, naoLidas };
        }));
        return conversasComContagem;
    },
    // Listar conversas de uma empresa
    async listarConversasEmpresa(empresaId) {
        const conversas = await mensagens_repo_1.MensagensRepo.listarConversasEmpresa(empresaId);
        // Adicionar contagem de não lidas para cada conversa
        const conversasComContagem = await Promise.all(conversas.map(async (conversa) => {
            const naoLidas = await mensagens_repo_1.MensagensRepo.contarNaoLidas(conversa.id, 'EMPRESA');
            return { ...conversa, naoLidas };
        }));
        return conversasComContagem;
    },
    // Enviar mensagem
    async enviarMensagem(conversaId, remetenteId, tipoRemetente, conteudo) {
        if (!conteudo || conteudo.trim().length === 0) {
            throw new Error("Conteúdo da mensagem não pode ser vazio");
        }
        if (!['CANDIDATO', 'EMPRESA'].includes(tipoRemetente)) {
            throw new Error("Tipo de remetente inválido");
        }
        return mensagens_repo_1.MensagensRepo.enviarMensagem(conversaId, remetenteId, tipoRemetente, conteudo.trim());
    },
    // Buscar mensagens de uma conversa
    async getMensagens(conversaId) {
        return mensagens_repo_1.MensagensRepo.getMensagens(conversaId);
    },
    // Marcar mensagens como lidas
    async marcarComoLidas(conversaId, tipoLeitor) {
        return mensagens_repo_1.MensagensRepo.marcarComoLidas(conversaId, tipoLeitor);
    },
    // Contar mensagens não lidas
    async contarNaoLidas(conversaId, tipoLeitor) {
        return mensagens_repo_1.MensagensRepo.contarNaoLidas(conversaId, tipoLeitor);
    },
    // Contar total de mensagens não lidas
    async contarTotalNaoLidas(userId, tipoUsuario) {
        return mensagens_repo_1.MensagensRepo.contarTotalNaoLidas(userId, tipoUsuario);
    }
};
//# sourceMappingURL=mensagens.service.js.map