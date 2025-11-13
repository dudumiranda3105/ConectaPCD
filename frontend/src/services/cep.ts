/**
 * Serviço para buscar endereço via CEP usando a API ViaCEP
 */

export interface CepData {
  logradouro?: string
  bairro?: string
  localidade?: string
  uf?: string
  erro?: boolean
}

/**
 * Busca endereço completo via CEP
 * @param cep CEP no formato 00000-000 ou 00000000
 * @returns Dados do endereço ou null se não encontrado
 */
export async function fetchCepData(cep: string): Promise<CepData | null> {
  try {
    // Remove caracteres especiais para a API
    const cleanCep = cep.replace(/\D/g, '')

    // Valida tamanho do CEP
    if (cleanCep.length !== 8) {
      return null
    }

    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
    const data = await response.json()

    // Verifica se a API retornou erro
    if (data.erro) {
      return null
    }

    return {
      logradouro: data.logradouro,
      bairro: data.bairro,
      localidade: data.localidade,
      uf: data.uf,
    }
  } catch (error) {
    console.error('[CEP Service] Erro ao buscar CEP:', error)
    return null
  }
}
