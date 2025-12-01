// src/services/match.service.ts
import { MatchRepo } from "../repositories/match.repo";

interface BarreiraInfo {
  id: number;
  descricao: string;
  atendida: boolean;
  mitigadaPorRecurso: boolean;
  eficienciaMitigacao?: string;
  acessibilidadesNecessarias: string[];
  acessibilidadesOferecidas: string[];
}

interface MatchResult {
  vaga: any;
  scoreTotal: number;
  scoreAcessibilidades: number;
  scoreSubtipos: number;
  scoreRecursosAssistivos: number;
  compativel: boolean;
  detalhes: {
    subtiposAceitos: number;
    subtiposTotal: number;
    barreirasAtendidas: number;
    barreirasMitigadas: number;
    barreirasTotal: number;
    barreirasPorSubtipo: Array<{
      subtipo: string;
      barreiras: BarreiraInfo[];
    }>;
  };
}

// Mapeia mitigações de barreiras pelos recursos assistivos do candidato
function getMitigacoesBarreiras(candidato: any): Map<number, string> {
  const mitigacoes = new Map<number, string>();
  
  if (!candidato.recursosAssistivos) return mitigacoes;
  
  for (const cr of candidato.recursosAssistivos) {
    if (!cr.recurso?.mitigacoes) continue;
    
    for (const m of cr.recurso.mitigacoes) {
      const atual = mitigacoes.get(m.barreiraId);
      const nova = m.eficiencia || 'baixa';
      
      // Prioridade: alta > media > baixa
      const rank = (e: string) => e === 'alta' ? 3 : e === 'media' ? 2 : 1;
      if (!atual || rank(nova) > rank(atual)) {
        mitigacoes.set(m.barreiraId, nova);
      }
    }
  }
  
  return mitigacoes;
}

export async function calcularMatchScore(candidatoId: number): Promise<MatchResult[]> {
  const candidato = await MatchRepo.getCandidatoComBarreiras(candidatoId);
  if (!candidato) throw new Error("Candidato não encontrado");

  const vagas = await MatchRepo.getVagasComDetalhes();
  const results: MatchResult[] = [];

  // Obter mitigações de barreiras pelos recursos assistivos
  const mitigacoesBarreiras = getMitigacoesBarreiras(candidato);

  for (const vaga of vagas) {
    const match = calcularMatchVaga(candidato, vaga, mitigacoesBarreiras);
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

function calcularMatchVaga(
  candidato: any, 
  vaga: any, 
  mitigacoesBarreiras: Map<number, string>
): MatchResult {
  const subtiposCandidato = candidato.subtipos.map((cs: any) => cs.subtipoId);
  const subtiposVaga = vaga.subtiposAceitos.map((vs: any) => vs.subtipoId);
  const acessibilidadesVaga = vaga.acessibilidades.map((va: any) => va.acessibilidadeId);

  // 1. Score de Subtipos (0-100)
  const subtiposAceitos = subtiposCandidato.filter((s: number) => subtiposVaga.includes(s)).length;
  const scoreSubtipos = subtiposCandidato.length > 0
    ? Math.round((subtiposAceitos / subtiposCandidato.length) * 100)
    : 0;

  // 2. Score de Acessibilidades/Barreiras considerando Recursos Assistivos
  const barreirasPorSubtipo: Array<{ subtipo: string; barreiras: BarreiraInfo[] }> = [];
  let barreirasTotal = 0;
  let barreirasAtendidas = 0;
  let barreirasMitigadas = 0;

  for (const candidatoSubtipo of candidato.subtipos) {
    const subtipo = candidatoSubtipo.subtipo;
    const barreirasDoSubtipo: BarreiraInfo[] = [];

    for (const sb of subtipo.barreiras || []) {
      const barreira = sb.barreira;
      const eficienciaMitigacao = mitigacoesBarreiras.get(barreira.id);
      
      // Se barreira tem mitigação ALTA por recurso assistivo, ela é considerada resolvida
      if (eficienciaMitigacao === 'alta') {
        barreirasMitigadas++;
        barreirasDoSubtipo.push({
          id: barreira.id,
          descricao: barreira.descricao,
          atendida: true,
          mitigadaPorRecurso: true,
          eficienciaMitigacao: 'alta',
          acessibilidadesNecessarias: [],
          acessibilidadesOferecidas: [],
        });
        continue; // Pula para próxima barreira
      }
      
      barreirasTotal++;

      // Descobrir quais acessibilidades resolvem esta barreira
      const acessibilidadesNecessarias = barreira.acessibilidades.map(
        (ba: any) => ba.acessibilidade.descricao
      );
      const acessibilidadesNecessariasIds = barreira.acessibilidades.map(
        (ba: any) => ba.acessibilidadeId
      );

      // Verificar se a vaga oferece alguma dessas acessibilidades
      let atendida = acessibilidadesNecessariasIds.some((id: number) =>
        acessibilidadesVaga.includes(id)
      );
      
      // Se tem mitigação MÉDIA, conta como parcialmente atendida (50%)
      const mitigadaPorRecurso = eficienciaMitigacao === 'media';
      if (mitigadaPorRecurso && !atendida) {
        // Conta como meia barreira atendida
        barreirasAtendidas += 0.5;
        barreirasMitigadas++;
      } else if (atendida) {
        barreirasAtendidas++;
      }

      const acessibilidadesOferecidas = vaga.acessibilidades
        .filter((va: any) => acessibilidadesNecessariasIds.includes(va.acessibilidadeId))
        .map((va: any) => va.acessibilidade.descricao);

      barreirasDoSubtipo.push({
        id: barreira.id,
        descricao: barreira.descricao,
        atendida: atendida || mitigadaPorRecurso,
        mitigadaPorRecurso,
        eficienciaMitigacao,
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
    : 100;

  // 3. Score de Recursos Assistivos (bônus por ter recursos que mitigam barreiras)
  const totalBarreirasOriginais = barreirasTotal + barreirasMitigadas;
  const scoreRecursosAssistivos = totalBarreirasOriginais > 0
    ? Math.round((barreirasMitigadas / totalBarreirasOriginais) * 100)
    : 0;

  // 4. Score Total (média ponderada: 30% subtipos + 55% acessibilidades + 15% recursos assistivos)
  const scoreTotal = Math.round(
    scoreSubtipos * 0.30 + 
    scoreAcessibilidades * 0.55 + 
    scoreRecursosAssistivos * 0.15
  );

  // 5. Compatibilidade: pelo menos 1 subtipo aceito E score >= 40
  const compativel = subtiposAceitos > 0 && scoreTotal >= 40;

  return {
    vaga,
    scoreTotal,
    scoreAcessibilidades,
    scoreSubtipos,
    scoreRecursosAssistivos,
    compativel,
    detalhes: {
      subtiposAceitos,
      subtiposTotal: subtiposCandidato.length,
      barreirasAtendidas: Math.round(barreirasAtendidas),
      barreirasMitigadas,
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
