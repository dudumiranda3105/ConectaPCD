import { Request, Response } from 'express';
import { AdminService } from '../services/admin.service';

export const AdminController = {
  async getStats(req: Request, res: Response) {
    try {
      const stats = await AdminService.getDashboardStats();
      res.json(stats);
    } catch (err: any) {
      console.error('Erro ao buscar estatísticas:', err);
      res.status(500).json({ error: err.message ?? 'Erro interno no servidor' });
    }
  },

  async getActivities(req: Request, res: Response) {
    try {
      const activities = await AdminService.getRecentActivities();
      res.json(activities);
    } catch (err: any) {
      console.error('Erro ao buscar atividades:', err);
      res.status(500).json({ error: err.message ?? 'Erro interno no servidor' });
    }
  },

  async getUsers(req: Request, res: Response) {
    try {
      const users = await AdminService.getUsers();
      res.json(users);
    } catch (err: any) {
      console.error('Erro ao buscar usuários:', err);
      res.status(500).json({ error: err.message ?? 'Erro interno no servidor' });
    }
  },

  async getAdmins(req: Request, res: Response) {
    try {
      const admins = await AdminService.getAdmins();
      res.json(admins);
    } catch (err: any) {
      console.error('Erro ao buscar administradores:', err);
      res.status(500).json({ error: err.message ?? 'Erro interno no servidor' });
    }
  },

  async getCompanies(req: Request, res: Response) {
    try {
      const companies = await AdminService.getCompanies();
      res.json(companies);
    } catch (err: any) {
      console.error('Erro ao buscar empresas:', err);
      res.status(500).json({ error: err.message ?? 'Erro interno no servidor' });
    }
  },

  async getJobsForModeration(req: Request, res: Response) {
    try {
      const jobs = await AdminService.getJobsForModeration();
      res.json(jobs);
    } catch (err: any) {
      console.error('Erro ao buscar vagas para moderação:', err);
      res.status(500).json({ error: err.message ?? 'Erro interno no servidor' });
    }
  },

  async moderateJob(req: Request, res: Response) {
    try {
      const { jobId } = req.params;
      const { status } = req.body;

      if (!status || !['Aprovada', 'Reprovada'].includes(status)) {
        return res.status(400).json({ error: 'Status inválido' });
      }

      await AdminService.moderateJob(Number(jobId), status);
      res.json({ message: 'Vaga moderada com sucesso' });
    } catch (err: any) {
      console.error('Erro ao moderar vaga:', err);
      res.status(500).json({ error: err.message ?? 'Erro interno no servidor' });
    }
  },

  async getEngagementMetrics(req: Request, res: Response) {
    try {
      const metrics = await AdminService.getEngagementMetrics();
      res.json(metrics);
    } catch (err: any) {
      console.error('Erro ao buscar métricas de engajamento:', err);
      res.status(500).json({ error: err.message ?? 'Erro interno no servidor' });
    }
  },

  async getAccessibilityMetrics(req: Request, res: Response) {
    try {
      const metrics = await AdminService.getAccessibilityMetrics();
      res.json(metrics);
    } catch (err: any) {
      console.error('Erro ao buscar métricas de acessibilidade:', err);
      res.status(500).json({ error: err.message ?? 'Erro interno no servidor' });
    }
  },
};
