import { prisma } from './prisma'

export const upsertByUserId = async (candidateId: number, profileData: any) => {
  const existing = await prisma.candidato.findUnique({ where: { id: candidateId } })
  if (existing) {
    const updated = await prisma.candidato.update({
      where: { id: existing.id },
      data: {
        nome: profileData.name !== undefined ? profileData.name : existing.nome,
        cpf: profileData.cpf !== undefined ? profileData.cpf : existing.cpf,
        email: profileData.email !== undefined ? profileData.email : existing.email,
        telefone: profileData.telefone !== undefined ? profileData.telefone : existing.telefone,
        dataNascimento: profileData.dataNascimento ? new Date(profileData.dataNascimento) : existing.dataNascimento,
        genero: profileData.genero !== undefined ? profileData.genero : existing.genero,
        escolaridade: profileData.educationLevel !== undefined ? profileData.educationLevel : existing.escolaridade,
        cep: profileData.cep !== undefined ? profileData.cep : existing.cep,
        estado: profileData.uf !== undefined ? profileData.uf : existing.estado,
        cidade: profileData.cidade !== undefined ? profileData.cidade : existing.cidade,
        endereco: profileData.rua !== undefined ? profileData.rua : existing.endereco,
        curriculoUrl: profileData.curriculoUrl !== undefined ? profileData.curriculoUrl : existing.curriculoUrl,
        linkedin: profileData.linkedin !== undefined ? profileData.linkedin : existing.linkedin,
        portfolio: profileData.portfolio !== undefined ? profileData.portfolio : existing.portfolio,
        experiencias: profileData.experiencias !== undefined ? profileData.experiencias : existing.experiencias,
      },
      include: {
        subtipos: {
          include: {
            subtipo: { include: { tipo: true } },
            barreiras: { include: { barreira: true } },
          },
        },
        recursosAssistivos: { include: { recurso: true } },
      },
    })
    // atualizar recursos assistivos se enviados
    if (Array.isArray(profileData.assistiveResources)) {
      const incoming = profileData.assistiveResources as Array<{ recursoId: number; usoFrequencia?: string; impactoMobilidade?: string }>
      const incomingIds = new Set(incoming.map(r => r.recursoId))
      const current = await prisma.candidatoRecursoAssistivo.findMany({ where: { candidatoId: existing.id } })
      const toRemove = current.filter(c => !incomingIds.has(c.recursoId))
      if (toRemove.length) {
        await prisma.candidatoRecursoAssistivo.deleteMany({
          where: { candidatoId: existing.id, recursoId: { in: toRemove.map(r => r.recursoId) } }
        })
      }
      // upsert cada recurso
      for (const r of incoming) {
        await prisma.candidatoRecursoAssistivo.upsert({
          where: { candidatoId_recursoId: { candidatoId: existing.id, recursoId: r.recursoId } },
          create: { candidatoId: existing.id, recursoId: r.recursoId, usoFrequencia: r.usoFrequencia, impactoMobilidade: r.impactoMobilidade },
          update: { usoFrequencia: r.usoFrequencia, impactoMobilidade: r.impactoMobilidade }
        })
      }
    }

    // atualizar deficiências (subtipos e barreiras)
    if (Array.isArray(profileData.disabilities)) {
      // Limpar subtipos e barreiras antigas
      await prisma.candidatoSubtipoBarreira.deleteMany({ where: { candidatoId: existing.id } })
      await prisma.candidatoSubtipo.deleteMany({ where: { candidatoId: existing.id } })

      // Criar novos subtipos e barreiras
      for (const disability of profileData.disabilities) {
        for (const subtype of disability.subtypes) {
          // Buscar acessibilidade principal para este subtipo/barreiras
          let acessibilidadeId = null
          if (subtype.barriers && subtype.barriers.length > 0) {
            const primeiraAcessibilidade = await prisma.barreiraAcessibilidade.findFirst({
              where: { barreiraId: { in: subtype.barriers } },
              select: { acessibilidadeId: true }
            })
            acessibilidadeId = primeiraAcessibilidade?.acessibilidadeId || null
          }

          // Criar CandidatoSubtipo com acessibilidade
          await prisma.candidatoSubtipo.create({
            data: {
              candidatoId: existing.id,
              subtipoId: subtype.subtypeId,
              acessibilidadeId,
              prioridade: 'importante',
              observacoes: subtype.observacoes || null
            }
          })

          // Criar CandidatoSubtipoBarreira para cada barreira
          for (const barrierId of subtype.barriers) {
            await prisma.candidatoSubtipoBarreira.create({
              data: {
                candidatoId: existing.id,
                subtipoId: subtype.subtypeId,
                barreiraId: barrierId
              }
            })
          }
        }
      }
    }

    // atualizar acessibilidades derivadas das barreiras (mantido para compatibilidade)
    if (Array.isArray(profileData.disabilities)) {
      // Limpar acessibilidades antigas
      await prisma.candidatoAcessibilidade.deleteMany({ where: { candidatoId: existing.id } })

      // Buscar acessibilidades necessárias baseadas nas barreiras
      const barreiraIds: number[] = []
      for (const disability of profileData.disabilities) {
        for (const subtype of disability.subtypes) {
          barreiraIds.push(...subtype.barriers)
        }
      }

      if (barreiraIds.length > 0) {
        const acessibilidadesNecessarias = await prisma.barreiraAcessibilidade.findMany({
          where: { barreiraId: { in: barreiraIds } },
          select: { acessibilidadeId: true },
          distinct: ['acessibilidadeId']
        })

        // Criar CandidatoAcessibilidade
        for (const { acessibilidadeId } of acessibilidadesNecessarias) {
          await prisma.candidatoAcessibilidade.create({
            data: {
              candidatoId: existing.id,
              acessibilidadeId,
              prioridade: 'importante'
            }
          })
        }
      }
    }

    return prisma.candidato.findUnique({
      where: { id: existing.id },
      include: {
        subtipos: { include: { subtipo: { include: { tipo: true } }, barreiras: { include: { barreira: true } } } },
        recursosAssistivos: { include: { recurso: true } },
        acessibilidades: { include: { acessibilidade: true } }
      }
    })
  }
  // Se não existir, cria novo candidato básico
  const created = await prisma.candidato.create({
    data: {
      nome: profileData.name || 'Sem nome',
      cpf: profileData.cpf,
      email: profileData.email,
      telefone: profileData.telefone,
      dataNascimento: profileData.dataNascimento ? new Date(profileData.dataNascimento) : undefined,
      genero: profileData.genero,
      escolaridade: profileData.educationLevel || 'Não informado',
      cep: profileData.cep,
      estado: profileData.uf,
      cidade: profileData.cidade,
      endereco: profileData.rua,
      curriculoUrl: profileData.curriculoUrl,
      linkedin: profileData.linkedin,
      portfolio: profileData.portfolio,
      experiencias: profileData.experiencias,
    },
    include: {
      subtipos: {
        include: {
          subtipo: { include: { tipo: true } },
          barreiras: { include: { barreira: true } },
        },
      },
      recursosAssistivos: { include: { recurso: true } },
    },
  })
  if (Array.isArray(profileData.assistiveResources)) {
    for (const r of profileData.assistiveResources as Array<{ recursoId: number; usoFrequencia?: string; impactoMobilidade?: string }>) {
      await prisma.candidatoRecursoAssistivo.create({
        data: { candidatoId: created.id, recursoId: r.recursoId, usoFrequencia: r.usoFrequencia, impactoMobilidade: r.impactoMobilidade }
      })
    }
  }

  // Criar subtipos e barreiras
  if (Array.isArray(profileData.disabilities)) {
    for (const disability of profileData.disabilities) {
      for (const subtype of disability.subtypes) {
        // Buscar acessibilidade principal para este subtipo/barreiras
        let acessibilidadeId = null
        if (subtype.barriers && subtype.barriers.length > 0) {
          const primeiraAcessibilidade = await prisma.barreiraAcessibilidade.findFirst({
            where: { barreiraId: { in: subtype.barriers } },
            select: { acessibilidadeId: true }
          })
          acessibilidadeId = primeiraAcessibilidade?.acessibilidadeId || null
        }

        // Criar CandidatoSubtipo com acessibilidade
        await prisma.candidatoSubtipo.create({
          data: {
            candidatoId: created.id,
            subtipoId: subtype.subtypeId,
            acessibilidadeId,
            prioridade: 'importante',
            observacoes: subtype.observacoes || null
          }
        })

        // Criar CandidatoSubtipoBarreira para cada barreira
        for (const barrierId of subtype.barriers) {
          await prisma.candidatoSubtipoBarreira.create({
            data: {
              candidatoId: created.id,
              subtipoId: subtype.subtypeId,
              barreiraId: barrierId
            }
          })
        }
      }
    }
  }

  // Criar acessibilidades derivadas das barreiras (mantido para compatibilidade)
  if (Array.isArray(profileData.disabilities)) {
    const barreiraIds: number[] = []
    for (const disability of profileData.disabilities) {
      for (const subtype of disability.subtypes) {
        barreiraIds.push(...subtype.barriers)
      }
    }

    if (barreiraIds.length > 0) {
      const acessibilidadesNecessarias = await prisma.barreiraAcessibilidade.findMany({
        where: { barreiraId: { in: barreiraIds } },
        select: { acessibilidadeId: true },
        distinct: ['acessibilidadeId']
      })

      // Criar CandidatoAcessibilidade
      for (const { acessibilidadeId } of acessibilidadesNecessarias) {
        await prisma.candidatoAcessibilidade.create({
          data: {
            candidatoId: created.id,
            acessibilidadeId,
            prioridade: 'importante'
          }
        })
      }
    }
  }

  return prisma.candidato.findUnique({
    where: { id: created.id },
    include: {
      subtipos: { include: { subtipo: { include: { tipo: true } }, barreiras: { include: { barreira: true } } } },
      recursosAssistivos: { include: { recurso: true } },
      acessibilidades: { include: { acessibilidade: true } }
    }
  })
}

export const findByUserId = async (candidateId: number) => {
  return prisma.candidato.findUnique({
    where: { id: candidateId },
    include: {
      subtipos: {
        include: {
          subtipo: { include: { tipo: true } },
          barreiras: { include: { barreira: true } },
        },
      },
      recursosAssistivos: { include: { recurso: true } },
      acessibilidades: { include: { acessibilidade: true } }
    },
  })
}
