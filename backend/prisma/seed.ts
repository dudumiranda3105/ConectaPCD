import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // limpa dados (apenas para desenvolvimento)
  await prisma.recursoBarreiraMitigacao.deleteMany();
  await prisma.candidatoRecursoAssistivo.deleteMany();
  await prisma.recursoAssistivo.deleteMany();
  await prisma.subtipoBarreira.deleteMany();
  await prisma.barreiraAcessibilidade.deleteMany();
  await prisma.acessibilidade.deleteMany();
  await prisma.barreira.deleteMany();
  await prisma.subtipoDeficiencia.deleteMany();
  await prisma.tipoDeficiencia.deleteMany();

  // Criar admin padrão
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.admin.upsert({
    where: { email: "admin@conectapcd.com" },
    update: {},
    create: {
      nome: "Administrador",
      email: "admin@conectapcd.com",
      password: adminPassword,
      cargo: "Administrador Geral",
    },
  });

  console.log("✅ Admin criado: admin@conectapcd.com / admin123");

  // Tipos
  const motora = await prisma.tipoDeficiencia.create({
    data: { nome: "Deficiência Motora" },
  });
  const auditiva = await prisma.tipoDeficiencia.create({
    data: { nome: "Deficiência Auditiva" },
  });
  const visual = await prisma.tipoDeficiencia.create({
    data: { nome: "Deficiência Visual" },
  });

  // Subtipos
  const sub_motora1 = await prisma.subtipoDeficiencia.create({
    data: { nome: "Amputação MIE com muleta", tipoId: motora.id },
  });
  const sub_auditiva1 = await prisma.subtipoDeficiencia.create({
    data: { nome: "Usuário de Libras", tipoId: auditiva.id },
  });
  const sub_visual1 = await prisma.subtipoDeficiencia.create({
    data: { nome: "Baixa visão", tipoId: visual.id },
  });

  // Barreiras
  const [escadas, degrausAltos, pisoIrregular, faltaInterprete, comunicacaoOral, faltaContraste, faltaSinalizacaoTatil] =
    await prisma.$transaction([
      prisma.barreira.create({ data: { descricao: "Escadas" } }),
      prisma.barreira.create({ data: { descricao: "Degraus altos" } }),
      prisma.barreira.create({ data: { descricao: "Piso irregular" } }),
      prisma.barreira.create({ data: { descricao: "Ausência de intérprete de Libras" } }),
      prisma.barreira.create({ data: { descricao: "Dificuldade de comunicação oral" } }),
      prisma.barreira.create({ data: { descricao: "Falta de contraste visual" } }),
      prisma.barreira.create({ data: { descricao: "Falta de sinalização tátil" } }),
    ]);

  // Acessibilidades
  const [
    rampa,
    pisoAntid,
    elevador,
    interprete,
    chatInterno,
    altoContraste,
    pisoGuia,
    rampasAcesso,
    sanitariosAdaptados,
    pisoTatil,
    mobiliarioAdaptado,
    vagasEstacionamento,
    portasLargas,
    corrimãos,
    iluminacaoAdequada,
    sinalizacaoVisual,
    audioDescricao,
    legendasVideos
  ] = await prisma.$transaction([
    prisma.acessibilidade.create({ data: { descricao: "Rampa com inclinação adequada" } }),
    prisma.acessibilidade.create({ data: { descricao: "Piso antiderrapante" } }),
    prisma.acessibilidade.create({ data: { descricao: "Elevador / acesso em nível" } }),
    prisma.acessibilidade.create({ data: { descricao: "Intérprete de Libras" } }),
    prisma.acessibilidade.create({ data: { descricao: "Comunicação por chat interno" } }),
    prisma.acessibilidade.create({ data: { descricao: "Sinalização de alto contraste" } }),
    prisma.acessibilidade.create({ data: { descricao: "Piso guia / sinalização tátil" } }),
    // Acessibilidades adicionais do formulário
    prisma.acessibilidade.create({ data: { descricao: "Rampas de acesso" } }),
    prisma.acessibilidade.create({ data: { descricao: "Sanitários adaptados" } }),
    prisma.acessibilidade.create({ data: { descricao: "Piso tátil" } }),
    prisma.acessibilidade.create({ data: { descricao: "Mobiliário adaptado" } }),
    prisma.acessibilidade.create({ data: { descricao: "Vagas de estacionamento reservadas" } }),
    prisma.acessibilidade.create({ data: { descricao: "Portas largas" } }),
    prisma.acessibilidade.create({ data: { descricao: "Corrimãos" } }),
    prisma.acessibilidade.create({ data: { descricao: "Iluminação adequada" } }),
    prisma.acessibilidade.create({ data: { descricao: "Sinalização visual e tátil" } }),
    prisma.acessibilidade.create({ data: { descricao: "Audiodescrição" } }),
    prisma.acessibilidade.create({ data: { descricao: "Legendas em vídeos" } }),
  ]);

  // Subtipo ↔ Barreiras (N:N)
  await prisma.subtipoBarreira.createMany({
    data: [
      { subtipoId: sub_motora1.id, barreiraId: escadas.id },
      { subtipoId: sub_motora1.id, barreiraId: degrausAltos.id },
      { subtipoId: sub_motora1.id, barreiraId: pisoIrregular.id },

      { subtipoId: sub_auditiva1.id, barreiraId: comunicacaoOral.id },
      { subtipoId: sub_auditiva1.id, barreiraId: faltaInterprete.id },

      { subtipoId: sub_visual1.id, barreiraId: pisoIrregular.id },
      { subtipoId: sub_visual1.id, barreiraId: faltaContraste.id },
      { subtipoId: sub_visual1.id, barreiraId: faltaSinalizacaoTatil.id },
    ],
    skipDuplicates: true,
  });

  // Barreira ↔ Acessibilidade (N:N)
  await prisma.barreiraAcessibilidade.createMany({
    data: [
      // Motora
      { barreiraId: escadas.id, acessibilidadeId: rampa.id },
      { barreiraId: escadas.id, acessibilidadeId: elevador.id },
      { barreiraId: degrausAltos.id, acessibilidadeId: rampa.id },
      { barreiraId: degrausAltos.id, acessibilidadeId: elevador.id },
      { barreiraId: pisoIrregular.id, acessibilidadeId: pisoAntid.id },

      // Auditiva
      { barreiraId: faltaInterprete.id, acessibilidadeId: interprete.id },
      { barreiraId: comunicacaoOral.id, acessibilidadeId: chatInterno.id },

      // Visual
      { barreiraId: faltaContraste.id, acessibilidadeId: altoContraste.id },
      { barreiraId: faltaSinalizacaoTatil.id, acessibilidadeId: pisoGuia.id },
    ],
    skipDuplicates: true,
  });

  // Recursos Assistivos
  const [protesePerna, muleta, bengala, cadeiraManual, cadeiraMotorizada] = await prisma.$transaction([
    prisma.recursoAssistivo.create({ data: { nome: 'Prótese de perna', descricao: 'Prótese para membro inferior' } }),
    prisma.recursoAssistivo.create({ data: { nome: 'Muleta', descricao: 'Auxílio para marcha' } }),
    prisma.recursoAssistivo.create({ data: { nome: 'Bengala', descricao: 'Suporte de equilíbrio' } }),
    prisma.recursoAssistivo.create({ data: { nome: 'Cadeira de rodas manual', descricao: 'Mobilidade com propulsão manual' } }),
    prisma.recursoAssistivo.create({ data: { nome: 'Cadeira de rodas motorizada', descricao: 'Mobilidade com propulsão motorizada' } }),
  ])

  // Mitigações de barreiras por recursos
  await prisma.recursoBarreiraMitigacao.createMany({
    data: [
      // Piso irregular
      { recursoId: protesePerna.id, barreiraId: pisoIrregular.id, eficiencia: 'alta' },
      { recursoId: muleta.id, barreiraId: pisoIrregular.id, eficiencia: 'media' },
      { recursoId: bengala.id, barreiraId: pisoIrregular.id, eficiencia: 'media' },
      { recursoId: cadeiraManual.id, barreiraId: pisoIrregular.id, eficiencia: 'media' },
      { recursoId: cadeiraMotorizada.id, barreiraId: pisoIrregular.id, eficiencia: 'alta' },
      // Degraus altos (parcialmente mitigados por prótese / muleta)
      { recursoId: protesePerna.id, barreiraId: degrausAltos.id, eficiencia: 'media' },
      { recursoId: muleta.id, barreiraId: degrausAltos.id, eficiencia: 'baixa' },
      // Escadas (normalmente requer acessibilidade ambiental, baixa mitigação)
      { recursoId: muleta.id, barreiraId: escadas.id, eficiencia: 'baixa' },
      { recursoId: cadeiraManual.id, barreiraId: escadas.id, eficiencia: 'baixa' },
      { recursoId: cadeiraMotorizada.id, barreiraId: escadas.id, eficiencia: 'baixa' },
    ],
    skipDuplicates: true,
  })

  console.log('Recursos assistivos e mitigações seed ✅')

  console.log("Seed concluído ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());