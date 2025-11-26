import { CandidaturasRepo } from "../repositories/candidaturas.repo";
import { prisma } from "../repositories/prisma";
import { MatchingService } from "./matching.service";
import { ActivityLogService } from "./activityLog.service";

export const CandidaturasService = {
  async candidatar(candidatoId: number, vagaId: number) {
    if (!candidatoId) throw new Error("candidatoId é obrigatório");
    if (!vagaId) throw new Error("vagaId é obrigatório");

    // Valida candidato
    const candidato = await prisma.candidato.findUnique({ where: { id: candidatoId } });
    if (!candidato) throw new Error("Candidato não encontrado");

    // Valida vaga
    const vaga = await prisma.vaga.findUnique({ where: { id: vagaId } });
    if (!vaga) throw new Error("Vaga não encontrada");
    if (!vaga.isActive) throw new Error("Vaga não está ativa");

    // Verifica se já candidatou
    const existing = await CandidaturasRepo.findByCandidatoAndVaga(candidatoId, vagaId);
    if (existing) throw new Error("Você já se candidatou a esta vaga");

    // Criar a candidatura
    const candidatura = await CandidaturasRepo.create(candidatoId, vagaId);
    
    // Registrar atividade de candidatura
    await ActivityLogService.logCandidatura(candidato.nome, candidatoId, vaga.titulo, vagaId);
    
    // Calcular e salvar o match score para esta candidatura
    try {
      console.log(`[CandidaturasService] Calculando match score para candidato ${candidatoId} na vaga ${vagaId}`);
      await MatchingService.calcularMatch(candidatoId, vagaId);
      console.log(`[CandidaturasService] Match score calculado e salvo com sucesso`);
    } catch (error) {
      console.error(`[CandidaturasService] Erro ao calcular match score:`, error);
      // Não falhar a candidatura se o cálculo de match falhar
    }

    return candidatura;
  },

  async listarPorCandidato(candidatoId: number) {
    return CandidaturasRepo.listByCandidato(candidatoId);
  },

  async listarPorVaga(vagaId: number) {
    return CandidaturasRepo.listByVaga(vagaId);
  },

  async atualizarStatus(id: number, status: string) {
    if (!["Pendente", "Aceita", "Rejeitada", "EM_PROCESSO", "APROVADA"].includes(status)) {
      throw new Error("Status inválido");
    }
    
    const result = await CandidaturasRepo.updateStatus(id, status);
    
    // Se for contratação ou rejeição, registrar atividade
    if (status === 'APROVADA' || status === 'Rejeitada') {
      const candidatura = await prisma.candidatura.findUnique({
        where: { id },
        include: {
          candidato: { select: { nome: true } },
          vaga: { 
            select: { 
              titulo: true,
              empresaId: true,
              empresa: { select: { nome: true, nomeFantasia: true, razaoSocial: true } }
            }
          },
        },
      });
      
      if (candidatura) {
        const empresaNome = candidatura.vaga.empresa.nomeFantasia || 
                          candidatura.vaga.empresa.razaoSocial || 
                          candidatura.vaga.empresa.nome;
        
        if (status === 'APROVADA') {
          await ActivityLogService.logContratacao(
            empresaNome,
            candidatura.vaga.empresaId,
            candidatura.candidato.nome,
            candidatura.vaga.titulo,
            id
          );
        } else {
          await ActivityLogService.logRejeicao(
            empresaNome,
            candidatura.vaga.empresaId,
            candidatura.candidato.nome,
            candidatura.vaga.titulo,
            id
          );
        }
      }
    }
    
    return result;
  },
};
