export interface AssistiveResourceDTO {
  id: number
  nome: string
  descricao?: string
  mitigacoes: { barreiraId: number; eficiencia?: string | null }[]
}

export async function getAssistiveResources(): Promise<AssistiveResourceDTO[]> {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/assistive-resources`)
  if (!res.ok) throw new Error('Falha ao carregar recursos assistivos')
  return res.json()
}
