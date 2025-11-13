import { create } from 'zustand'
import { Job } from '@/lib/jobs'
import { JobPostingFormValues } from '@/lib/schemas/job-posting-schema'
import {
  ACESSIBILIDADES_OFERECIDAS,
  SETORES_ATIVIDADE,
} from '@/lib/schemas/company-signup-schema'
import { JOB_REGIMES, JOB_TYPES } from '@/lib/schemas/job-posting-schema'

type JobState = {
  jobs: Job[]
  addJob: (jobData: JobPostingFormValues) => void
  closeJob: (jobId: string) => void
  setJobs: (jobs: Job[]) => void
}

const initialJobs: Job[] = [
  {
    id: '1',
    title: 'Desenvolvedor Frontend Pleno',
    company: 'InovaTech Soluções',
    logo: 'https://img.usecurling.com/i?q=tech&color=azure',
    location: 'São Paulo',
    sector: 'Tecnologia',
    regime: 'Híbrido',
    type: 'Tempo integral',
    description:
      'Buscamos um desenvolvedor frontend experiente para se juntar à nossa equipe inovadora. Requisitos: React, TypeScript, e paixão por acessibilidade.',
    accessibilities: [
      'Rampas de acesso',
      'Software de leitura de tela',
      'Mobiliário adaptado',
      'Sanitários adaptados',
    ],
    status: 'Ativa',
    applications: 25,
    createdAt: '2024-05-10T10:00:00Z',
    benefits: 'VR, VT, Plano de Saúde',
  },
  {
    id: '2',
    title: 'Analista de Dados Júnior',
    company: 'DataMind Analytics',
    logo: 'https://img.usecurling.com/i?q=data&color=violet',
    location: 'Remoto',
    sector: 'Tecnologia',
    regime: 'Remoto',
    type: 'Tempo integral',
    description:
      'Oportunidade para analista de dados júnior para trabalhar com grandes volumes de dados e gerar insights para nossos clientes.',
    accessibilities: ['Software de leitura de tela'],
    status: 'Pausada',
    applications: 12,
    createdAt: '2024-05-01T14:30:00Z',
    benefits: 'Bolsa auxílio, VR',
  },
  {
    id: '3',
    title: 'UX Designer com Foco em Acessibilidade',
    company: 'Creative Solutions',
    logo: 'https://img.usecurling.com/i?q=design&color=rose',
    location: 'Rio de Janeiro',
    sector: 'Tecnologia',
    regime: 'Presencial',
    type: 'Tempo integral',
    description:
      'Designer de UX para criar experiências de usuário intuitivas e acessíveis. Experiência com WCAG é um diferencial.',
    accessibilities: [
      'Rampas de acesso',
      'Sanitários adaptados',
      'Piso tátil',
      'Intérprete de Libras',
    ],
    status: 'Ativa',
    applications: 18,
    createdAt: '2024-04-25T09:00:00Z',
    benefits: 'VR, VT, Plano de Saúde, Horário Flexível',
  },
  {
    id: '4',
    title: 'Gerente de Projetos de TI',
    company: 'Connecta LTDA',
    logo: 'https://img.usecurling.com/i?q=connect&color=green',
    location: 'Belo Horizonte',
    sector: 'Tecnologia',
    regime: 'Híbrido',
    type: 'Contrato',
    description:
      'Gerente de projetos para liderar equipes de desenvolvimento de software em projetos desafiadores.',
    accessibilities: [
      'Vagas de estacionamento para PCDs',
      'Elevadores adaptados',
    ],
    status: 'Ativa',
    applications: 32,
    createdAt: '2024-04-20T11:00:00Z',
    benefits: 'VR, VT, Plano de Saúde',
  },
  {
    id: '5',
    title: 'Assistente Administrativo',
    company: 'Varejo Mais',
    logo: 'https://img.usecurling.com/i?q=retail&color=orange',
    location: 'Curitiba',
    sector: 'Varejo',
    regime: 'Presencial',
    type: 'Meio período',
    description:
      'Vaga para assistente administrativo para dar suporte às operações diárias da nossa loja matriz.',
    accessibilities: ['Rampas de acesso', 'Sanitários adaptados'],
    status: 'Ativa',
    applications: 41,
    createdAt: '2024-04-15T16:00:00Z',
    benefits: 'VR, VT',
  },
  {
    id: '6',
    title: 'Enfermeiro(a) Chefe',
    company: 'Saúde & Bem-Estar Hospital',
    logo: 'https://img.usecurling.com/i?q=health&color=red',
    location: 'Salvador',
    sector: 'Saúde',
    regime: 'Presencial',
    type: 'Tempo integral',
    description:
      'Liderar a equipe de enfermagem, garantindo a qualidade do atendimento e o bem-estar dos pacientes.',
    accessibilities: [
      'Rampas de acesso',
      'Sanitários adaptados',
      'Elevadores adaptados',
      'Vagas de estacionamento para PCDs',
    ],
    status: 'Ativa',
    applications: 15,
    createdAt: '2024-04-10T08:00:00Z',
    benefits: 'VR, VT, Plano de Saúde, Adicional Noturno',
  },
]

export const useJobStore = create<JobState>((set) => ({
  jobs: initialJobs,
  setJobs: (jobs) => set(() => ({ jobs })),
  addJob: (jobData) =>
    set((state) => {
      const newJob: Job = {
        ...jobData,
        id: `JOB${String(state.jobs.length + 1).padStart(3, '0')}`,
        status: 'Ativa',
        applications: 0,
        createdAt: new Date().toISOString(),
        company: 'Empresa Contratante', // Placeholder, ideally from user session
        logo: 'https://img.usecurling.com/i?q=building&color=gray',
        location: 'Brasil', // Placeholder
        sector: 'Tecnologia', // Placeholder
      }
      return { jobs: [newJob, ...state.jobs] }
    }),
  closeJob: (jobId) =>
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.id === jobId ? { ...job, status: 'Fechada' } : job,
      ),
    })),
}))
