/**
 * Serviço para buscar dados de empresa via CNPJ usando a API BrasilAPI (pública e gratuita)
 */

export interface CnpjData {
  razao_social?: string
  nome_fantasia?: string
  ddd?: string
  telefone?: string
  error?: boolean
}

/**
 * Busca dados da empresa via CNPJ
 * @param cnpj CNPJ no formato 00.000.000/0000-00 ou 00000000000000
 * @returns Dados da empresa ou null se não encontrado
 */
export async function fetchCnpjData(cnpj: string): Promise<CnpjData | null> {
  try {
    // Remove caracteres especiais para a API
    const cleanCnpj = cnpj.replace(/\D/g, '')

    // Valida tamanho do CNPJ
    if (cleanCnpj.length !== 14) {
      return null
    }

    // Usa a API BrasilAPI que é pública e gratuita
    const response = await fetch(
      `https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`,
      {
        headers: {
          Accept: 'application/json',
        },
      }
    )

    // Se não encontrou (404), retorna null
    if (!response.ok) {
      console.warn(`[CNPJ Service] CNPJ ${cleanCnpj} não encontrado`)
      return null
    }

    const data = await response.json()

    console.log('[CNPJ Service] Dados retornados pela BrasilAPI:', data)

    // A API BrasilAPI retorna os dados diretamente
    return {
      razao_social: data.razao_social, // Razão social correta
      nome_fantasia: data.nome_fantasia || data.razao_social,
      telefone: data.ddd_telefone_1 || '',
    }
  } catch (error) {
    console.error('[CNPJ Service] Erro ao buscar CNPJ:', error)
    return null
  }
}
