"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidaturasService = void 0;
const candidaturas_repo_1 = require("../repositories/candidaturas.repo");
const prisma_1 = require("../repositories/prisma");
const matching_service_1 = require("./matching.service");
const activityLog_service_1 = require("./activityLog.service");
exports.CandidaturasService = {
    async candidatar(candidatoId, vagaId) {
        if (!candidatoId)
            throw new Error("candidatoId é obrigatório");
        if (!vagaId)
            throw new Error("vagaId é obrigatório");
        // Valida candidato
        const candidato = await prisma_1.prisma.candidato.findUnique({ where: { id: candidatoId } });
        if (!candidato)
            throw new Error("Candidato não encontrado");
        // Valida vaga
        const vaga = await prisma_1.prisma.vaga.findUnique({ where: { id: vagaId } });
        if (!vaga)
            throw new Error("Vaga não encontrada");
        if (!vaga.isActive)
            throw new Error("Vaga não está ativa");
        // Verifica se já candidatou
        const existing = await candidaturas_repo_1.CandidaturasRepo.findByCandidatoAndVaga(candidatoId, vagaId);
        if (existing)
            throw new Error("Você já se candidatou a esta vaga");
        // Criar a candidatura
        const candidatura = await candidaturas_repo_1.CandidaturasRepo.create(candidatoId, vagaId);
        // Registrar atividade de candidatura
        await activityLog_service_1.ActivityLogService.logCandidatura(candidato.nome, candidatoId, vaga.titulo, vagaId);
        // Calcular e salvar o match score para esta candidatura
        try {
            console.log(`[CandidaturasService] Calculando match score para candidato ${candidatoId} na vaga ${vagaId}`);
            await matching_service_1.MatchingService.calcularMatch(candidatoId, vagaId);
            console.log(`[CandidaturasService] Match score calculado e salvo com sucesso`);
        }
        catch (error) {
            console.error(`[CandidaturasService] Erro ao calcular match score:`, error);
            // Não falhar a candidatura se o cálculo de match falhar
        }
        return candidatura;
    },
    async listarPorCandidato(candidatoId) {
        return candidaturas_repo_1.CandidaturasRepo.listByCandidato(candidatoId);
    },
    async listarPorVaga(vagaId) {
        return candidaturas_repo_1.CandidaturasRepo.listByVaga(vagaId);
    },
    async atualizarStatus(id, status) {
        if (!["Pendente", "Aceita", "Rejeitada", "EM_PROCESSO", "APROVADA"].includes(status)) {
            throw new Error("Status inválido");
        }
        const result = await candidaturas_repo_1.CandidaturasRepo.updateStatus(id, status);
        // Se for contratação ou rejeição, registrar atividade
        if (status === 'APROVADA' || status === 'Rejeitada') {
            const candidatura = await prisma_1.prisma.candidatura.findUnique({
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
                    await activityLog_service_1.ActivityLogService.logContratacao(empresaNome, candidatura.vaga.empresaId, candidatura.candidato.nome, candidatura.vaga.titulo, id);
                }
                else {
                    await activityLog_service_1.ActivityLogService.logRejeicao(empresaNome, candidatura.vaga.empresaId, candidatura.candidato.nome, candidatura.vaga.titulo, id);
                }
            }
        }
        return result;
    },
};
//# sourceMappingURL=candidaturas.service.js.map