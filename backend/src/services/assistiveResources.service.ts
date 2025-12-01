import { prisma } from '../repositories/prisma'

export const AssistiveResourcesService = {
  async list() {
    return prisma.recursoAssistivo.findMany({
      include: { mitigacoes: true },
      orderBy: { id: 'asc' }
    })
  },

  async getById(id: number) {
    return prisma.recursoAssistivo.findUnique({
      where: { id },
      include: { mitigacoes: true }
    })
  },

  async create(nome: string, descricao?: string, mitigacoes?: { barreiraId: number; eficiencia?: string }[]) {
    const trimmedNome = (nome ?? '').trim()
    if (!trimmedNome) {
      throw Object.assign(new Error("O campo 'nome' é obrigatório"), { status: 400 })
    }

    return prisma.recursoAssistivo.create({
      data: {
        nome: trimmedNome,
        descricao: descricao?.trim() || null,
        mitigacoes: mitigacoes && mitigacoes.length > 0 ? {
          create: mitigacoes.map(m => ({
            barreiraId: m.barreiraId,
            eficiencia: m.eficiencia || null
          }))
        } : undefined
      },
      include: { mitigacoes: true }
    })
  },

  async update(id: number, nome: string, descricao?: string, mitigacoes?: { barreiraId: number; eficiencia?: string }[]) {
    const trimmedNome = (nome ?? '').trim()
    if (!trimmedNome) {
      throw Object.assign(new Error("O campo 'nome' é obrigatório"), { status: 400 })
    }

    // Atualiza o recurso e recria as mitigações
    return prisma.$transaction(async (tx) => {
      // Remove mitigações existentes
      await tx.recursoBarreiraMitigacao.deleteMany({
        where: { recursoId: id }
      })

      // Atualiza o recurso e cria novas mitigações
      return tx.recursoAssistivo.update({
        where: { id },
        data: {
          nome: trimmedNome,
          descricao: descricao?.trim() || null,
          mitigacoes: mitigacoes && mitigacoes.length > 0 ? {
            create: mitigacoes.map(m => ({
              barreiraId: m.barreiraId,
              eficiencia: m.eficiencia || null
            }))
          } : undefined
        },
        include: { mitigacoes: true }
      })
    })
  },

  async delete(id: number) {
    return prisma.recursoAssistivo.delete({
      where: { id }
    })
  }
}
