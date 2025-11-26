import { EmpresasRepo } from "../repositories/empresas.repo";
import { prisma } from "../repositories/prisma";

export const EmpresasService = {
  async criarEmpresa(nome: string, cnpj?: string, email?: string) {
    if (!nome?.trim()) throw new Error("Nome é obrigatório");
    if (cnpj) {
      const existe = await EmpresasRepo.findByCnpj(cnpj);
      if (existe) throw new Error("CNPJ já cadastrado");
    }
    return EmpresasRepo.create(nome.trim(), cnpj?.trim(), email?.trim());
  },

  async getStats(empresaId: number) {
    // Vagas
    const [totalJobs, activeJobs, totalApplications, appsByStatus, jobsByRegime, viewsAgg] = await Promise.all([
      prisma.vaga.count({ where: { empresaId } }),
      prisma.vaga.count({ where: { empresaId, isActive: true } }),
      prisma.candidatura.count({ where: { vaga: { empresaId } } }),
      prisma.candidatura.groupBy({
        by: ['status'],
        _count: { _all: true },
        where: { vaga: { empresaId } },
      }).catch(() => []),
      prisma.vaga.groupBy({
        by: ['regimeTrabalho'],
        _count: { _all: true },
        where: { empresaId },
      }).catch(() => []),
      prisma.vaga.aggregate({
        _sum: { views: true } as any,
        where: { empresaId },
      }) as any,
    ]);

    const closedJobs = totalJobs - activeJobs;
    const applicationsByStatus = Object.fromEntries(
      (appsByStatus as any[]).map((r) => [r.status, r._count._all])
    );

    const jobsByRegimeObj = Object.fromEntries(
      (jobsByRegime as any[]).map((r) => [r.regimeTrabalho || 'Não informado', r._count._all])
    );

    const totalViews = (viewsAgg?._sum?.views ?? 0) as number;

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

  async listarCandidaturasEmProcesso(empresaId: number) {
    // We need to import CandidaturasRepo here or move this logic
    // To avoid circular dependencies if CandidaturasService uses EmpresasService, we use Repo directly
    // But since we are in EmpresasService, we should probably use CandidaturasRepo
    const { CandidaturasRepo } = await import("../repositories/candidaturas.repo");
    return CandidaturasRepo.listByEmpresaAndStatus(empresaId, "EM_PROCESSO");
  },

  async listarCandidaturasAprovadas(empresaId: number) {
    const { CandidaturasRepo } = await import("../repositories/candidaturas.repo");
    return CandidaturasRepo.listByEmpresaAndStatus(empresaId, "APROVADA");
  },
};
