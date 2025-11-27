import { VagasRepo } from "../repositories/vagas.repo";
import { prisma } from "../repositories/prisma";
import { ActivityLogService } from "./activityLog.service";

export const VagasService = {
  async listarVagasPublicas() {
    return VagasRepo.list();
  },

  async criarVaga(empresaId: number, titulo: string, descricao: string, escolaridade: string, tipo?: string, regimeTrabalho?: string, beneficios?: string, acessibilidades?: string[], subtiposAceitos?: number[]) {
    if (!empresaId) throw new Error("empresaId é obrigatório");
    if (!titulo?.trim()) throw new Error("titulo é obrigatório");
    if (!descricao?.trim()) throw new Error("descricao é obrigatória");
    if (!escolaridade?.trim()) throw new Error("escolaridade é obrigatória");

    // valida existência da empresa
    const empresa = await prisma.empresa.findUnique({ where: { id: empresaId } });
    if (!empresa) throw new Error("Empresa não encontrada");

    const vaga = await VagasRepo.create(empresaId, titulo.trim(), descricao.trim(), escolaridade.trim(), tipo?.trim(), regimeTrabalho?.trim(), beneficios?.trim());
    
    // Vincular acessibilidades se fornecidas
    if (acessibilidades && acessibilidades.length > 0) {
      await this.vincularAcessibilidadesPorNome(vaga.id, acessibilidades);
    }
    
    // Vincular subtipos se fornecidos
    if (subtiposAceitos && subtiposAceitos.length > 0) {
      console.log('[VagasService] Vinculando subtipos aceitos:', subtiposAceitos);
      await this.vincularSubtipos(vaga.id, subtiposAceitos);
    }
    
    // Registrar atividade de criação de vaga
    const empresaNome = empresa.nomeFantasia || empresa.razaoSocial || empresa.nome;
    await ActivityLogService.logNovaVaga(empresaNome, empresaId, titulo.trim(), vaga.id);
    
    return vaga;
  },

  async vincularSubtipos(vagaId: number, subtipoIds: number[]) {
    if (!vagaId) {
      throw new Error("Informe vagaId");
    }
    if (!Array.isArray(subtipoIds)) {
      throw new Error("subtipoIds deve ser um array");
    }
    // valida vaga
    const vaga = await prisma.vaga.findUnique({ where: { id: vagaId } });
    if (!vaga) throw new Error("Vaga não encontrada");

    // Se array vazio, apenas limpa os subtipos existentes
    if (subtipoIds.length === 0) {
      await prisma.vagaSubtipo.deleteMany({ where: { vagaId } });
      return { ok: true, message: "Subtipos removidos" };
    }

    return VagasRepo.linkSubtipos(vagaId, subtipoIds);
  },

  async vincularAcessibilidades(vagaId: number, acessibilidadeIds: number[]) {
    if (!vagaId || !Array.isArray(acessibilidadeIds) || acessibilidadeIds.length === 0) {
      throw new Error("Informe vagaId e pelo menos um acessibilidadeId");
    }
    // valida vaga
    const vaga = await prisma.vaga.findUnique({ where: { id: vagaId } });
    if (!vaga) throw new Error("Vaga não encontrada");

    return VagasRepo.linkAcessibilidades(vagaId, acessibilidadeIds);
  },

    async listarAcessibilidadesPossiveis(vagaId: number) {
    const vaga = await VagasRepo.findByIdWithSubtiposBarreirasAcessibilidades(vagaId);
    if (!vaga) throw new Error("Vaga não encontrada");

    // Junta todas as acessibilidades das barreiras dos subtipos da vaga
    const acessibilidades = vaga.subtiposAceitos.flatMap((vs) =>
      vs.subtipo.barreiras.flatMap((sb) =>
        sb.barreira.acessibilidades.map((ba) => ba.acessibilidade)
      )
    );

    // Remove duplicadas
    const unicas = acessibilidades.filter(
      (a, i, arr) => arr.findIndex((x) => x.id === a.id) === i
    );

    return unicas;
  },

  async listarCandidaturasPorVaga(vagaId: number) {
    const vaga = await VagasRepo.findById(vagaId);
    if (!vaga) throw new Error("Vaga não encontrada");

    const candidaturas = await VagasRepo.getCandidaturas(vagaId);
    console.log(`[VagasService] Candidaturas para vaga ${vagaId}:`, candidaturas.length);
    
    // Buscar match scores do banco de dados para cada candidatura
    const candidaturasComMatch = await Promise.all(
      candidaturas.map(async (candidatura: any) => {
        try {
          const matchScore = await prisma.matchScore.findUnique({
            where: {
              candidatoId_vagaId: {
                candidatoId: candidatura.candidato.id,
                vagaId: vagaId,
              },
            },
          });
          
          return {
            ...candidatura,
            matchScoreDB: matchScore ? {
              scoreTotal: matchScore.scoreTotal,
              scoreAcessibilidades: matchScore.scoreAcessibilidades,
              scoreSubtipos: matchScore.scoreSubtipos,
              acessibilidadesAtendidas: matchScore.acessibilidadesAtendidas,
              acessibilidadesTotal: matchScore.acessibilidadesTotal,
              detalhes: matchScore.detalhes,
              calculadoEm: matchScore.updatedAt || matchScore.calculadoEm,
            } : null,
          };
        } catch (error) {
          console.error(`[VagasService] Erro ao buscar match score para candidato ${candidatura.candidato.id}:`, error);
          return candidatura;
        }
      })
    );
    
    return candidaturasComMatch;
  },

  async atualizarVaga(vagaId: number, dados: {
    titulo?: string;
    descricao?: string;
    escolaridade?: string;
    tipo?: string;
    regimeTrabalho?: string;
    beneficios?: string;
    acessibilidades?: string[];
    subtiposAceitos?: number[];
    isActive?: boolean;
  }) {
    const vaga = await VagasRepo.findById(vagaId);
    if (!vaga) throw new Error("Vaga não encontrada");

    // Separar acessibilidades e subtipos dos outros dados
    const { acessibilidades, subtiposAceitos, ...dadosVaga } = dados;

    // Verificar se está fechando a vaga
    const estaFechandoVaga = vaga.isActive === true && dados.isActive === false;

    // Atualizar dados da vaga (sem acessibilidades e subtipos)
    const vagaAtualizada = await VagasRepo.update(vagaId, dadosVaga);
    
    // Atualizar acessibilidades se fornecidas
    if (acessibilidades !== undefined) {
      // Remover acessibilidades existentes
      await prisma.vagaAcessibilidade.deleteMany({ where: { vagaId } });
      
      // Adicionar novas acessibilidades
      if (acessibilidades.length > 0) {
        await this.vincularAcessibilidadesPorNome(vagaId, acessibilidades);
      }
    }
    
    // Atualizar subtipos aceitos se fornecidos
    if (subtiposAceitos !== undefined) {
      console.log('[VagasService] Atualizando subtipos aceitos:', subtiposAceitos);
      // Remover subtipos existentes
      await prisma.vagaSubtipo.deleteMany({ where: { vagaId } });
      
      // Adicionar novos subtipos
      if (subtiposAceitos.length > 0) {
        await VagasRepo.linkSubtipos(vagaId, subtiposAceitos);
      }
    }
    
    // Registrar atividade se está fechando a vaga
    if (estaFechandoVaga) {
      const empresaNome = (vaga.empresa as any).nomeFantasia || (vaga.empresa as any).razaoSocial || vaga.empresa.nome;
      await ActivityLogService.logVagaFechada(empresaNome, vaga.empresaId, vaga.titulo, vagaId);
    }
    
    return vagaAtualizada;
  },

  async vincularAcessibilidadesPorNome(vagaId: number, nomes: string[]) {
    console.log('[VagasService] Vinculando acessibilidades:', { vagaId, nomes });
    
    // Buscar IDs das acessibilidades pelos nomes/descrições (case-insensitive)
    const acessibilidades = await prisma.acessibilidade.findMany({
      where: { 
        descricao: { 
          in: nomes,
          mode: 'insensitive'
        } 
      }
    });
    
    console.log('[VagasService] Acessibilidades encontradas:', acessibilidades);
    
    if (acessibilidades.length === 0) {
      console.warn('[VagasService] Nenhuma acessibilidade encontrada para os nomes fornecidos');
      return;
    }
    
    if (acessibilidades.length !== nomes.length) {
      console.warn('[VagasService] Algumas acessibilidades não foram encontradas:', {
        esperadas: nomes.length,
        encontradas: acessibilidades.length
      });
    }
    
    const acessibilidadeIds = acessibilidades.map(a => a.id);
    await VagasRepo.linkAcessibilidades(vagaId, acessibilidadeIds);
    
    console.log('[VagasService] Acessibilidades vinculadas com sucesso:', acessibilidadeIds);
    
    // Verificar se foram realmente salvas
    const vagaComAcessibilidades = await VagasRepo.findById(vagaId);
    console.log('[VagasService] Verificação - Acessibilidades salvas na vaga:', vagaComAcessibilidades?.acessibilidades);
  },

  async registrarVisualizacao(vagaId: number) {
    const vaga = await VagasRepo.findById(vagaId);
    if (!vaga) throw new Error("Vaga não encontrada");
    return VagasRepo.incrementViews(vagaId);
  },
};
