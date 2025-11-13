import { prisma } from '../repositories/prisma'

interface MatchResult {
  candidatoId: number
  vagaId: number
  scoreTotal: number
  scoreAcessibilidades: number
  scoreSubtipos: number
  acessibilidadesAtendidas: number
  acessibilidadesTotal: number
  detalhes: {
    atendidas: Array<{ id: number; descricao: string; qualidade?: string }>
    nao_atendidas: Array<{ id: number; descricao: string; prioridade: string }>
    extras: Array<{ id: number; descricao: string }>
  }
}

export const MatchingService = {
  /**
   * Calcula compatibilidade entre um candidato e uma vaga
   */
  async calcularMatch(candidatoId: number, vagaId: number): Promise<MatchResult> {
    // Buscar necessidades do candidato
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
        }
      }
    })

    // Buscar ofertas da vaga
    const vaga = await prisma.vaga.findUnique({
      where: { id: vagaId },
      include: {
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

    // 1. Score de Subtipos (candidato tem subtipo aceito pela vaga?)
    const candidatoSubtipos = new Set(candidato.subtipos.map(s => s.subtipoId))
    const vagaSubtipos = new Set(vaga.subtiposAceitos.map(s => s.subtipoId))
    const subtiposCompativeis = Array.from(candidatoSubtipos).filter(id => vagaSubtipos.has(id))
    const scoreSubtipos = candidatoSubtipos.size > 0 ? 
      Math.round((subtiposCompativeis.length / candidatoSubtipos.size) * 100) : 100

    // 2. Score de Acessibilidades
    // Por enquanto, usar apenas necessidades derivadas das barreiras
    const necessidadesDerivadas = candidato.subtipos.flatMap(cs =>
      cs.barreiras.flatMap(csb =>
        csb.barreira.acessibilidades.map(ba => ({
          id: ba.acessibilidadeId,
          descricao: ba.acessibilidade.descricao,
          prioridade: 'importante' as const,
          fonte: 'barreira'
        }))
      )
    )

    // Remover duplicatas
    const necessidadesMap = new Map()
    necessidadesDerivadas.forEach(n => necessidadesMap.set(n.id, n))
    const necessidades = Array.from(necessidadesMap.values())

    // Acessibilidades oferecidas pela vaga
    const oferecidas = new Map(vaga.acessibilidades.map(va => [
      va.acessibilidadeId,
      va.acessibilidade
    ]))

    // Calcular atendimento
    const atendidas = necessidades.filter(n => oferecidas.has(n.id))
      .map(n => ({ ...n, qualidade: 'boa' }))
    
    const naoAtendidas = necessidades.filter(n => !oferecidas.has(n.id))
    
    const extras = vaga.acessibilidades
      .filter(va => !necessidades.some(n => n.id === va.acessibilidadeId))
      .map(va => va.acessibilidade)

    // Score ponderado por prioridade
    let pontos = 0, maxPontos = 0
    necessidades.forEach(n => {
      const peso = n.prioridade === 'essencial' ? 3 : n.prioridade === 'importante' ? 2 : 1
      maxPontos += peso
      if (oferecidas.has(n.id)) pontos += peso
    })

    const scoreAcessibilidades = maxPontos > 0 ? Math.round((pontos / maxPontos) * 100) : 100

    // Score total (média ponderada)
    const scoreTotal = Math.round((scoreSubtipos * 0.3) + (scoreAcessibilidades * 0.7))

    const resultado: MatchResult = {
      candidatoId,
      vagaId,
      scoreTotal,
      scoreAcessibilidades,
      scoreSubtipos,
      acessibilidadesAtendidas: atendidas.length,
      acessibilidadesTotal: necessidades.length,
      detalhes: { atendidas, nao_atendidas: naoAtendidas, extras }
    }

    return resultado
  },

  /**
   * Salva o resultado do matching no banco (caso a tabela MatchScore exista)
   */
  async salvarMatch(match: MatchResult): Promise<void> {
    try {
      // Verificar se a tabela existe antes de tentar usar
      await prisma.$queryRaw`SELECT 1 FROM "MatchScore" LIMIT 1`
      
      await prisma.matchScore.upsert({
        where: {
          candidatoId_vagaId: {
            candidatoId: match.candidatoId,
            vagaId: match.vagaId
          }
        },
        create: {
          candidatoId: match.candidatoId,
          vagaId: match.vagaId,
          scoreTotal: match.scoreTotal,
          scoreAcessibilidades: match.scoreAcessibilidades,
          scoreSubtipos: match.scoreSubtipos,
          acessibilidadesAtendidas: match.acessibilidadesAtendidas,
          acessibilidadesTotal: match.acessibilidadesTotal,
          detalhes: match.detalhes
        },
        update: {
          scoreTotal: match.scoreTotal,
          scoreAcessibilidades: match.scoreAcessibilidades,
          scoreSubtipos: match.scoreSubtipos,
          acessibilidadesAtendidas: match.acessibilidadesAtendidas,
          acessibilidadesTotal: match.acessibilidadesTotal,
          detalhes: match.detalhes,
          updatedAt: new Date()
        }
      })
    } catch (error) {
      // Tabela ainda não existe, apenas log o match
      console.log('Match calculado:', match)
    }
  },

  /**
   * Busca as melhores vagas para um candidato
   */
  async buscarMelhoresVagas(candidatoId: number, limite = 10) {
    // Buscar ou calcular matches para todas as vagas ativas
    const vagas = await prisma.vaga.findMany({
      where: { isActive: true },
      include: { empresa: true }
    })

    const matches = []
    for (const vaga of vagas) {
      try {
        const match = await this.calcularMatch(candidatoId, vaga.id)
        await this.salvarMatch(match)
        matches.push({ ...match, vaga })
      } catch (error) {
        console.error(`Erro ao calcular match para vaga ${vaga.id}:`, error)
      }
    }

    return matches
      .sort((a, b) => b.scoreTotal - a.scoreTotal)
      .slice(0, limite)
  },

  /**
   * Busca os melhores candidatos para uma vaga
   */
  async buscarMelhoresCandidatos(vagaId: number, limite = 10) {
    const candidatos = await prisma.candidato.findMany({
      where: { isActive: true }
    })

    const matches = []
    for (const candidato of candidatos) {
      try {
        const match = await this.calcularMatch(candidato.id, vagaId)
        await this.salvarMatch(match)
        matches.push({ ...match, candidato })
      } catch (error) {
        console.error(`Erro ao calcular match para candidato ${candidato.id}:`, error)
      }
    }

    return matches
      .sort((a, b) => b.scoreTotal - a.scoreTotal)
      .slice(0, limite)
  }
}