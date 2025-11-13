import { api } from './api'

// MOCK API DELAY
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

export const companyService = {
  getApplications: async (companyId: string): Promise<any[]> => {
    // Real: return api.get(`/companies/${companyId}/applications`)
    await delay(1000)
    console.log('Fetching applications for company:', companyId)
    return []
  },

  getAnalytics: async (companyId: string): Promise<any> => {
    // Real: return api.get(`/companies/${companyId}/analytics`)
    await delay(1000)
    console.log('Fetching analytics for company:', companyId)
    return {}
  },

  getSettings: async (companyId: string): Promise<any> => {
    // Real: return api.get(`/companies/${companyId}/settings`)
    await delay(1000)
    console.log('Fetching settings for company:', companyId)
    return {}
  },

  updateSettings: async (companyId: string, settings: any): Promise<any> => {
    // Real: return api.put(`/companies/${companyId}/settings`, settings)
    await delay(1000)
    console.log('Updating settings for company:', companyId, settings)
    return settings
  },
}
