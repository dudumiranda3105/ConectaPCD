"use strict";
/**
 * Script de teste para verificar o sistema de match
 * Execute com: npx tsx test-match.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function testMatch() {
    console.log("\n🔍 TESTE DO SISTEMA DE MATCH\n");
    console.log("=".repeat(60));
    // 1. Buscar candidato
    const candidato = await prisma.candidato.findFirst({
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
        console.log("❌ Candidato não encontrado");
        return;
    }
    console.log(`\n👤 CANDIDATO: ${candidato.nome} (ID: ${candidato.id})`);
    console.log("-".repeat(60));
    const subtiposCandidato = candidato.subtipos.map((cs) => cs.subtipoId);
    console.log(`Subtipos do candidato: [${subtiposCandidato.join(", ")}]`);
    for (const cs of candidato.subtipos) {
        const barreirasCount = cs.subtipo.barreiras?.length || 0;
        console.log(`  - ${cs.subtipo.nome} (ID: ${cs.subtipoId}): ${barreirasCount} barreiras`);
        if (cs.subtipo.barreiras && cs.subtipo.barreiras.length > 0) {
            for (const sb of cs.subtipo.barreiras) {
                const acessNecessarias = sb.barreira.acessibilidades.map((ba) => ba.acessibilidade.descricao);
                console.log(`      • Barreira: "${sb.barreira.descricao}"`);
                console.log(`        Acessibilidades que resolvem: [${acessNecessarias.join(", ")}]`);
            }
        }
    }
    // 2. Buscar vagas
    const vagas = await prisma.vaga.findMany({
        where: { isActive: true },
        include: {
            empresa: true,
            subtiposAceitos: { include: { subtipo: true } },
            acessibilidades: { include: { acessibilidade: true } },
        },
    });
    console.log(`\n📋 VAGAS ATIVAS: ${vagas.length}`);
    console.log("-".repeat(60));
    for (const vaga of vagas) {
        console.log(`\n🏢 VAGA: ${vaga.titulo} (ID: ${vaga.id})`);
        const subtiposVaga = vaga.subtiposAceitos.map((vs) => vs.subtipoId);
        console.log(`   Subtipos aceitos: [${subtiposVaga.length > 0 ? subtiposVaga.join(", ") : "NENHUM!"}]`);
        const acessVaga = vaga.acessibilidades.map((va) => va.acessibilidadeId);
        console.log(`   Acessibilidades (IDs): [${acessVaga.join(", ")}]`);
        console.log(`   Acessibilidades:`);
        vaga.acessibilidades.forEach((va) => {
            console.log(`     - ${va.acessibilidade.descricao} (ID: ${va.acessibilidadeId})`);
        });
        // Calcular match
        console.log(`\n   📊 CÁLCULO DO MATCH:`);
        // Score de Subtipos
        const subtiposAceitos = subtiposCandidato.filter((s) => subtiposVaga.includes(s)).length;
        const scoreSubtipos = subtiposCandidato.length > 0
            ? Math.round((subtiposAceitos / subtiposCandidato.length) * 100)
            : 0;
        console.log(`   Subtipos aceitos: ${subtiposAceitos}/${subtiposCandidato.length} = ${scoreSubtipos}%`);
        // Score de Acessibilidades/Barreiras
        let barreirasTotal = 0;
        let barreirasAtendidas = 0;
        for (const cs of candidato.subtipos) {
            for (const sb of cs.subtipo.barreiras || []) {
                barreirasTotal++;
                const acessNecessariasIds = sb.barreira.acessibilidades.map((ba) => ba.acessibilidadeId);
                const atendida = acessNecessariasIds.some((id) => acessVaga.includes(id));
                if (atendida)
                    barreirasAtendidas++;
                console.log(`     Barreira "${sb.barreira.descricao}": ${atendida ? "✅ ATENDIDA" : "❌ NÃO ATENDIDA"}`);
            }
        }
        const scoreAcessibilidades = barreirasTotal > 0
            ? Math.round((barreirasAtendidas / barreirasTotal) * 100)
            : 100;
        console.log(`   Barreiras atendidas: ${barreirasAtendidas}/${barreirasTotal} = ${scoreAcessibilidades}%`);
        // Score Total
        const scoreTotal = Math.round(scoreSubtipos * 0.4 + scoreAcessibilidades * 0.6);
        console.log(`\n   🎯 SCORE FINAL: ${scoreSubtipos}% * 0.4 + ${scoreAcessibilidades}% * 0.6 = ${scoreTotal}%`);
        const compativel = subtiposAceitos > 0 && scoreTotal >= 50;
        console.log(`   Compatível: ${compativel ? "✅ SIM" : "❌ NÃO"} (requer subtipo aceito E score >= 50)`);
    }
    console.log("\n" + "=".repeat(60));
    console.log("📝 CONCLUSÃO:");
    console.log("-".repeat(60));
    console.log("⚠️  PROBLEMA IDENTIFICADO: As vagas não têm subtiposAceitos configurados!");
    console.log("   Isso faz o scoreSubtipos ser sempre 0%, resultando em:");
    console.log("   - Score total baixo (só conta acessibilidades)");
    console.log("   - Nenhuma vaga marcada como 'compatível' (requer subtipo aceito > 0)");
    console.log("\n💡 SOLUÇÃO: Adicionar subtiposAceitos às vagas quando forem criadas.");
    console.log("=".repeat(60) + "\n");
    await prisma.$disconnect();
}
testMatch().catch(console.error);
//# sourceMappingURL=test-match.js.map