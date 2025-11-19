import { api } from './api'
import { DashboardStats, Activity, User, CompanyProfile, Job } from '@/types'

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
}
