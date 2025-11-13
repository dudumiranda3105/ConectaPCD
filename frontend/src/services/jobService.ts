import { api } from './api'
import { Job } from '@/types'
import { JobPostingFormValues } from '@/lib/schemas/job-posting-schema'
import { mockJobs } from '@/lib/jobs' // Keep for mock implementation

// MOCK API DELAY
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

export const jobService = {
  getJobs: async (filters: any): Promise<Job[]> => {
    // Real: return api.get(`/jobs?${new URLSearchParams(filters)}`)
    await delay(1500)
    console.log('Filtering jobs with:', filters)
    return mockJobs.filter((job) => {
      if (
        filters.sector &&
        filters.sector !== 'all' &&
        job.sector !== filters.sector
      )
        return false
      if (
        filters.city &&
        !job.location.toLowerCase().includes(filters.city.toLowerCase())
      )
        return false
      if (
        filters.regime &&
        filters.regime !== 'all' &&
        job.regime !== filters.regime
      )
        return false
      if (
        filters.accessibilities &&
        filters.accessibilities.length > 0 &&
        !filters.accessibilities.every((acc: string) =>
          job.accessibilities.includes(acc as any),
        )
      )
        return false
      return true
    })
  },

  getCompanyJobs: async (companyId: string): Promise<Job[]> => {
    // Real: return api.get(`/companies/${companyId}/jobs`)
    await delay(1000)
    console.log('Fetching jobs for company:', companyId)
    return mockJobs
      .slice(0, 2)
      .map((j) => ({
        ...j,
        status: 'Ativa',
        applications: Math.floor(Math.random() * 30),
        createdAt: new Date().toISOString(),
      }))
  },

  createJob: async (jobData: JobPostingFormValues): Promise<Job> => {
    // Real: return api.post('/jobs', jobData)
    await delay(1000)
    const newJob: Job = {
      ...jobData,
      id: `JOB${Math.floor(Math.random() * 1000)}`,
      company: 'Empresa Logada',
      logo: 'https://img.usecurling.com/i?q=company&color=solid-black',
      location: 'Remoto',
      sector: 'Tecnologia',
      status: 'Ativa',
      applications: 0,
      createdAt: new Date().toISOString(),
    }
    console.log('Creating job:', newJob)
    return newJob
  },
}
