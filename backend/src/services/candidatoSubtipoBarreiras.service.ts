import { CandidatoSubtipoBarreirasRepo } from "../repositories/candidatoSubtipoBarreiras.repo";
import { CandidatoSubtiposRepo } from "../repositories/candidatoSubtipos.repo";

export const CandidatoSubtipoBarreirasService = {
  async listarPorCandidato(candidatoId: number) {
    return CandidatoSubtipoBarreirasRepo.findByCandidato(candidatoId);
  },

  async vincular(candidatoId: number, subtipoId: number, barreiraIds: number[]) {
    const vinculo = await CandidatoSubtiposRepo.findByCandidato(candidatoId);
    const subtipoValido = vinculo.some((v) => v.subtipoId === subtipoId);
    if (!subtipoValido)
      throw new Error("Este subtipo não está associado ao candidato");

    if (!barreiraIds.length)
      throw new Error("É necessário informar pelo menos uma barreira");

    await CandidatoSubtipoBarreirasRepo.create(
      candidatoId,
      subtipoId,
      barreiraIds
    );
    return { ok: true };
  },
};