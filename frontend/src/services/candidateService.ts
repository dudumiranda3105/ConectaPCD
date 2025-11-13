import { api } from './api'
import { CandidateProfile } from '@/types'
import { DISABILITY_TYPES } from '@/lib/schemas/candidate-signup-schema'

// MOCK API DELAY
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

const mockCandidateProfile: CandidateProfile = {
  name: 'João da Silva',
  cpf: '123.456.789-00',
  email: 'candidate@example.com',
  cep: '01001-000',
  uf: 'SP',
  cidade: 'São Paulo',
  bairro: 'Sé',
  rua: 'Praça da Sé',
  numero: '1',
  educationLevel: 'Superior Completo',
  course: 'Ciência da Computação',
  institution: 'Universidade de São Paulo',
  experiences: [
    {
      company: 'Tech Solutions',
      role: 'Desenvolvedor Junior',
      startDate: '2022-01',
      endDate: '2023-12',
    },
  ],
  disabilityTypes: ['Física/Motora' as const, 'Visual' as const],
  barriers: ['Arquitetônica'],
}

export const candidateService = {
  getProfile: async (): Promise<CandidateProfile> => {
    // Real: return api.get('/candidate/profile')
    await delay(1000)
    return mockCandidateProfile
  },

  updateProfile: async (
    profileData: Partial<CandidateProfile>,
  ): Promise<CandidateProfile> => {
    // Real: return api.put('/candidate/profile', profileData)
    await delay(1000)
    console.log('Updating profile with:', profileData)
    return { ...mockCandidateProfile, ...profileData }
  },

  applyToJob: async (jobId: string): Promise<{ message: string }> => {
    // Real: return api.post(`/jobs/${jobId}/apply`, {})
    await delay(500)
    console.log('Applying to job:', jobId)
    return { message: 'Application successful' }
  },
}
