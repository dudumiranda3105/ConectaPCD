"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidatoSubtipoRepo = void 0;
const prisma_1 = require("./prisma");
exports.CandidatoSubtipoRepo = {
    async replaceSubtipos(candidatoId, disabilities) {
        return this.replaceSubtiposAndAccessibilities(candidatoId, disabilities, [], []);
    },
    async replaceSubtiposAndAccessibilities(candidatoId, disabilities, accessibilities, assistiveResources = []) {
        // Validar se o candidato existe
        const candidato = await prisma_1.prisma.candidato.findUnique({
            where: { id: candidatoId }
        });
        if (!candidato) {
            throw new Error(`Candidato ${candidatoId} não encontrado`);
        }
        // Validar se todos os subtipos existem
        const subtypeIds = disabilities.map(d => d.subtypeId);
        if (subtypeIds.length > 0) {
            const existingSubtypes = await prisma_1.prisma.subtipoDeficiencia.findMany({
                where: { id: { in: subtypeIds } }
            });
            const existingSubtypeIds = new Set(existingSubtypes.map(s => s.id));
            const invalidSubtypes = subtypeIds.filter(id => !existingSubtypeIds.has(id));
            if (invalidSubtypes.length > 0) {
                throw new Error(`Subtipos inválidos: ${invalidSubtypes.join(', ')}`);
            }
        }
        // Validar se todas as barreiras existem
        const allBarriers = disabilities.flatMap(d => d.barriers);
        if (allBarriers.length > 0) {
            const existingBarriers = await prisma_1.prisma.barreira.findMany({
                where: { id: { in: allBarriers } }
            });
            const existingBarrierIds = new Set(existingBarriers.map(b => b.id));
            const invalidBarriers = allBarriers.filter(id => !existingBarrierIds.has(id));
            if (invalidBarriers.length > 0) {
                throw new Error(`Barreiras inválidas: ${invalidBarriers.join(', ')}`);
            }
        }
        // Validar se todas as acessibilidades existem
        const accessibilityIds = accessibilities.map(a => a.acessibilidadeId);
        if (accessibilityIds.length > 0) {
            const existingAccessibilities = await prisma_1.prisma.acessibilidade.findMany({
                where: { id: { in: accessibilityIds } }
            });
            const existingAccessibilityIds = new Set(existingAccessibilities.map(a => a.id));
            const invalidAccessibilities = accessibilityIds.filter(id => !existingAccessibilityIds.has(id));
            if (invalidAccessibilities.length > 0) {
                throw new Error(`Acessibilidades inválidas: ${invalidAccessibilities.join(', ')}`);
            }
        }
        // Validar se todos os recursos assistivos existem
        const resourceIds = assistiveResources.map(r => r.recursoId);
        if (resourceIds.length > 0) {
            const existingResources = await prisma_1.prisma.recursoAssistivo.findMany({
                where: { id: { in: resourceIds } }
            });
            const existingResourceIds = new Set(existingResources.map(r => r.id));
            const invalidResources = resourceIds.filter(id => !existingResourceIds.has(id));
            if (invalidResources.length > 0) {
                throw new Error(`Recursos assistivos inválidos: ${invalidResources.join(', ')}`);
            }
        }
        // Remover todos os subtipos, barreiras, acessibilidades e recursos assistivos existentes
        await prisma_1.prisma.candidatoSubtipoBarreira.deleteMany({
            where: { candidatoId }
        });
        await prisma_1.prisma.candidatoSubtipo.deleteMany({
            where: { candidatoId }
        });
        await prisma_1.prisma.candidatoAcessibilidade.deleteMany({
            where: { candidatoId }
        });
        await prisma_1.prisma.candidatoRecursoAssistivo.deleteMany({
            where: { candidatoId }
        });
        // Adicionar novos subtipos e barreiras
        for (const disability of disabilities) {
            // Criar relação candidato-subtipo
            await prisma_1.prisma.candidatoSubtipo.create({
                data: {
                    candidatoId,
                    subtipoId: disability.subtypeId,
                }
            });
            // Criar relações com barreiras
            if (disability.barriers.length > 0) {
                await prisma_1.prisma.candidatoSubtipoBarreira.createMany({
                    data: disability.barriers.map(barreiraId => ({
                        candidatoId,
                        subtipoId: disability.subtypeId,
                        barreiraId,
                    })),
                    skipDuplicates: true,
                });
            }
        }
        // Adicionar novas acessibilidades do candidato
        if (accessibilities.length > 0) {
            await prisma_1.prisma.candidatoAcessibilidade.createMany({
                data: accessibilities.map(a => ({
                    candidatoId,
                    acessibilidadeId: a.acessibilidadeId,
                    prioridade: a.prioridade || 'importante',
                })),
                skipDuplicates: true,
            });
        }
        // Adicionar novos recursos assistivos do candidato
        if (assistiveResources.length > 0) {
            await prisma_1.prisma.candidatoRecursoAssistivo.createMany({
                data: assistiveResources.map(r => ({
                    candidatoId,
                    recursoId: r.recursoId,
                    usoFrequencia: r.usoFrequencia,
                    impactoMobilidade: r.impactoMobilidade,
                })),
                skipDuplicates: true,
            });
        }
        // Retornar candidato atualizado com subtipos, barreiras, acessibilidades e recursos assistivos
        return prisma_1.prisma.candidato.findUnique({
            where: { id: candidatoId },
            include: {
                subtipos: {
                    include: {
                        subtipo: {
                            include: {
                                tipo: true,
                            },
                        },
                        barreiras: {
                            include: {
                                barreira: true,
                            },
                        },
                    },
                },
                acessibilidades: {
                    include: {
                        acessibilidade: true,
                    },
                },
                recursosAssistivos: {
                    include: {
                        recurso: true,
                    },
                },
            },
        });
    },
};
//# sourceMappingURL=candidatoSubtipo.repo.js.map