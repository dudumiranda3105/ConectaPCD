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

const token = 'SEU_TOKEN_ADMIN_AQUI'; // Pegue do localStorage

async function criarAcessibilidades() {
  for (const descricao of acessibilidades) {
    try {
      const response = await fetch('http://localhost:4000/acessibilidades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ descricao })
      });
      
      if (response.ok) {
        console.log(`✅ Criada: ${descricao}`);
      } else {
        const error = await response.text();
        console.log(`❌ Erro ao criar ${descricao}: ${error}`);
      }
    } catch (error) {
      console.error(`❌ Erro: ${error.message}`);
    }
  }
}

criarAcessibilidades();
