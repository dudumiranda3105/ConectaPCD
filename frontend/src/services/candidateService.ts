import { api } from './api'
import { CandidateProfile } from '@/types'

export const candidateService = {
  getProfile: async (): Promise<CandidateProfile> => {
    return api.get('candidate/profile')
  },

  updateProfile: async (
    profileData: Partial<CandidateProfile>,
  ): Promise<CandidateProfile> => {
    return api.put('candidate/profile', profileData)
  },

  applyToJob: async (jobId: string): Promise<{ message: string }> => {
    return api.post(`jobs/${jobId}/apply`, {})
  },
}
