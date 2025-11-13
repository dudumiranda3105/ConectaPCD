import { CandidatoSubtipoRepo } from '../repositories/candidatoSubtipo.repo'

export const CandidatoSubtipoService = {
  async updateDisabilities(candidatoId: number, disabilities: Array<{
    typeId: number
    subtypeId: number
    barriers: number[]
  }>) {
    if (!candidatoId) throw new Error('candidatoId é obrigatório')
    if (!Array.isArray(disabilities)) throw new Error('disabilities deve ser um array')

    return CandidatoSubtipoRepo.replaceSubtipos(candidatoId, disabilities)
  },
}
