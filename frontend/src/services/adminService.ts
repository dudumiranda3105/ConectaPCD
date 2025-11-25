import { api } from './api'
import { DashboardStats, Activity, User, CompanyProfile, Job } from '@/types'

interface Admin {
  id: string
  name: string
  email: string
  cargo: string
  joined: string
  status: string
}

interface CreateAdminData {
  name: string
  email: string
  password: string
  cargo?: string
}

export const adminService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    return api.get('admin/stats')
  },

  getRecentActivities: async (): Promise<Activity[]> => {
    return api.get('admin/activities')
  },

  getUsers: async (): Promise<any[]> => {
    return api.get('admin/users')
  },

  getCompanies: async (): Promise<CompanyProfile[]> => {
    return api.get('admin/companies')
  },

  getJobs: async (): Promise<any[]> => {
    return api.get('admin/jobs/moderation')
  },

  getJobsForModeration: async (): Promise<any[]> => {
    return api.get('admin/jobs/moderation')
  },

  moderateJob: async (
    jobId: string,
    status: 'Aprovada' | 'Reprovada',
  ): Promise<{ message: string }> => {
    return api.post(`admin/jobs/${jobId}/moderate`, { status })
  },

  getEngagementMetrics: async (): Promise<any[]> => {
    return api.get('admin/metrics/engagement')
  },

  getAccessibilityMetrics: async (): Promise<any[]> => {
    return api.get('admin/metrics/accessibility')
  },

  // Admin management methods
  getAdmins: async (): Promise<Admin[]> => {
    return api.get('admin/admins')
  },

  createAdmin: async (data: CreateAdminData): Promise<Admin> => {
    return api.post('admin/admins', data)
  },

  deleteAdmin: async (adminId: string): Promise<{ message: string }> => {
    return api.delete(`admin/admins/${adminId}`)
  },
}
