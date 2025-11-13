import {
  SETORES_ATIVIDADE,
  ACESSIBILIDADES_OFERECIDAS,
} from '@/lib/schemas/company-signup-schema'
import { JOB_REGIMES, JOB_TYPES } from '@/lib/schemas/job-posting-schema'
import { DISABILITY_TYPES } from '@/lib/schemas/candidate-signup-schema'

export type UserRole = 'candidate' | 'company' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface CandidateProfile {
  name: string
  cpf: string
  email: string
  cep: string
  uf: string
  cidade: string
  bairro: string
  rua: string
  numero: string
  complemento?: string
  educationLevel: string
  course: string
  institution: string
  experiences: {
    company: string
    role: string
    startDate: string
    endDate?: string
  }[]
  disabilityTypes: (typeof DISABILITY_TYPES)[number][]
  barriers?: string[]
}

export interface CompanyProfile {
  id: string
  razaoSocial: string
  nomeFantasia: string
  cnpj: string
  setorAtividade: (typeof SETORES_ATIVIDADE)[number]
  siteEmpresa?: string
  telefone: string
  emailCorporativo: string
  status: 'Verificada' | 'Pendente' | 'Rejeitada'
  joined: string
}

export interface Job {
  id: string
  title: string
  company: string
  logo: string
  location: string
  sector: (typeof SETORES_ATIVIDADE)[number]
  regime: (typeof JOB_REGIMES)[number]
  type: (typeof JOB_TYPES)[number]
  description: string
  accessibilities: (typeof ACESSIBILIDADES_OFERECIDAS)[number][]
  status?: 'Ativa' | 'Pausada' | 'Fechada'
  applications?: number
  createdAt?: string
  benefits?: string
}

export interface Activity {
  id: string
  user: string
  action: string
  time: string
}

export interface DashboardStats {
  candidates: number
  companies: number
  activeJobs: number
  jobsToModerate: number
}
