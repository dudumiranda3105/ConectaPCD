import { api } from './api'
import { Job } from '@/types'
import { JobPostingFormValues } from '@/lib/schemas/job-posting-schema'

export const jobService = {
  getJobs: async (filters: any): Promise<Job[]> => {
    return api.get(`jobs?${new URLSearchParams(filters)}`)
  },

  getCompanyJobs: async (companyId: string): Promise<Job[]> => {
    return api.get(`companies/${companyId}/jobs`)
  },

  createJob: async (jobData: JobPostingFormValues): Promise<Job> => {
    return api.post('jobs', jobData)
  },
}
