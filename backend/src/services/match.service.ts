// src/services/match.service.ts
import { MatchRepo } from "../repositories/match.repo";

interface BarreiraInfo {
  id: number;
  descricao: string;
  atendida: boolean;
  acessibilidadesNecessarias: string[];
  acessibilidadesOferecidas: string[];
}

interface MatchResult {
  vaga: any;
  scoreTotal: number;
  scoreAcessibilidades: number;
  scoreSubtipos: number;
  compativel: boolean;
  detalhes: {
    subtiposAceitos: number;
    subtiposTotal: number;
    barreirasAtendidas: number;
    barreirasTotal: number;
    barreirasPorSubtipo: Array<{
      subtipo: string;
      barreiras: BarreiraInfo[];
    }>;
  };
}

export async function calcularMatchScore(candidatoId: number): Promise<MatchResult[]> {
  const candidato = await MatchRepo.getCandidatoComBarreiras(candidatoId);
  if (!candidato) throw new Error("Candidato não encontrado");

  const vagas = await MatchRepo.getVagasComDetalhes();
  const results: MatchResult[] = [];

  for (const vaga of vagas) {
    const match = calcularMatchVaga(candidato, vaga);
    results.push(match);

    // Salvar score no banco para cache
    await MatchRepo.saveMatchScore({
      candidatoId,
      vagaId: vaga.id,
      scoreTotal: match.scoreTotal,
      scoreAcessibilidades: match.scoreAcessibilidades,
      scoreSubtipos: match.scoreSubtipos,
      acessibilidadesAtendidas: match.detalhes.barreirasAtendidas,
      acessibilidadesTotal: match.detalhes.barreirasTotal,
      detalhes: match.detalhes,
    });
  }

  return results.sort((a, b) => b.scoreTotal - a.scoreTotal);
}

function calcularMatchVaga(candidato: any, vaga: any): MatchResult {
  const subtiposCandidato = candidato.subtipos.map((cs: any) => cs.subtipoId);
  const subtiposVaga = vaga.subtiposAceitos.map((vs: any) => vs.subtipoId);
  const acessibilidadesVaga = vaga.acessibilidades.map((va: any) => va.acessibilidadeId);

  // 1. Score de Subtipos (0-100)
  const subtiposAceitos = subtiposCandidato.filter((s: number) => subtiposVaga.includes(s)).length;
  const scoreSubtipos = subtiposCandidato.length > 0
    ? Math.round((subtiposAceitos / subtiposCandidato.length) * 100)
    : 0;

  // 2. Score de Acessibilidades/Barreiras (0-100)
  const barreirasPorSubtipo: Array<{ subtipo: string; barreiras: BarreiraInfo[] }> = [];
  let barreirasTotal = 0;
  let barreirasAtendidas = 0;

  for (const candidatoSubtipo of candidato.subtipos) {
    const subtipo = candidatoSubtipo.subtipo;
    const barreirasDoSubtipo: BarreiraInfo[] = [];

    // Pegar barreiras do subtipo através da tabela SubtipoBarreira
    for (const sb of subtipo.barreiras || []) {
      const barreira = sb.barreira;
      barreirasTotal++;

      // Descobrir quais acessibilidades resolvem esta barreira
      const acessibilidadesNecessarias = barreira.acessibilidades.map(
        (ba: any) => ba.acessibilidade.descricao
      );
      const acessibilidadesNecessariasIds = barreira.acessibilidades.map(
        (ba: any) => ba.acessibilidadeId
      );

      // Verificar se a vaga oferece alguma dessas acessibilidades
      const atendida = acessibilidadesNecessariasIds.some((id: number) =>
        acessibilidadesVaga.includes(id)
      );

      if (atendida) barreirasAtendidas++;

      const acessibilidadesOferecidas = vaga.acessibilidades
        .filter((va: any) => acessibilidadesNecessariasIds.includes(va.acessibilidadeId))
        .map((va: any) => va.acessibilidade.descricao);

      barreirasDoSubtipo.push({
        id: barreira.id,
        descricao: barreira.descricao,
        atendida,
        acessibilidadesNecessarias,
        acessibilidadesOferecidas,
      });
    }

    if (barreirasDoSubtipo.length > 0) {
      barreirasPorSubtipo.push({
        subtipo: subtipo.nome,
        barreiras: barreirasDoSubtipo,
      });
    }
  }

  const scoreAcessibilidades = barreirasTotal > 0
    ? Math.round((barreirasAtendidas / barreirasTotal) * 100)
    : 100; // Se não há barreiras, score máximo

  // 3. Score Total (média ponderada: 40% subtipos + 60% acessibilidades)
  const scoreTotal = Math.round(scoreSubtipos * 0.4 + scoreAcessibilidades * 0.6);

  // 4. Compatibilidade mínima: pelo menos 1 subtipo aceito E score >= 50
  const compativel = subtiposAceitos > 0 && scoreTotal >= 50;

  return {
    vaga,
    scoreTotal,
    scoreAcessibilidades,
    scoreSubtipos,
    compativel,
    detalhes: {
      subtiposAceitos,
      subtiposTotal: subtiposCandidato.length,
      barreirasAtendidas,
      barreirasTotal,
      barreirasPorSubtipo,
    },
  };
}

export async function encontrarVagasCompativeis(candidatoId: number) {
  const matches = await calcularMatchScore(candidatoId);
  return matches.filter((m) => m.compativel).map((m) => ({
    ...m.vaga,
    matchScore: m.scoreTotal,
    matchDetails: m.detalhes,
  }));
}

export async function getMatchScoresFromCache(candidatoId: number) {
  return MatchRepo.getMatchScores(candidatoId);
}
