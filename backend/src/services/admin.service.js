"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const prisma_1 = require("../repositories/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
exports.AdminService = {
    // Estatísticas públicas para landing page (não requer autenticação)
    async getPublicStats() {
        const [candidatesCount, companiesCount, activeJobsCount] = await Promise.all([
            prisma_1.prisma.candidato.count(),
            prisma_1.prisma.empresa.count(),
            prisma_1.prisma.vaga.count({ where: { isActive: true } }),
        ]);
        return {
            candidates: candidatesCount,
            companies: companiesCount,
            activeJobs: activeJobsCount,
        };
    },
    async getDashboardStats() {
        const [candidatesCount, companiesCount, adminsCount, activeJobsCount, pendingJobsCount] = await Promise.all([
            prisma_1.prisma.candidato.count(),
            prisma_1.prisma.empresa.count(),
            prisma_1.prisma.admin.count(),
            prisma_1.prisma.vaga.count({ where: { isActive: true } }),
            prisma_1.prisma.vaga.count({ where: { isActive: false } }),
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
        // Primeiro tenta buscar do ActivityLog (nova tabela de logs)
        try {
            const activityLogs = await prisma_1.prisma.activityLog.findMany({
                take: 20,
                orderBy: { createdAt: 'desc' },
            });
            if (activityLogs.length > 0) {
                // Mapeia os tipos para os tipos do frontend
                const typeMapping = {
                    'CANDIDATURA': 'candidatura',
                    'VAGA': 'vaga',
                    'CADASTRO': 'cadastro',
                    'CONTRATACAO': 'contratacao',
                    'REJEICAO': 'rejeicao',
                    'LOGIN': 'login',
                    'PERFIL': 'perfil',
                    'CURRICULO': 'curriculo',
                    'LAUDO': 'laudo',
                    'CHAT': 'chat',
                    'MATCH': 'match',
                    'VAGA_FECHADA': 'vaga_fechada',
                    'APROVACAO_VAGA': 'aprovacao',
                    'VISUALIZACAO': 'visualizacao',
                };
                return activityLogs.map(log => ({
                    user: log.usuarioNome,
                    action: log.acao,
                    time: log.createdAt.toISOString(),
                    type: typeMapping[log.tipo] || 'outro',
                    userType: log.usuarioTipo,
                    details: log.detalhes,
                }));
            }
        }
        catch (error) {
            console.log('[AdminService] ActivityLog table não existe ainda, usando fallback');
        }
        // Fallback: Busca atividades de outras tabelas se ActivityLog não existir ou estiver vazia
        const [recentCandidaturas, recentVagas, recentCandidatos, recentEmpresas, recentContratacoes, recentRejeicoes] = await Promise.all([
            prisma_1.prisma.candidatura.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    candidato: { select: { nome: true } },
                    vaga: { select: { titulo: true } },
                },
            }),
            prisma_1.prisma.vaga.findMany({
                take: 3,
                orderBy: { createdAt: 'desc' },
                include: {
                    empresa: { select: { nomeFantasia: true, razaoSocial: true, nome: true } },
                },
            }),
            prisma_1.prisma.candidato.findMany({
                take: 3,
                orderBy: { createdAt: 'desc' },
                select: { nome: true, createdAt: true },
            }),
            prisma_1.prisma.empresa.findMany({
                take: 2,
                orderBy: { createdAt: 'desc' },
                select: { nomeFantasia: true, razaoSocial: true, nome: true, createdAt: true },
            }),
            // Contratações recentes
            prisma_1.prisma.candidatura.findMany({
                where: { status: 'APROVADA' },
                take: 3,
                orderBy: { updatedAt: 'desc' },
                include: {
                    candidato: { select: { nome: true } },
                    vaga: {
                        select: {
                            titulo: true,
                            empresa: { select: { nomeFantasia: true, razaoSocial: true, nome: true } }
                        }
                    },
                },
            }),
            // Rejeições recentes
            prisma_1.prisma.candidatura.findMany({
                where: { status: 'Rejeitada' },
                take: 2,
                orderBy: { updatedAt: 'desc' },
                include: {
                    candidato: { select: { nome: true } },
                    vaga: {
                        select: {
                            titulo: true,
                            empresa: { select: { nomeFantasia: true, razaoSocial: true, nome: true } }
                        }
                    },
                },
            }),
        ]);
        const activities = [];
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
        // Adiciona contratações
        recentContratacoes.forEach(c => {
            const empresaNome = c.vaga.empresa.nomeFantasia || c.vaga.empresa.razaoSocial || c.vaga.empresa.nome;
            activities.push({
                user: empresaNome,
                action: `contratou ${c.candidato.nome} para "${c.vaga.titulo}"`,
                time: c.updatedAt,
                type: 'contratacao',
            });
        });
        // Adiciona rejeições
        recentRejeicoes.forEach(c => {
            const empresaNome = c.vaga.empresa.nomeFantasia || c.vaga.empresa.razaoSocial || c.vaga.empresa.nome;
            activities.push({
                user: empresaNome,
                action: `não aprovou ${c.candidato.nome} para "${c.vaga.titulo}"`,
                time: c.updatedAt,
                type: 'rejeicao',
            });
        });
        // Ordena por data mais recente e retorna as 15 mais recentes
        return activities
            .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
            .slice(0, 15)
            .map(a => ({
            ...a,
            time: a.time.toISOString(),
        }));
    },
    async getUsers() {
        const candidatos = await prisma_1.prisma.candidato.findMany({
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
        const admins = await prisma_1.prisma.admin.findMany({
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
        const empresas = await prisma_1.prisma.empresa.findMany({
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
        const vagas = await prisma_1.prisma.vaga.findMany({
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
    async moderateJob(jobId, status) {
        await prisma_1.prisma.vaga.update({
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
                prisma_1.prisma.candidatura.count({
                    where: {
                        createdAt: {
                            gte: monthStart,
                            lte: monthEnd,
                        },
                    },
                }),
                prisma_1.prisma.candidato.count({
                    where: {
                        createdAt: {
                            gte: monthStart,
                            lte: monthEnd,
                        },
                    },
                }),
                prisma_1.prisma.empresa.count({
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
        const acessibilidades = await prisma_1.prisma.acessibilidade.findMany({
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
    async createAdmin(data) {
        // Verificar se email já existe
        const existingAdmin = await prisma_1.prisma.admin.findUnique({
            where: { email: data.email },
        });
        if (existingAdmin) {
            throw new Error('Email já está em uso');
        }
        // Hash da senha
        const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
        // Criar admin
        const admin = await prisma_1.prisma.admin.create({
            data: {
                nome: data.name,
                email: data.email,
                password: hashedPassword,
                cargo: data.cargo || 'Administrador',
                isActive: true,
            },
            select: {
                id: true,
                nome: true,
                email: true,
                cargo: true,
                createdAt: true,
                isActive: true,
            },
        });
        return {
            id: admin.id.toString(),
            name: admin.nome,
            email: admin.email,
            cargo: admin.cargo,
            joined: admin.createdAt.toISOString(),
            status: admin.isActive ? 'Ativo' : 'Inativo',
        };
    },
    async deleteAdmin(adminId) {
        // Verificar se existe
        const admin = await prisma_1.prisma.admin.findUnique({
            where: { id: adminId },
        });
        if (!admin) {
            throw new Error('Administrador não encontrado');
        }
        // Deletar admin
        await prisma_1.prisma.admin.delete({
            where: { id: adminId },
        });
        return { success: true };
    },
};
//# sourceMappingURL=admin.service.js.map