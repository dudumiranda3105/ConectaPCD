"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VagasService = void 0;
const vagas_repo_1 = require("../repositories/vagas.repo");
const prisma_1 = require("../repositories/prisma");
const activityLog_service_1 = require("./activityLog.service");
exports.VagasService = {
    async listarVagasPublicas() {
        return vagas_repo_1.VagasRepo.list();
    },
    async criarVaga(empresaId, titulo, descricao, escolaridade, tipo, regimeTrabalho, beneficios, acessibilidades, subtiposAceitos) {
        if (!empresaId)
            throw new Error("empresaId é obrigatório");
        if (!titulo?.trim())
            throw new Error("titulo é obrigatório");
        if (!descricao?.trim())
            throw new Error("descricao é obrigatória");
        if (!escolaridade?.trim())
            throw new Error("escolaridade é obrigatória");
        // valida existência da empresa
        const empresa = await prisma_1.prisma.empresa.findUnique({ where: { id: empresaId } });
        if (!empresa)
            throw new Error("Empresa não encontrada");
        const vaga = await vagas_repo_1.VagasRepo.create(empresaId, titulo.trim(), descricao.trim(), escolaridade.trim(), tipo?.trim(), regimeTrabalho?.trim(), beneficios?.trim());
        // Vincular acessibilidades se fornecidas
        if (acessibilidades && acessibilidades.length > 0) {
            await this.vincularAcessibilidadesPorNome(vaga.id, acessibilidades);
        }
        // Vincular subtipos se fornecidos
        if (subtiposAceitos && subtiposAceitos.length > 0) {
            console.log('[VagasService] Vinculando subtipos aceitos:', subtiposAceitos);
            await this.vincularSubtipos(vaga.id, subtiposAceitos);
        }
        // Registrar atividade de criação de vaga
        const empresaNome = empresa.nomeFantasia || empresa.razaoSocial || empresa.nome;
        await activityLog_service_1.ActivityLogService.logNovaVaga(empresaNome, empresaId, titulo.trim(), vaga.id);
        return vaga;
    },
    async vincularSubtipos(vagaId, subtipoIds) {
        if (!vagaId) {
            throw new Error("Informe vagaId");
        }
        if (!Array.isArray(subtipoIds)) {
            throw new Error("subtipoIds deve ser um array");
        }
        // valida vaga
        const vaga = await prisma_1.prisma.vaga.findUnique({ where: { id: vagaId } });
        if (!vaga)
            throw new Error("Vaga não encontrada");
        // Se array vazio, apenas limpa os subtipos existentes
        if (subtipoIds.length === 0) {
            await prisma_1.prisma.vagaSubtipo.deleteMany({ where: { vagaId } });
            return { ok: true, message: "Subtipos removidos" };
        }
        return vagas_repo_1.VagasRepo.linkSubtipos(vagaId, subtipoIds);
    },
    async vincularAcessibilidades(vagaId, acessibilidadeIds) {
        if (!vagaId || !Array.isArray(acessibilidadeIds) || acessibilidadeIds.length === 0) {
            throw new Error("Informe vagaId e pelo menos um acessibilidadeId");
        }
        // valida vaga
        const vaga = await prisma_1.prisma.vaga.findUnique({ where: { id: vagaId } });
        if (!vaga)
            throw new Error("Vaga não encontrada");
        return vagas_repo_1.VagasRepo.linkAcessibilidades(vagaId, acessibilidadeIds);
    },
    async listarAcessibilidadesPossiveis(vagaId) {
        const vaga = await vagas_repo_1.VagasRepo.findByIdWithSubtiposBarreirasAcessibilidades(vagaId);
        if (!vaga)
            throw new Error("Vaga não encontrada");
        // Junta todas as acessibilidades das barreiras dos subtipos da vaga
        const acessibilidades = vaga.subtiposAceitos.flatMap((vs) => vs.subtipo.barreiras.flatMap((sb) => sb.barreira.acessibilidades.map((ba) => ba.acessibilidade)));
        // Remove duplicadas
        const unicas = acessibilidades.filter((a, i, arr) => arr.findIndex((x) => x.id === a.id) === i);
        return unicas;
    },
    async listarCandidaturasPorVaga(vagaId) {
        const vaga = await vagas_repo_1.VagasRepo.findById(vagaId);
        if (!vaga)
            throw new Error("Vaga não encontrada");
        const candidaturas = await vagas_repo_1.VagasRepo.getCandidaturas(vagaId);
        console.log(`[VagasService] Candidaturas para vaga ${vagaId}:`, candidaturas.length);
        // Buscar match scores do banco de dados para cada candidatura
        const candidaturasComMatch = await Promise.all(candidaturas.map(async (candidatura) => {
            try {
                const matchScore = await prisma_1.prisma.matchScore.findUnique({
                    where: {
                        candidatoId_vagaId: {
                            candidatoId: candidatura.candidato.id,
                            vagaId: vagaId,
                        },
                    },
                });
                return {
                    ...candidatura,
                    matchScoreDB: matchScore ? {
                        scoreTotal: matchScore.scoreTotal,
                        scoreAcessibilidades: matchScore.scoreAcessibilidades,
                        scoreSubtipos: matchScore.scoreSubtipos,
                        acessibilidadesAtendidas: matchScore.acessibilidadesAtendidas,
                        acessibilidadesTotal: matchScore.acessibilidadesTotal,
                        detalhes: matchScore.detalhes,
                        calculadoEm: matchScore.updatedAt || matchScore.calculadoEm,
                    } : null,
                };
            }
            catch (error) {
                console.error(`[VagasService] Erro ao buscar match score para candidato ${candidatura.candidato.id}:`, error);
                return candidatura;
            }
        }));
        return candidaturasComMatch;
    },
    async atualizarVaga(vagaId, dados) {
        const vaga = await vagas_repo_1.VagasRepo.findById(vagaId);
        if (!vaga)
            throw new Error("Vaga não encontrada");
        // Separar acessibilidades e subtipos dos outros dados
        const { acessibilidades, subtiposAceitos, ...dadosVaga } = dados;
        // Verificar se está fechando a vaga
        const estaFechandoVaga = vaga.isActive === true && dados.isActive === false;
        // Atualizar dados da vaga (sem acessibilidades e subtipos)
        const vagaAtualizada = await vagas_repo_1.VagasRepo.update(vagaId, dadosVaga);
        // Atualizar acessibilidades se fornecidas
        if (acessibilidades !== undefined) {
            // Remover acessibilidades existentes
            await prisma_1.prisma.vagaAcessibilidade.deleteMany({ where: { vagaId } });
            // Adicionar novas acessibilidades
            if (acessibilidades.length > 0) {
                await this.vincularAcessibilidadesPorNome(vagaId, acessibilidades);
            }
        }
        // Atualizar subtipos aceitos se fornecidos
        if (subtiposAceitos !== undefined) {
            console.log('[VagasService] Atualizando subtipos aceitos:', subtiposAceitos);
            // Remover subtipos existentes
            await prisma_1.prisma.vagaSubtipo.deleteMany({ where: { vagaId } });
            // Adicionar novos subtipos
            if (subtiposAceitos.length > 0) {
                await vagas_repo_1.VagasRepo.linkSubtipos(vagaId, subtiposAceitos);
            }
        }
        // Registrar atividade se está fechando a vaga
        if (estaFechandoVaga) {
            const empresaNome = vaga.empresa.nomeFantasia || vaga.empresa.razaoSocial || vaga.empresa.nome;
            await activityLog_service_1.ActivityLogService.logVagaFechada(empresaNome, vaga.empresaId, vaga.titulo, vagaId);
        }
        return vagaAtualizada;
    },
    async vincularAcessibilidadesPorNome(vagaId, nomes) {
        console.log('[VagasService] Vinculando acessibilidades:', { vagaId, nomes });
        // Buscar IDs das acessibilidades pelos nomes/descrições (case-insensitive)
        const acessibilidades = await prisma_1.prisma.acessibilidade.findMany({
            where: {
                descricao: {
                    in: nomes,
                    mode: 'insensitive'
                }
            }
        });
        console.log('[VagasService] Acessibilidades encontradas:', acessibilidades);
        if (acessibilidades.length === 0) {
            console.warn('[VagasService] Nenhuma acessibilidade encontrada para os nomes fornecidos');
            return;
        }
        if (acessibilidades.length !== nomes.length) {
            console.warn('[VagasService] Algumas acessibilidades não foram encontradas:', {
                esperadas: nomes.length,
                encontradas: acessibilidades.length
            });
        }
        const acessibilidadeIds = acessibilidades.map(a => a.id);
        await vagas_repo_1.VagasRepo.linkAcessibilidades(vagaId, acessibilidadeIds);
        console.log('[VagasService] Acessibilidades vinculadas com sucesso:', acessibilidadeIds);
        // Verificar se foram realmente salvas
        const vagaComAcessibilidades = await vagas_repo_1.VagasRepo.findById(vagaId);
        console.log('[VagasService] Verificação - Acessibilidades salvas na vaga:', vagaComAcessibilidades?.acessibilidades);
    },
    async registrarVisualizacao(vagaId) {
        const vaga = await vagas_repo_1.VagasRepo.findById(vagaId);
        if (!vaga)
            throw new Error("Vaga não encontrada");
        return vagas_repo_1.VagasRepo.incrementViews(vagaId);
    },
};
//# sourceMappingURL=vagas.service.js.map