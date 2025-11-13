export const mockUsers = [
  {
    id: 'USR001',
    name: 'Ana Beatriz',
    email: 'ana.beatriz@example.com',
    disability: 'Visual',
    joined: '2024-01-15',
    status: 'Ativo',
  },
  {
    id: 'USR002',
    name: 'Carlos Eduardo',
    email: 'carlos.eduardo@example.com',
    disability: 'Auditiva',
    joined: '2024-02-20',
    status: 'Ativo',
  },
  {
    id: 'USR003',
    name: 'Daniela Ferreira',
    email: 'daniela.ferreira@example.com',
    disability: 'Física/Motora',
    joined: '2024-03-10',
    status: 'Inativo',
  },
  {
    id: 'USR004',
    name: 'Felipe Alves',
    email: 'felipe.alves@example.com',
    disability: 'Múltipla',
    joined: '2024-04-05',
    status: 'Ativo',
  },
]

export const mockCompanies = [
  {
    id: 'CMP001',
    name: 'InovaTech Soluções',
    cnpj: '12.345.678/0001-99',
    sector: 'Tecnologia',
    joined: '2024-01-10',
    status: 'Verificada',
  },
  {
    id: 'CMP002',
    name: 'DataMind Analytics',
    cnpj: '98.765.432/0001-11',
    sector: 'Tecnologia',
    joined: '2024-02-15',
    status: 'Pendente',
  },
  {
    id: 'CMP003',
    name: 'Creative Solutions',
    cnpj: '55.555.555/0001-55',
    sector: 'Varejo',
    joined: '2024-03-25',
    status: 'Verificada',
  },
]

export const mockJobsForModeration = [
  {
    id: 'JOBMOD01',
    title: 'Engenheiro de Software Sênior',
    company: 'InovaTech Soluções',
    posted: '2024-05-18',
    status: 'Pendente',
  },
  {
    id: 'JOBMOD02',
    title: 'Cientista de Dados',
    company: 'DataMind Analytics',
    posted: '2024-05-17',
    status: 'Pendente',
  },
  {
    id: 'JOBMOD03',
    title: 'Vendedor de Loja',
    company: 'Creative Solutions',
    posted: '2024-05-16',
    status: 'Aprovada',
  },
  {
    id: 'JOBMOD04',
    title: 'Analista de Marketing Digital',
    company: 'InovaTech Soluções',
    posted: '2024-05-15',
    status: 'Reprovada',
  },
]

export const mockActivities = [
  {
    user: 'Ana Beatriz',
    action: 'atualizou seu perfil.',
    time: '5 minutos atrás',
  },
  {
    user: 'InovaTech Soluções',
    action: 'publicou uma nova vaga: Engenheiro de Software Sênior.',
    time: '15 minutos atrás',
  },
  {
    user: 'Carlos Eduardo',
    action: 'se candidatou para a vaga de UX Designer.',
    time: '1 hora atrás',
  },
  {
    user: 'Admin',
    action: 'aprovou o cadastro da empresa Creative Solutions.',
    time: '3 horas atrás',
  },
]
