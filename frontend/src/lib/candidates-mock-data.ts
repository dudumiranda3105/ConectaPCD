export type Candidate = {
  id: string
  name: string
  email: string
  appliedDate: string
  matchScore: number
  disabilities: string[]
  status: 'Pendente' | 'Revisado' | 'Entrevistando' | 'Rejeitado' | 'Contratado'
}

export const mockCandidates: Record<string, Candidate[]> = {
  JOB001: [
    {
      id: 'CAND001',
      name: 'Maria Oliveira',
      email: 'maria.o@example.com',
      appliedDate: '2024-05-15',
      matchScore: 95,
      disabilities: ['Visual (Baixa Visão)'],
      status: 'Revisado',
    },
    {
      id: 'CAND002',
      name: 'João Souza',
      email: 'joao.s@example.com',
      appliedDate: '2024-05-14',
      matchScore: 88,
      disabilities: ['Física/Motora (Cadeirante)'],
      status: 'Entrevistando',
    },
    {
      id: 'CAND003',
      name: 'Ana Costa',
      email: 'ana.c@example.com',
      appliedDate: '2024-05-13',
      matchScore: 82,
      disabilities: ['Auditiva'],
      status: 'Pendente',
    },
  ],
  JOB002: [
    {
      id: 'CAND004',
      name: 'Pedro Martins',
      email: 'pedro.m@example.com',
      appliedDate: '2024-05-10',
      matchScore: 91,
      disabilities: ['Intelectual/Cognitiva'],
      status: 'Pendente',
    },
    {
      id: 'CAND005',
      name: 'Luiza Fernandes',
      email: 'luiza.f@example.com',
      appliedDate: '2024-05-09',
      matchScore: 78,
      disabilities: ['Visual (Cegueira)'],
      status: 'Rejeitado',
    },
  ],
}
