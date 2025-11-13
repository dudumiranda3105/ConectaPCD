import { CandidaturasRepo } from "../repositories/candidaturas.repo";
import { prisma } from "../repositories/prisma";

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

    return CandidaturasRepo.create(candidatoId, vagaId);
  },

  async listarPorCandidato(candidatoId: number) {
    return CandidaturasRepo.listByCandidato(candidatoId);
  },

  async listarPorVaga(vagaId: number) {
    return CandidaturasRepo.listByVaga(vagaId);
  },

  async atualizarStatus(id: number, status: string) {
    if (!["Pendente", "Aceita", "Rejeitada"].includes(status)) {
      throw new Error("Status inválido");
    }
    return CandidaturasRepo.updateStatus(id, status);
  },
};
