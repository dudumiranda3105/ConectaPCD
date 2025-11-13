import { prisma } from './prisma'

export const CandidatoSubtipoRepo = {
  async replaceSubtipos(candidatoId: number, disabilities: Array<{
    typeId: number
    subtypeId: number
    barriers: number[]
  }>) {
    // Validar se o candidato existe
    const candidato = await prisma.candidato.findUnique({
      where: { id: candidatoId }
    })
    if (!candidato) {
      throw new Error(`Candidato ${candidatoId} não encontrado`)
    }

    // Validar se todos os subtipos existem
    const subtypeIds = disabilities.map(d => d.subtypeId)
    const existingSubtypes = await prisma.subtipoDeficiencia.findMany({
      where: { id: { in: subtypeIds } }
    })
    const existingSubtypeIds = new Set(existingSubtypes.map(s => s.id))
    const invalidSubtypes = subtypeIds.filter(id => !existingSubtypeIds.has(id))
    if (invalidSubtypes.length > 0) {
      throw new Error(`Subtipos inválidos: ${invalidSubtypes.join(', ')}`)
    }

    // Validar se todas as barreiras existem
    const allBarriers = disabilities.flatMap(d => d.barriers)
    if (allBarriers.length > 0) {
      const existingBarriers = await prisma.barreira.findMany({
        where: { id: { in: allBarriers } }
      })
      const existingBarrierIds = new Set(existingBarriers.map(b => b.id))
      const invalidBarriers = allBarriers.filter(id => !existingBarrierIds.has(id))
      if (invalidBarriers.length > 0) {
        throw new Error(`Barreiras inválidas: ${invalidBarriers.join(', ')}`)
      }
    }

    // Remover todos os subtipos e barreiras existentes
    await prisma.candidatoSubtipoBarreira.deleteMany({
      where: { candidatoId }
    })
    await prisma.candidatoSubtipo.deleteMany({
      where: { candidatoId }
    })

    // Adicionar novos subtipos e barreiras
    for (const disability of disabilities) {
      // Criar relação candidato-subtipo
      await prisma.candidatoSubtipo.create({
        data: {
          candidatoId,
          subtipoId: disability.subtypeId,
        }
      })

      // Criar relações com barreiras
      if (disability.barriers.length > 0) {
        await prisma.candidatoSubtipoBarreira.createMany({
          data: disability.barriers.map(barreiraId => ({
            candidatoId,
            subtipoId: disability.subtypeId,
            barreiraId,
          })),
          skipDuplicates: true,
        })
      }
    }

    // Retornar candidato atualizado com subtipos e barreiras
    return prisma.candidato.findUnique({
      where: { id: candidatoId },
      include: {
        subtipos: {
          include: {
            subtipo: {
              include: {
                tipo: true,
              },
            },
            barreiras: {
              include: {
                barreira: true,
              },
            },
          },
        },
      },
    })
  },
}
