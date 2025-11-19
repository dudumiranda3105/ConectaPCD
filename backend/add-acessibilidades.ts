import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log('Adicionando acessibilidades...');
  
  const acessibilidades = [
    'Rampas de acesso',
    'Sanitários adaptados',
    'Piso tátil',
    'Mobiliário adaptado',
    'Vagas de estacionamento reservadas',
    'Portas largas',
    'Corrimãos',
    'Iluminação adequada',
    'Sinalização visual e tátil',
    'Audiodescrição',
    'Legendas em vídeos'
  ];

  for (const descricao of acessibilidades) {
    try {
      const existing = await prisma.acessibilidade.findFirst({
        where: { descricao }
      });

      if (!existing) {
        await prisma.acessibilidade.create({
          data: { descricao }
        });
        console.log(`✅ Criada: ${descricao}`);
      } else {
        console.log(`⏭️  Já existe: ${descricao}`);
      }
    } catch (error) {
      console.error(`❌ Erro ao criar ${descricao}:`, error);
    }
  }

  console.log('\n✅ Processo concluído!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
