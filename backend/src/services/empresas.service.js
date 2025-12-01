"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpresasService = void 0;
const empresas_repo_1 = require("../repositories/empresas.repo");
const prisma_1 = require("../repositories/prisma");
exports.EmpresasService = {
    async criarEmpresa(nome, cnpj, email) {
        if (!nome?.trim())
            throw new Error("Nome é obrigatório");
        if (cnpj) {
            const existe = await empresas_repo_1.EmpresasRepo.findByCnpj(cnpj);
            if (existe)
                throw new Error("CNPJ já cadastrado");
        }
        return empresas_repo_1.EmpresasRepo.create(nome.trim(), cnpj?.trim(), email?.trim());
    },
    async getStats(empresaId) {
        // Vagas
        const [totalJobs, activeJobs, totalApplications, appsByStatus, jobsByRegime, viewsAgg] = await Promise.all([
            prisma_1.prisma.vaga.count({ where: { empresaId } }),
            prisma_1.prisma.vaga.count({ where: { empresaId, isActive: true } }),
            prisma_1.prisma.candidatura.count({ where: { vaga: { empresaId } } }),
            prisma_1.prisma.candidatura.groupBy({
                by: ['status'],
                _count: { _all: true },
                where: { vaga: { empresaId } },
            }).catch(() => []),
            prisma_1.prisma.vaga.groupBy({
                by: ['regimeTrabalho'],
                _count: { _all: true },
                where: { empresaId },
            }).catch(() => []),
            prisma_1.prisma.vaga.aggregate({
                _sum: { views: true },
                where: { empresaId },
            }),
        ]);
        const closedJobs = totalJobs - activeJobs;
        const applicationsByStatus = Object.fromEntries(appsByStatus.map((r) => [r.status, r._count._all]));
        const jobsByRegimeObj = Object.fromEntries(jobsByRegime.map((r) => [r.regimeTrabalho || 'Não informado', r._count._all]));
        const totalViews = (viewsAgg?._sum?.views ?? 0);
        return {
            totalJobs,
            activeJobs,
            closedJobs,
            totalApplications,
            applicationsByStatus,
            jobsByRegime: jobsByRegimeObj,
            totalViews,
        };
    },
    async listarCandidaturasEmProcesso(empresaId) {
        // We need to import CandidaturasRepo here or move this logic
        // To avoid circular dependencies if CandidaturasService uses EmpresasService, we use Repo directly
        // But since we are in EmpresasService, we should probably use CandidaturasRepo
        const { CandidaturasRepo } = await import("../repositories/candidaturas.repo.js");
        return CandidaturasRepo.listByEmpresaAndStatus(empresaId, "EM_PROCESSO");
    },
    async listarCandidaturasAprovadas(empresaId) {
        const { CandidaturasRepo } = await import("../repositories/candidaturas.repo.js");
        return CandidaturasRepo.listByEmpresaAndStatus(empresaId, "APROVADA");
    },
};
//# sourceMappingURL=empresas.service.js.map