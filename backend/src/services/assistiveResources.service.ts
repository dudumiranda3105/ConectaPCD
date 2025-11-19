import { prisma } from '../repositories/prisma'

export const AssistiveResourcesService = {
  async list() {
    return prisma.recursoAssistivo.findMany({
      include: { mitigacoes: true }
    })
  }
}
