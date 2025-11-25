import { Router } from "express";
import { MensagensController } from "../controllers/mensagens.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const r = Router();

// Todas as rotas requerem autenticação
r.use(authMiddleware);

// Obter ou criar conversa para uma candidatura
r.get("/candidatura/:candidaturaId", MensagensController.getOrCreateConversa);

// Buscar conversa por ID
r.get("/conversa/:conversaId", MensagensController.getConversaById);

// Listar conversas de um candidato
r.get("/candidato/:candidatoId", MensagensController.listarConversasCandidato);

// Listar conversas de uma empresa
r.get("/empresa/:empresaId", MensagensController.listarConversasEmpresa);

// Buscar mensagens de uma conversa
r.get("/conversa/:conversaId/mensagens", MensagensController.getMensagens);

// Enviar mensagem
r.post("/conversa/:conversaId/mensagens", MensagensController.enviarMensagem);

// Marcar mensagens como lidas
r.put("/conversa/:conversaId/lidas", MensagensController.marcarComoLidas);

// Contar mensagens não lidas
r.get("/nao-lidas", MensagensController.contarNaoLidas);

export default r;
