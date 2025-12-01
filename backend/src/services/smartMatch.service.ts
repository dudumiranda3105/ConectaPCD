import { prisma } from '../repositories/prisma'

/**
 * Sistema de Match Inteligente com Score Ponderado
 * Analisa múltiplos critérios para gerar um score de compatibilidade
 */

export interface ScoreBreakdown {
  categoria: string
  nome: string
  score: number
  peso: number
  contribuicao: number
  detalhes: string
  icon: string
}

export interface SmartMatchResult {
  candidatoId: number
  vagaId: number
  scoreTotal: number
  scoreNormalizado: number // 0-100 ajustado
  classificacao: 'perfeito' | 'excelente' | 'bom' | 'razoavel' | 'baixo'
  compativel: boolean
  breakdown: ScoreBreakdown[]
  razoes: string[] // "Por que essa vaga combina"
  alertas: string[] // Pontos de atenção
  vaga?: any
}

// Pesos dos critérios (soma = 100%)
const PESOS = {
  acessibilidades: 35, // Mais importante para PCD
  subtipos: 25,       // Deficiências aceitas
  escolaridade: 15,   // Compatibilidade educacional
  regime: 15,         // Regime de trabalho
  localizacao: 10,    // Proximidade/região
}

export const SmartMatchService = {
  /**
   * Calcula match inteligente com múltiplos critérios
   */
  async calcularSmartMatch(candidatoId: number, vagaId: number): Promise<SmartMatchResult> {
    // Buscar candidato com todos os dados
    const candidato = await prisma.candidato.findUnique({
      where: { id: candidatoId },
      include: {
        subtipos: {
          include: {
            subtipo: { include: { tipo: true } },
            barreiras: {
              include: {
                barreira: {
                  include: {
                    acessibilidades: {
                      include: { acessibilidade: true }
                    }
                  }
                }
              }
            }
          }
        },
        acessibilidades: {
          include: { acessibilidade: true }
        },
        recursosAssistivos: {
          include: {
            recurso: {
              include: { mitigacoes: true }
            }
          }
        }
      }
    })

    // Buscar vaga com todos os dados
    const vaga = await prisma.vaga.findUnique({
      where: { id: vagaId },
      include: {
        empresa: true,
        acessibilidades: {
          include: { acessibilidade: true }
        },
        subtiposAceitos: {
          include: { subtipo: { include: { tipo: true } } }
        }
      }
    })

    if (!candidato || !vaga) {
      throw new Error('Candidato ou vaga não encontrados')
    }

    const breakdown: ScoreBreakdown[] = []
    const razoes: string[] = []
    const alertas: string[] = []

    // 1. SCORE DE ACESSIBILIDADES (35%)
    const acessibilidadeResult = this.calcularScoreAcessibilidades(candidato, vaga)
    breakdown.push({
      categoria: 'acessibilidade',
      nome: 'Acessibilidade',
      score: acessibilidadeResult.score,
      peso: PESOS.acessibilidades,
      contribuicao: Math.round((acessibilidadeResult.score * PESOS.acessibilidades) / 100),
      detalhes: acessibilidadeResult.detalhes,
      icon: '♿'
    })
    razoes.push(...acessibilidadeResult.razoes)
    alertas.push(...acessibilidadeResult.alertas)

    // 2. SCORE DE SUBTIPOS (25%)
    const subtiposResult = this.calcularScoreSubtipos(candidato, vaga)
    breakdown.push({
      categoria: 'subtipos',
      nome: 'Tipo de Deficiência',
      score: subtiposResult.score,
      peso: PESOS.subtipos,
      contribuicao: Math.round((subtiposResult.score * PESOS.subtipos) / 100),
      detalhes: subtiposResult.detalhes,
      icon: '👥'
    })
    razoes.push(...subtiposResult.razoes)
    alertas.push(...subtiposResult.alertas)

    // 3. SCORE DE ESCOLARIDADE (15%)
    const escolaridadeResult = this.calcularScoreEscolaridade(candidato, vaga)
    breakdown.push({
      categoria: 'escolaridade',
      nome: 'Escolaridade',
      score: escolaridadeResult.score,
      peso: PESOS.escolaridade,
      contribuicao: Math.round((escolaridadeResult.score * PESOS.escolaridade) / 100),
      detalhes: escolaridadeResult.detalhes,
      icon: '🎓'
    })
    razoes.push(...escolaridadeResult.razoes)
    alertas.push(...escolaridadeResult.alertas)

    // 4. SCORE DE REGIME DE TRABALHO (15%)
    const regimeResult = this.calcularScoreRegime(candidato, vaga)
    breakdown.push({
      categoria: 'regime',
      nome: 'Regime de Trabalho',
      score: regimeResult.score,
      peso: PESOS.regime,
      contribuicao: Math.round((regimeResult.score * PESOS.regime) / 100),
      detalhes: regimeResult.detalhes,
      icon: '🏢'
    })
    razoes.push(...regimeResult.razoes)
    alertas.push(...regimeResult.alertas)

    // 5. SCORE DE LOCALIZAÇÃO (10%)
    const localizacaoResult = this.calcularScoreLocalizacao(candidato, vaga)
    breakdown.push({
      categoria: 'localizacao',
      nome: 'Localização',
      score: localizacaoResult.score,
      peso: PESOS.localizacao,
      contribuicao: Math.round((localizacaoResult.score * PESOS.localizacao) / 100),
      detalhes: localizacaoResult.detalhes,
      icon: '📍'
    })
    razoes.push(...localizacaoResult.razoes)
    alertas.push(...localizacaoResult.alertas)

    // Calcular score total ponderado
    const scoreTotal = breakdown.reduce((acc, item) => acc + item.contribuicao, 0)
    
    // Normalizar para 0-100 (garantir limites)
    const scoreNormalizado = Math.min(100, Math.max(0, scoreTotal))

    // Determinar classificação
    const classificacao = this.getClassificacao(scoreNormalizado)

    // Determinar compatibilidade (score >= 50 E subtipos aceitos)
    const compativel = scoreNormalizado >= 50 && subtiposResult.score > 0

    return {
      candidatoId,
      vagaId,
      scoreTotal: scoreNormalizado,
      scoreNormalizado,
      classificacao,
      compativel,
      breakdown,
      razoes: razoes.filter(r => r), // Remover vazios
      alertas: alertas.filter(a => a),
      vaga: {
        id: vaga.id,
        titulo: vaga.titulo,
        descricao: vaga.descricao,
        escolaridade: vaga.escolaridade,
        regimeTrabalho: vaga.regimeTrabalho,
        tipo: vaga.tipo,
        beneficios: vaga.beneficios,
        isActive: vaga.isActive,
        empresa: {
          id: vaga.empresa.id,
          nome: vaga.empresa.nome,
          nomeFantasia: vaga.empresa.nomeFantasia,
          cidade: vaga.empresa.cidade,
          estado: vaga.empresa.estado
        }
      }
    }
  },

  /**
   * Score de Acessibilidades - verifica se a vaga atende às necessidades
   * Considera recursos assistivos do candidato que podem mitigar barreiras
   */
  calcularScoreAcessibilidades(candidato: any, vaga: any) {
    const razoes: string[] = []
    const alertas: string[] = []

    // Necessidades diretas do candidato
    const necessidadesDiretas = candidato.acessibilidades?.map((ca: any) => ({
      id: ca.acessibilidadeId,
      descricao: ca.acessibilidade.descricao,
      prioridade: ca.prioridade || 'importante'
    })) || []

    // Necessidades derivadas das barreiras
    const necessidadesBarreiras = candidato.subtipos?.flatMap((cs: any) =>
      cs.barreiras?.flatMap((csb: any) =>
        csb.barreira.acessibilidades?.map((ba: any) => ({
          id: ba.acessibilidadeId,
          descricao: ba.acessibilidade.descricao,
          prioridade: 'importante'
        })) || []
      ) || []
    ) || []

    // Combinar e remover duplicatas
    const todasNecessidades = new Map<number, any>()
    ;[...necessidadesDiretas, ...necessidadesBarreiras].forEach(n => {
      if (!todasNecessidades.has(n.id)) {
        todasNecessidades.set(n.id, n)
      }
    })
    const necessidades = Array.from(todasNecessidades.values())

    // Acessibilidades oferecidas pela vaga
    const oferecidas = new Set(vaga.acessibilidades?.map((va: any) => va.acessibilidadeId) || [])

    // Verificar recursos assistivos do candidato que mitigam barreiras
    const recursosComMitigacao = candidato.recursosAssistivos?.filter((ra: any) => 
      ra.recurso?.mitigacoes && ra.recurso.mitigacoes.length > 0
    ) || []
    
    // Coletar IDs de barreiras do candidato
    const barreirasIds = new Set(
      candidato.subtipos?.flatMap((cs: any) =>
        cs.barreiras?.map((csb: any) => csb.barreiraId) || []
      ) || []
    )
    
    // Verificar quais barreiras são mitigadas pelos recursos assistivos
    let barreirasMitigadas = 0
    const recursosMitigadores: string[] = []
    
    recursosComMitigacao.forEach((ra: any) => {
      const mitigacoesRelevantes = ra.recurso.mitigacoes.filter((m: any) => 
        barreirasIds.has(m.barreiraId)
      )
      if (mitigacoesRelevantes.length > 0) {
        barreirasMitigadas += mitigacoesRelevantes.length
        recursosMitigadores.push(ra.recurso.nome)
      }
    })

    if (necessidades.length === 0) {
      // Bônus se candidato tem recursos assistivos que mitigam barreiras
      if (barreirasMitigadas > 0) {
        razoes.push(`Seus recursos assistivos (${recursosMitigadores.join(', ')}) ajudam a mitigar barreiras`)
      }
      return {
        score: 100,
        detalhes: 'Sem necessidades específicas',
        razoes: razoes.length > 0 ? razoes : ['Você não possui necessidades específicas de acessibilidade'],
        alertas: []
      }
    }

    // Calcular score ponderado
    let pontos = 0
    let maxPontos = 0
    const atendidas: string[] = []
    const naoAtendidas: string[] = []

    necessidades.forEach(n => {
      const peso = n.prioridade === 'importante' ? 2 : 1
      maxPontos += peso
      if (oferecidas.has(n.id)) {
        pontos += peso
        atendidas.push(n.descricao)
      } else {
        naoAtendidas.push(n.descricao)
      }
    })

    let score = maxPontos > 0 ? Math.round((pontos / maxPontos) * 100) : 100
    
    // Bônus de até 15 pontos se recursos assistivos mitigam barreiras
    if (barreirasMitigadas > 0 && score < 100) {
      const bonus = Math.min(15, barreirasMitigadas * 5) // até 15 pontos
      score = Math.min(100, score + bonus)
      razoes.push(`+${bonus} pontos: seus recursos assistivos ajudam a compensar barreiras`)
    }

    // Gerar razões e alertas
    if (atendidas.length > 0) {
      razoes.push(`Oferece ${atendidas.length} acessibilidade(s) que você precisa`)
    }
    if (score === 100 && necessidades.length > 0) {
      razoes.push('Atende 100% das suas necessidades de acessibilidade!')
    }
    if (naoAtendidas.length > 0) {
      alertas.push(`Não oferece: ${naoAtendidas.slice(0, 2).join(', ')}${naoAtendidas.length > 2 ? '...' : ''}`)
    }

    return {
      score,
      detalhes: `${atendidas.length}/${necessidades.length} necessidades atendidas${barreirasMitigadas > 0 ? ' (com bônus de recursos)' : ''}`,
      razoes,
      alertas
    }
  },

  /**
   * Score de Subtipos - verifica se a vaga aceita o tipo de deficiência
   */
  calcularScoreSubtipos(candidato: any, vaga: any) {
    const razoes: string[] = []
    const alertas: string[] = []

    const candidatoSubtipos = new Set(candidato.subtipos?.map((cs: any) => cs.subtipoId) || [])
    const vagaSubtipos = new Set(vaga.subtiposAceitos?.map((vs: any) => vs.subtipoId) || [])

    // Se a vaga não especificou subtipos, aceita todos
    if (vagaSubtipos.size === 0) {
      razoes.push('Vaga aberta a todos os tipos de deficiência')
      return {
        score: 100,
        detalhes: 'Aceita todos os tipos',
        razoes,
        alertas: []
      }
    }

    if (candidatoSubtipos.size === 0) {
      return {
        score: 50,
        detalhes: 'Perfil sem deficiência especificada',
        razoes: [],
        alertas: ['Complete seu perfil com o tipo de deficiência']
      }
    }

    // Verificar intersecção
    const aceitos = Array.from(candidatoSubtipos).filter(id => vagaSubtipos.has(id))
    const score = Math.round((aceitos.length / candidatoSubtipos.size) * 100)

    if (score === 100) {
      razoes.push('Sua deficiência é totalmente aceita pela vaga')
    } else if (score > 0) {
      razoes.push('Parte das suas deficiências são aceitas')
    }

    if (score === 0) {
      alertas.push('Sua deficiência pode não ser aceita por esta vaga')
    }

    return {
      score,
      detalhes: `${aceitos.length}/${candidatoSubtipos.size} tipos aceitos`,
      razoes,
      alertas
    }
  },

  /**
   * Score de Escolaridade - compara nível educacional
   */
  calcularScoreEscolaridade(candidato: any, vaga: any) {
    const razoes: string[] = []
    const alertas: string[] = []

    const niveis = [
      'fundamental_incompleto',
      'fundamental',
      'medio_incompleto',
      'medio',
      'tecnico',
      'superior_incompleto',
      'superior',
      'pos_graduacao',
      'mestrado',
      'doutorado'
    ]

    const normalizarNivel = (nivel: string | null | undefined): string => {
      if (!nivel) return 'nao_informado'
      const normalizado = nivel.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '_')
        .replace(/-/g, '_')
      return normalizado
    }

    const candidatoNivel = normalizarNivel(candidato.escolaridade)
    const vagaNivel = normalizarNivel(vaga.escolaridade)

    if (vagaNivel === 'nao_informado' || !vaga.escolaridade) {
      razoes.push('Vaga não exige escolaridade específica')
      return {
        score: 100,
        detalhes: 'Sem requisito de escolaridade',
        razoes,
        alertas: []
      }
    }

    if (candidatoNivel === 'nao_informado') {
      alertas.push('Complete sua escolaridade no perfil')
      return {
        score: 50,
        detalhes: 'Escolaridade não informada',
        razoes: [],
        alertas
      }
    }

    const candidatoIdx = niveis.findIndex(n => candidatoNivel.includes(n))
    const vagaIdx = niveis.findIndex(n => vagaNivel.includes(n))

    if (candidatoIdx === -1 || vagaIdx === -1) {
      return {
        score: 75,
        detalhes: 'Escolaridade compatível',
        razoes: [],
        alertas: []
      }
    }

    if (candidatoIdx >= vagaIdx) {
      const diff = candidatoIdx - vagaIdx
      if (diff >= 2) {
        razoes.push('Sua escolaridade supera o requisito!')
      } else {
        razoes.push('Sua escolaridade atende ao requisito')
      }
      return {
        score: 100,
        detalhes: 'Atende ou supera requisito',
        razoes,
        alertas: []
      }
    }

    // Candidato abaixo do requisito
    const diff = vagaIdx - candidatoIdx
    const score = Math.max(0, 100 - (diff * 25))
    
    if (diff === 1) {
      alertas.push('Escolaridade um nível abaixo do requisito')
    } else {
      alertas.push('Escolaridade abaixo do requisito da vaga')
    }

    return {
      score,
      detalhes: `Requisito: ${vaga.escolaridade}`,
      razoes,
      alertas
    }
  },

  /**
   * Score de Regime de Trabalho - preferências de trabalho
   */
  calcularScoreRegime(candidato: any, vaga: any) {
    const razoes: string[] = []
    const alertas: string[] = []

    const vagaRegime = vaga.regimeTrabalho?.toLowerCase() || ''
    
    // Se não especificou regime, é neutro
    if (!vagaRegime) {
      return {
        score: 75,
        detalhes: 'Regime não especificado',
        razoes: [],
        alertas: []
      }
    }

    // Verificar se é remoto (muito valorizado para PCD)
    const isRemoto = vagaRegime.includes('remoto') || vagaRegime.includes('home')
    const isHibrido = vagaRegime.includes('hibrido') || vagaRegime.includes('híbrido')
    const isPresencial = vagaRegime.includes('presencial')

    if (isRemoto) {
      razoes.push('Oferece trabalho remoto - ideal para acessibilidade!')
      return {
        score: 100,
        detalhes: 'Trabalho Remoto',
        razoes,
        alertas: []
      }
    }

    if (isHibrido) {
      razoes.push('Regime híbrido - flexibilidade de horários')
      return {
        score: 85,
        detalhes: 'Regime Híbrido',
        razoes,
        alertas: []
      }
    }

    if (isPresencial) {
      alertas.push('Trabalho presencial - verifique acessibilidade do local')
      return {
        score: 60,
        detalhes: 'Presencial',
        razoes: [],
        alertas
      }
    }

    return {
      score: 75,
      detalhes: vaga.regimeTrabalho || 'Não especificado',
      razoes,
      alertas
    }
  },

  /**
   * Score de Localização - proximidade geográfica
   */
  calcularScoreLocalizacao(candidato: any, vaga: any) {
    const razoes: string[] = []
    const alertas: string[] = []

    const candidatoCidade = candidato.cidade?.toLowerCase().trim() || ''
    const candidatoEstado = candidato.estado?.toLowerCase().trim() || ''
    const empresaCidade = vaga.empresa?.cidade?.toLowerCase().trim() || ''
    const empresaEstado = vaga.empresa?.estado?.toLowerCase().trim() || ''
    const vagaRegime = vaga.regimeTrabalho?.toLowerCase() || ''

    // Se é remoto, localização não importa
    if (vagaRegime.includes('remoto') || vagaRegime.includes('home')) {
      razoes.push('Trabalho remoto - localização não é relevante')
      return {
        score: 100,
        detalhes: 'Remoto',
        razoes,
        alertas: []
      }
    }

    // Sem localização informada
    if (!candidatoCidade && !candidatoEstado) {
      alertas.push('Informe sua localização no perfil')
      return {
        score: 50,
        detalhes: 'Localização não informada',
        razoes: [],
        alertas
      }
    }

    if (!empresaCidade && !empresaEstado) {
      return {
        score: 75,
        detalhes: 'Empresa sem localização',
        razoes: [],
        alertas: []
      }
    }

    // Mesma cidade
    if (candidatoCidade && empresaCidade && candidatoCidade === empresaCidade) {
      razoes.push(`Mesma cidade: ${vaga.empresa.cidade}`)
      return {
        score: 100,
        detalhes: `${vaga.empresa.cidade}`,
        razoes,
        alertas: []
      }
    }

    // Mesmo estado
    if (candidatoEstado && empresaEstado && candidatoEstado === empresaEstado) {
      razoes.push(`Mesmo estado: ${vaga.empresa.estado}`)
      return {
        score: 80,
        detalhes: `${vaga.empresa.estado}`,
        razoes,
        alertas: []
      }
    }

    // Estados diferentes
    alertas.push('Empresa em outro estado - considere custos de deslocamento')
    return {
      score: 40,
      detalhes: `${vaga.empresa.cidade || ''}, ${vaga.empresa.estado || ''}`,
      razoes,
      alertas
    }
  },

  /**
   * Determina classificação baseada no score
   */
  getClassificacao(score: number): 'perfeito' | 'excelente' | 'bom' | 'razoavel' | 'baixo' {
    if (score >= 95) return 'perfeito'
    if (score >= 80) return 'excelente'
    if (score >= 60) return 'bom'
    if (score >= 40) return 'razoavel'
    return 'baixo'
  },

  /**
   * Busca todas as vagas com smart match para um candidato
   */
  async buscarVagasComSmartMatch(candidatoId: number, limite = 20): Promise<SmartMatchResult[]> {
    const vagas = await prisma.vaga.findMany({
      where: { isActive: true },
      take: 100 // Limitar busca inicial
    })

    const results: SmartMatchResult[] = []

    for (const vaga of vagas) {
      try {
        const match = await this.calcularSmartMatch(candidatoId, vaga.id)
        results.push(match)
      } catch (error) {
        console.error(`Erro ao calcular smart match para vaga ${vaga.id}:`, error)
      }
    }

    // Ordenar por score e limitar
    return results
      .sort((a, b) => b.scoreTotal - a.scoreTotal)
      .slice(0, limite)
  }
}
