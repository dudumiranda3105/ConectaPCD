import { prisma } from '../repositories/prisma';

export const AdminService = {
  async getDashboardStats() {
    const [candidatesCount, companiesCount, adminsCount, activeJobsCount, pendingJobsCount] = await Promise.all([
      prisma.candidato.count(),
      prisma.empresa.count(),
      prisma.admin.count(),
      prisma.vaga.count({ where: { isActive: true } }),
      prisma.vaga.count({ where: { isActive: false } }),
    ]);

    return {
      candidates: candidatesCount,
      companies: companiesCount,
      admins: adminsCount,
      activeJobs: activeJobsCount,
      jobsToModerate: pendingJobsCount,
    };
  },

  async getRecentActivities() {
    // Busca atividades recentes: últimas candidaturas, vagas criadas, usuários cadastrados
    const [recentCandidaturas, recentVagas, recentCandidatos, recentEmpresas] = await Promise.all([
      prisma.candidatura.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          candidato: { select: { nome: true } },
          vaga: { select: { titulo: true } },
        },
      }),
      prisma.vaga.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        include: {
          empresa: { select: { nomeFantasia: true, razaoSocial: true, nome: true } },
        },
      }),
      prisma.candidato.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: { nome: true, createdAt: true },
      }),
      prisma.empresa.findMany({
        take: 2,
        orderBy: { createdAt: 'desc' },
        select: { nomeFantasia: true, razaoSocial: true, nome: true, createdAt: true },
      }),
    ]);

    const activities: any[] = [];

    // Adiciona candidaturas
    recentCandidaturas.forEach(c => {
      activities.push({
        user: c.candidato.nome,
        action: `se candidatou à vaga "${c.vaga.titulo}"`,
        time: c.createdAt,
        type: 'candidatura',
      });
    });

    // Adiciona vagas criadas
    recentVagas.forEach(v => {
      activities.push({
        user: v.empresa.nomeFantasia || v.empresa.razaoSocial || v.empresa.nome,
        action: `publicou a vaga "${v.titulo}"`,
        time: v.createdAt,
        type: 'vaga',
      });
    });

    // Adiciona novos candidatos
    recentCandidatos.forEach(c => {
      activities.push({
        user: c.nome,
        action: 'se cadastrou como candidato',
        time: c.createdAt,
        type: 'cadastro',
      });
    });

    // Adiciona novas empresas
    recentEmpresas.forEach(e => {
      activities.push({
        user: e.nomeFantasia || e.razaoSocial || e.nome,
        action: 'se cadastrou como empresa',
        time: e.createdAt,
        type: 'cadastro',
      });
    });

    // Ordena por data mais recente e retorna as 10 mais recentes
    return activities
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 10)
      .map(a => ({
        ...a,
        time: a.time.toISOString(),
      }));
  },

  async getUsers() {
    const candidatos = await prisma.candidato.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        cpf: true,
        createdAt: true,
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return candidatos.map(c => ({
      id: c.id.toString(),
      name: c.nome,
      email: c.email || 'Não informado',
      disability: 'Não especificado', // você pode pegar isso dos subtipos depois
      joined: c.createdAt.toISOString(),
      status: c.isActive ? 'Ativo' : 'Inativo',
    }));
  },

  async getAdmins() {
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        cargo: true,
        createdAt: true,
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return admins.map(a => ({
      id: a.id.toString(),
      name: a.nome,
      email: a.email,
      cargo: a.cargo,
      joined: a.createdAt.toISOString(),
      status: a.isActive ? 'Ativo' : 'Inativo',
    }));
  },

  async getCompanies() {
    const empresas = await prisma.empresa.findMany({
      select: {
        id: true,
        nome: true,
        razaoSocial: true,
        nomeFantasia: true,
        cnpj: true,
        setor: true,
        createdAt: true,
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return empresas.map(e => ({
      id: e.id.toString(),
      name: e.nomeFantasia || e.razaoSocial || e.nome,
      cnpj: e.cnpj || 'Não informado',
      sector: e.setor || 'Não informado',
      joined: e.createdAt.toISOString(),
      status: e.isActive ? 'Verificada' : 'Inativa',
    }));
  },

  async getJobsForModeration() {
    const vagas = await prisma.vaga.findMany({
      include: {
        empresa: {
          select: {
            nomeFantasia: true,
            razaoSocial: true,
            nome: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return vagas.map(v => ({
      id: v.id.toString(),
      title: v.titulo,
      company: v.empresa.nomeFantasia || v.empresa.razaoSocial || v.empresa.nome,
      posted: v.createdAt.toISOString(),
      status: v.isActive ? 'Aprovada' : 'Pendente',
    }));
  },

  async moderateJob(jobId: number, status: string) {
    await prisma.vaga.update({
      where: { id: jobId },
      data: {
        isActive: status === 'Aprovada',
      },
    });
  },

  async getEngagementMetrics() {
    // Busca métricas dos últimos 6 meses
    const now = new Date();
    const monthsData = [];

    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const [candidaturas, newCandidatos, newEmpresas] = await Promise.all([
        prisma.candidatura.count({
          where: {
            createdAt: {
              gte: monthStart,
              lte: monthEnd,
            },
          },
        }),
        prisma.candidato.count({
          where: {
            createdAt: {
              gte: monthStart,
              lte: monthEnd,
            },
          },
        }),
        prisma.empresa.count({
          where: {
            createdAt: {
              gte: monthStart,
              lte: monthEnd,
            },
          },
        }),
      ]);

      const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      
      monthsData.push({
        month: monthNames[monthStart.getMonth()],
        applications: candidaturas,
        newUsers: newCandidatos + newEmpresas,
      });
    }

    return monthsData;
  },

  async getAccessibilityMetrics() {
    // Busca as acessibilidades mais oferecidas nas vagas
    const acessibilidades = await prisma.acessibilidade.findMany({
      include: {
        _count: {
          select: { VagaAcessibilidade: true },
        },
      },
      orderBy: {
        VagaAcessibilidade: {
          _count: 'desc',
        },
      },
      take: 8,
    });

    return acessibilidades.map(a => ({
      type: a.descricao,
      offered: a._count.VagaAcessibilidade,
    }));
  },
};
