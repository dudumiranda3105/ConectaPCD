const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export async function getCompanyStats(token: string, empresaId: number) {
  const res = await fetch(`${API_URL}/empresas/${empresaId}/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) throw new Error('Erro ao buscar estatísticas da empresa')
  return res.json()
}
