import { api } from './api'
import { DashboardStats, Activity, User, CompanyProfile, Job } from '@/types'
import {
  mockUsers,
  mockCompanies,
  mockJobsForModeration,
  mockActivities,
} from '@/lib/admin-mock-data'

// MOCK API DELAY
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

export const adminService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    // Real: return api.get('/admin/stats')
    await delay(1500)
    return {
      candidates: 1250,
      companies: 89,
      activeJobs: 234,
      jobsToModerate: 12,
    }
  },

  getRecentActivities: async (): Promise<Activity[]> => {
    // Real: return api.get('/admin/activities')
    await delay(1000)
    return mockActivities.map((a, i) => ({ ...a, id: `act-${i}` }))
  },

  getUsers: async (): Promise<any[]> => {
    // Real: return api.get('/admin/users')
    await delay(1000)
    return mockUsers
  },

  getCompanies: async (): Promise<CompanyProfile[]> => {
    // Real: return api.get('/admin/companies')
    await delay(1000)
    return mockCompanies
  },

  getJobsForModeration: async (): Promise<any[]> => {
    // Real: return api.get('/admin/jobs/moderation')
    await delay(1000)
    return mockJobsForModeration
  },

  moderateJob: async (
    jobId: string,
    status: 'Aprovada' | 'Reprovada',
  ): Promise<{ message: string }> => {
    // Real: return api.post(`/admin/jobs/${jobId}/moderate`, { status })
    await delay(500)
    console.log(`Moderating job ${jobId} to ${status}`)
    return { message: 'Job status updated' }
  },
}
