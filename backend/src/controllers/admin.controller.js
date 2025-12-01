"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = exports.getPublicStats = void 0;
const admin_service_1 = require("../services/admin.service");
// Controlador para estatísticas públicas (sem autenticação)
const getPublicStats = async (_req, res) => {
    try {
        const stats = await admin_service_1.AdminService.getPublicStats();
        res.json(stats);
    }
    catch (error) {
        console.error('Erro ao buscar estatísticas públicas:', error);
        res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }
};
exports.getPublicStats = getPublicStats;
exports.AdminController = {
    async getStats(req, res) {
        try {
            const stats = await admin_service_1.AdminService.getDashboardStats();
            res.json(stats);
        }
        catch (err) {
            console.error('Erro ao buscar estatísticas:', err);
            res.status(500).json({ error: err.message ?? 'Erro interno no servidor' });
        }
    },
    async getActivities(req, res) {
        try {
            const activities = await admin_service_1.AdminService.getRecentActivities();
            res.json(activities);
        }
        catch (err) {
            console.error('Erro ao buscar atividades:', err);
            res.status(500).json({ error: err.message ?? 'Erro interno no servidor' });
        }
    },
    async getUsers(req, res) {
        try {
            const users = await admin_service_1.AdminService.getUsers();
            res.json(users);
        }
        catch (err) {
            console.error('Erro ao buscar usuários:', err);
            res.status(500).json({ error: err.message ?? 'Erro interno no servidor' });
        }
    },
    async getAdmins(req, res) {
        try {
            const admins = await admin_service_1.AdminService.getAdmins();
            res.json(admins);
        }
        catch (err) {
            console.error('Erro ao buscar administradores:', err);
            res.status(500).json({ error: err.message ?? 'Erro interno no servidor' });
        }
    },
    async getCompanies(req, res) {
        try {
            const companies = await admin_service_1.AdminService.getCompanies();
            res.json(companies);
        }
        catch (err) {
            console.error('Erro ao buscar empresas:', err);
            res.status(500).json({ error: err.message ?? 'Erro interno no servidor' });
        }
    },
    async getJobsForModeration(req, res) {
        try {
            const jobs = await admin_service_1.AdminService.getJobsForModeration();
            res.json(jobs);
        }
        catch (err) {
            console.error('Erro ao buscar vagas para moderação:', err);
            res.status(500).json({ error: err.message ?? 'Erro interno no servidor' });
        }
    },
    async moderateJob(req, res) {
        try {
            const { jobId } = req.params;
            const { status } = req.body;
            if (!status || !['Aprovada', 'Reprovada'].includes(status)) {
                return res.status(400).json({ error: 'Status inválido' });
            }
            await admin_service_1.AdminService.moderateJob(Number(jobId), status);
            res.json({ message: 'Vaga moderada com sucesso' });
        }
        catch (err) {
            console.error('Erro ao moderar vaga:', err);
            res.status(500).json({ error: err.message ?? 'Erro interno no servidor' });
        }
    },
    async getEngagementMetrics(req, res) {
        try {
            const metrics = await admin_service_1.AdminService.getEngagementMetrics();
            res.json(metrics);
        }
        catch (err) {
            console.error('Erro ao buscar métricas de engajamento:', err);
            res.status(500).json({ error: err.message ?? 'Erro interno no servidor' });
        }
    },
    async getAccessibilityMetrics(req, res) {
        try {
            const metrics = await admin_service_1.AdminService.getAccessibilityMetrics();
            res.json(metrics);
        }
        catch (err) {
            console.error('Erro ao buscar métricas de acessibilidade:', err);
            res.status(500).json({ error: err.message ?? 'Erro interno no servidor' });
        }
    },
    async createAdmin(req, res) {
        try {
            const { name, email, password, cargo } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
            }
            const admin = await admin_service_1.AdminService.createAdmin({ name, email, password, cargo });
            res.status(201).json(admin);
        }
        catch (err) {
            console.error('Erro ao criar administrador:', err);
            if (err.message === 'Email já está em uso') {
                return res.status(400).json({ error: err.message });
            }
            res.status(500).json({ error: err.message ?? 'Erro interno no servidor' });
        }
    },
    async deleteAdmin(req, res) {
        try {
            const { adminId } = req.params;
            const currentAdminId = req.user?.userId;
            if (Number(adminId) === currentAdminId) {
                return res.status(400).json({ error: 'Você não pode remover a si mesmo' });
            }
            await admin_service_1.AdminService.deleteAdmin(Number(adminId));
            res.json({ message: 'Administrador removido com sucesso' });
        }
        catch (err) {
            console.error('Erro ao remover administrador:', err);
            res.status(500).json({ error: err.message ?? 'Erro interno no servidor' });
        }
    },
};
//# sourceMappingURL=admin.controller.js.map