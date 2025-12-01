"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function checkMatchData() {
    // Verificar VagaSubtipo - quais vagas têm subtipos configurados
    const vagaSubtipos = await prisma.vagaSubtipo.findMany({
        include: { vaga: true, subtipo: true }
    });
    console.log("\n=== VAGA-SUBTIPO (configurações das vagas) ===\n");
    console.log(`Total de registros: ${vagaSubtipos.length}`);
    if (vagaSubtipos.length === 0) {
        console.log("⚠️  NENHUMA VAGA TEM SUBTIPOS CONFIGURADOS!");
        console.log("   Por isso 'Tipo de Deficiência' mostra 0%");
    }
    else {
        for (const vs of vagaSubtipos) {
            console.log(`  Vaga "${vs.vaga.titulo}" (ID: ${vs.vagaId}) aceita: ${vs.subtipo.nome} (ID: ${vs.subtipoId})`);
        }
    }
    await prisma.$disconnect();
}
checkMatchData().catch(console.error);
//# sourceMappingURL=check-match-data.js.map