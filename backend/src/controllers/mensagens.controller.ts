import { Request, Response } from "express";
import { MensagensService } from "../services/mensagens.service";
import { prisma } from "../repositories/prisma";
import { ActivityLogService } from "../services/activityLog.service";

export const MensagensController = {
  // Obter ou criar conversa para uma candidatura
  async getOrCreateConversa(req: Request, res: Response) {
    try {
      const candidaturaId = Number(req.params.candidaturaId);
      
      if (isNaN(candidaturaId)) {
        return res.status(400).json({ error: "ID da candidatura inválido" });
      }
      
      const conversa = await MensagensService.getOrCreateConversa(candidaturaId);
      res.json(conversa);
    } catch (error: any) {
      console.error("[MensagensController] Erro ao obter/criar conversa:", error);
      res.status(500).json({ error: error.message || "Erro interno" });
    }
  },

  // Buscar conversa por ID
  async getConversaById(req: Request, res: Response) {
    try {
      const conversaId = Number(req.params.conversaId);
      
      if (isNaN(conversaId)) {
        return res.status(400).json({ error: "ID da conversa inválido" });
      }
      
      const conversa = await MensagensService.getConversaById(conversaId);
      res.json(conversa);
    } catch (error: any) {
      console.error("[MensagensController] Erro ao buscar conversa:", error);
      res.status(error.message === "Conversa não encontrada" ? 404 : 500).json({ error: error.message });
    }
  },

  // Listar conversas de um candidato
  async listarConversasCandidato(req: Request, res: Response) {
    try {
      const candidatoId = Number(req.params.candidatoId);
      
      if (isNaN(candidatoId)) {
        return res.status(400).json({ error: "ID do candidato inválido" });
      }
      
      const conversas = await MensagensService.listarConversasCandidato(candidatoId);
      res.json(conversas);
    } catch (error: any) {
      console.error("[MensagensController] Erro ao listar conversas do candidato:", error);
      res.status(500).json({ error: error.message || "Erro interno" });
    }
  },

  // Listar conversas de uma empresa
  async listarConversasEmpresa(req: Request, res: Response) {
    try {
      const empresaId = Number(req.params.empresaId);
      
      if (isNaN(empresaId)) {
        return res.status(400).json({ error: "ID da empresa inválido" });
      }
      
      const conversas = await MensagensService.listarConversasEmpresa(empresaId);
      res.json(conversas);
    } catch (error: any) {
      console.error("[MensagensController] Erro ao listar conversas da empresa:", error);
      res.status(500).json({ error: error.message || "Erro interno" });
    }
  },

  // Enviar mensagem
  async enviarMensagem(req: Request, res: Response) {
    try {
      const conversaId = Number(req.params.conversaId);
      const { remetenteId, tipoRemetente, conteudo } = req.body;
      
      if (isNaN(conversaId)) {
        return res.status(400).json({ error: "ID da conversa inválido" });
      }
      
      if (!remetenteId || !tipoRemetente || !conteudo) {
        return res.status(400).json({ error: "Dados incompletos" });
      }
      
      const mensagem = await MensagensService.enviarMensagem(
        conversaId,
        Number(remetenteId),
        tipoRemetente,
        conteudo
      );
      
      // Registrar atividade de chat (busca nomes para o log)
      try {
        const conversa = await prisma.conversa.findUnique({
          where: { id: conversaId },
          include: {
            candidatura: {
              include: {
                candidato: { select: { nome: true } },
                vaga: {
                  include: {
                    empresa: { select: { nome: true, nomeFantasia: true, razaoSocial: true } }
                  }
                }
              }
            }
          }
        });
        
        if (conversa) {
          const candidatoNome = conversa.candidatura.candidato.nome;
          const empresaNome = conversa.candidatura.vaga.empresa.nomeFantasia || 
                             conversa.candidatura.vaga.empresa.razaoSocial || 
                             conversa.candidatura.vaga.empresa.nome;
          
          if (tipoRemetente === 'CANDIDATO') {
            await ActivityLogService.logMensagemChat(candidatoNome, 'CANDIDATO', Number(remetenteId), empresaNome);
          } else {
            await ActivityLogService.logMensagemChat(empresaNome, 'EMPRESA', Number(remetenteId), candidatoNome);
          }
        }
      } catch (logError) {
        console.error('[MensagensController] Erro ao registrar log de chat:', logError);
        // Não falha a operação se o log falhar
      }
      
      res.status(201).json(mensagem);
    } catch (error: any) {
      console.error("[MensagensController] Erro ao enviar mensagem:", error);
      res.status(400).json({ error: error.message || "Erro ao enviar mensagem" });
    }
  },

  // Buscar mensagens de uma conversa
  async getMensagens(req: Request, res: Response) {
    try {
      const conversaId = Number(req.params.conversaId);
      
      if (isNaN(conversaId)) {
        return res.status(400).json({ error: "ID da conversa inválido" });
      }
      
      const mensagens = await MensagensService.getMensagens(conversaId);
      res.json(mensagens);
    } catch (error: any) {
      console.error("[MensagensController] Erro ao buscar mensagens:", error);
      res.status(500).json({ error: error.message || "Erro interno" });
    }
  },

  // Marcar mensagens como lidas
  async marcarComoLidas(req: Request, res: Response) {
    try {
      const conversaId = Number(req.params.conversaId);
      const { tipoLeitor } = req.body;
      
      if (isNaN(conversaId)) {
        return res.status(400).json({ error: "ID da conversa inválido" });
      }
      
      if (!tipoLeitor || !['CANDIDATO', 'EMPRESA'].includes(tipoLeitor)) {
        return res.status(400).json({ error: "Tipo de leitor inválido" });
      }
      
      await MensagensService.marcarComoLidas(conversaId, tipoLeitor);
      res.json({ success: true });
    } catch (error: any) {
      console.error("[MensagensController] Erro ao marcar como lidas:", error);
      res.status(500).json({ error: error.message || "Erro interno" });
    }
  },

  // Contar mensagens não lidas
  async contarNaoLidas(req: Request, res: Response) {
    try {
      const { userId, tipoUsuario } = req.query;
      
      if (!userId || !tipoUsuario) {
        return res.status(400).json({ error: "Parâmetros userId e tipoUsuario são obrigatórios" });
      }
      
      if (!['CANDIDATO', 'EMPRESA'].includes(String(tipoUsuario))) {
        return res.status(400).json({ error: "Tipo de usuário inválido" });
      }
      
      const total = await MensagensService.contarTotalNaoLidas(Number(userId), String(tipoUsuario));
      res.json({ total });
    } catch (error: any) {
      console.error("[MensagensController] Erro ao contar não lidas:", error);
      res.status(500).json({ error: error.message || "Erro interno" });
    }
  }
};
