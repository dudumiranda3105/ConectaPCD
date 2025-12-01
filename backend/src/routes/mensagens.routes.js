"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mensagens_controller_1 = require("../controllers/mensagens.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const r = (0, express_1.Router)();
// Todas as rotas requerem autenticação
r.use(auth_middleware_1.authMiddleware);
// Obter ou criar conversa para uma candidatura
r.get("/candidatura/:candidaturaId", mensagens_controller_1.MensagensController.getOrCreateConversa);
// Buscar conversa por ID
r.get("/conversa/:conversaId", mensagens_controller_1.MensagensController.getConversaById);
// Listar conversas de um candidato
r.get("/candidato/:candidatoId", mensagens_controller_1.MensagensController.listarConversasCandidato);
// Listar conversas de uma empresa
r.get("/empresa/:empresaId", mensagens_controller_1.MensagensController.listarConversasEmpresa);
// Buscar mensagens de uma conversa
r.get("/conversa/:conversaId/mensagens", mensagens_controller_1.MensagensController.getMensagens);
// Enviar mensagem
r.post("/conversa/:conversaId/mensagens", mensagens_controller_1.MensagensController.enviarMensagem);
// Marcar mensagens como lidas
r.put("/conversa/:conversaId/lidas", mensagens_controller_1.MensagensController.marcarComoLidas);
// Contar mensagens não lidas
r.get("/nao-lidas", mensagens_controller_1.MensagensController.contarNaoLidas);
exports.default = r;
//# sourceMappingURL=mensagens.routes.js.map