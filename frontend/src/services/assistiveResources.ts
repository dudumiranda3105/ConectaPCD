const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export interface AssistiveResourceDTO {
  id: number
  nome: string
  descricao?: string | null
  mitigacoes: { barreiraId: number; eficiencia?: string | null }[]
}

export interface CandidatoRecursoAssistivoDTO {
  recursoId: number
  usoFrequencia?: string | null
  impactoMobilidade?: string | null
  recurso?: AssistiveResourceDTO
}

export async function getAssistiveResources(): Promise<AssistiveResourceDTO[]> {
  const res = await fetch(`${API_URL}/assistive-resources`)
  if (!res.ok) throw new Error('Falha ao carregar recursos assistivos')
  return res.json()
}

export const assistiveResourcesService = {
  list: async (): Promise<AssistiveResourceDTO[]> => {
    const res = await fetch(`${API_URL}/assistive-resources`)
    if (!res.ok) throw new Error('Falha ao carregar recursos assistivos')
    return res.json()
  },

  getById: async (id: number): Promise<AssistiveResourceDTO> => {
    const res = await fetch(`${API_URL}/assistive-resources/${id}`)
    if (!res.ok) throw new Error('Recurso assistivo não encontrado')
    return res.json()
  },

  create: async (
    nome: string, 
    descricao?: string, 
    mitigacoes?: { barreiraId: number; eficiencia?: string }[]
  ): Promise<AssistiveResourceDTO> => {
    const token = localStorage.getItem('auth_token')
    const res = await fetch(`${API_URL}/assistive-resources`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ nome, descricao, mitigacoes }),
    })
    if (!res.ok) throw new Error('Erro ao criar recurso assistivo')
    return res.json()
  },

  update: async (
    id: number, 
    nome: string, 
    descricao?: string,
    mitigacoes?: { barreiraId: number; eficiencia?: string }[]
  ): Promise<AssistiveResourceDTO> => {
    const token = localStorage.getItem('auth_token')
    const res = await fetch(`${API_URL}/assistive-resources/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ nome, descricao, mitigacoes }),
    })
    if (!res.ok) throw new Error('Erro ao atualizar recurso assistivo')
    return res.json()
  },

  delete: async (id: number): Promise<void> => {
    const token = localStorage.getItem('auth_token')
    const res = await fetch(`${API_URL}/assistive-resources/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
    if (!res.ok) throw new Error('Erro ao excluir recurso assistivo')
  },
}
