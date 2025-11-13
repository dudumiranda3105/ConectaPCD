// src/services/match.service.ts
import { MatchRepo } from "../repositories/match.repo";

export async function encontrarVagasCompativeis(candidatoId: number) {
  const candidato = await MatchRepo.getCandidatoComBarreiras(candidatoId);
  if (!candidato) throw new Error("Candidato não encontrado");

  const vagas = await MatchRepo.getVagasComDetalhes();
  const mapaBA = await MatchRepo.getMapaBarreiraAcessibilidade();

  return vagas.filter((vaga) =>
    candidato.subtipos.every((cs) => {
      // 1️⃣ a vaga aceita o subtipo?
      const aceita = vaga.subtiposAceitos.some(
        (vs) => vs.subtipoId === cs.subtipoId
      );
      if (!aceita) return false;

      // 2️⃣ para cada barreira, há uma acessibilidade compatível?
      return cs.barreiras.every((cb) => {
        const acessCompativeis = mapaBA
          .filter((m) => m.barreiraId === cb.barreiraId)
          .map((m) => m.acessibilidadeId);

        const oferecidas = vaga.acessibilidades.map(
          (a) => a.acessibilidadeId
        );

        return acessCompativeis.some((aid) => oferecidas.includes(aid));
      });
    })
  );
}
