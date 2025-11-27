import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface BarreiraInfo {
  id: number;
  descricao: string;
  atendida: boolean;
  acessibilidadesNecessarias: string[];
  acessibilidadesOferecidas: string[];
}

async function recalcularMatch() {
  console.log("\n🔄 RECALCULANDO MATCH SCORES...\n");
  
  // Buscar candidato com todas as barreiras
  const candidato = await prisma.candidato.findUnique({
    where: { id: 1 },
    include: {
      subtipos: {
        include: {
          subtipo: {
            include: {
              barreiras: {
                include: {
                  barreira: {
                    include: {
                      acessibilidades: {
                        include: { acessibilidade: true },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!candidato) {
    console.log("Candidato não encontrado");
    return;
  }

  console.log(`Candidato: ${candidato.nome}`);
  console.log(`Subtipos do candidato: ${candidato.subtipos.length}`);
  candidato.subtipos.forEach(cs => {
    console.log(`  - ${cs.subtipo.nome} (ID: ${cs.subtipoId}): ${cs.subtipo.barreiras?.length || 0} barreiras`);
  });

  const vagas = await prisma.vaga.findMany({
    where: { isActive: true },
    include: {
      empresa: true,
      subtiposAceitos: { include: { subtipo: true } },
      acessibilidades: { include: { acessibilidade: true } },
    },
  });

  console.log(`\nVagas ativas: ${vagas.length}\n`);

  for (const vaga of vagas) {
    const subtiposCandidato = candidato.subtipos.map(cs => cs.subtipoId);
    const subtiposVaga = vaga.subtiposAceitos.map(vs => vs.subtipoId);
    const acessibilidadesVaga = vaga.acessibilidades.map(va => va.acessibilidadeId);

    // Score de Subtipos
    const subtiposAceitos = subtiposCandidato.filter(s => subtiposVaga.includes(s)).length;
    const scoreSubtipos = subtiposCandidato.length > 0
      ? Math.round((subtiposAceitos / subtiposCandidato.length) * 100)
      : 0;

    // Score de Acessibilidades/Barreiras
    const barreirasPorSubtipo: Array<{ subtipo: string; barreiras: BarreiraInfo[] }> = [];
    let barreirasTotal = 0;
    let barreirasAtendidas = 0;

    for (const candidatoSubtipo of candidato.subtipos) {
      const subtipo = candidatoSubtipo.subtipo;
      const barreirasDoSubtipo: BarreiraInfo[] = [];

      for (const sb of subtipo.barreiras || []) {
        const barreira = sb.barreira;
        barreirasTotal++;

        const acessibilidadesNecessarias = barreira.acessibilidades.map(
          (ba: any) => ba.acessibilidade.descricao
        );
        const acessibilidadesNecessariasIds = barreira.acessibilidades.map(
          (ba: any) => ba.acessibilidadeId
        );

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
      : 100;

    const scoreTotal = Math.round(scoreSubtipos * 0.4 + scoreAcessibilidades * 0.6);

    console.log(`📊 Vaga: ${vaga.titulo} (ID: ${vaga.id})`);
    console.log(`   Subtipos da vaga: [${subtiposVaga.join(', ') || 'NENHUM'}]`);
    console.log(`   Subtipos aceitos: ${subtiposAceitos}/${subtiposCandidato.length} = ${scoreSubtipos}%`);
    console.log(`   Barreiras atendidas: ${barreirasAtendidas}/${barreirasTotal} = ${scoreAcessibilidades}%`);
    console.log(`   Score Total: ${scoreSubtipos}% * 0.4 + ${scoreAcessibilidades}% * 0.6 = ${scoreTotal}%`);

    // Salvar no banco
    const detalhes = {
      subtiposAceitos,
      subtiposTotal: subtiposCandidato.length,
      barreirasAtendidas,
      barreirasTotal,
      barreirasPorSubtipo,
    };

    await prisma.matchScore.upsert({
      where: {
        candidatoId_vagaId: {
          candidatoId: candidato.id,
          vagaId: vaga.id,
        },
      },
      create: {
        candidatoId: candidato.id,
        vagaId: vaga.id,
        scoreTotal,
        scoreAcessibilidades,
        scoreSubtipos,
        acessibilidadesAtendidas: barreirasAtendidas,
        acessibilidadesTotal: barreirasTotal,
        detalhes,
      },
      update: {
        scoreTotal,
        scoreAcessibilidades,
        scoreSubtipos,
        acessibilidadesAtendidas: barreirasAtendidas,
        acessibilidadesTotal: barreirasTotal,
        detalhes,
        updatedAt: new Date(),
      },
    });

    console.log(`   ✅ Salvo no banco!\n`);
  }

  console.log("🎉 Recálculo completo!");
  await prisma.$disconnect();
}

recalcularMatch().catch(console.error);
