import {
  ACESSIBILIDADES_OFERECIDAS,
  SETORES_ATIVIDADE,
} from './schemas/company-signup-schema'
import { JOB_REGIMES, JOB_TYPES } from './schemas/job-posting-schema'
import { JobPostingFormValues } from './schemas/job-posting-schema'

export type Job = JobPostingFormValues & {
  id: string
  company: string
  logo: string
  location: string
  sector: (typeof SETORES_ATIVIDADE)[number]
  status: 'Ativa' | 'Pausada' | 'Fechada'
  applications: number
  createdAt: string
  matchScore?: number
  subtiposAceitos?: Array<{
    subtipo: {
      id: number
      nome: string
      tipoId?: number
      tipo?: {
        id: number
        nome: string
      }
    }
  }>
}
