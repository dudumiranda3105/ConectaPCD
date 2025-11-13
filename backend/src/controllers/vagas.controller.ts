import { Request, Response } from "express";
import { VagasRepo } from "../repositories/vagas.repo";
import { VagasService } from "../services/vagas.service";
import { prisma } from "../repositories/prisma";

export const VagasController = {
  // Debug: listar todas as candidaturas
  async listarTodasCandidaturas(req: Request, res: Response) {
    try {
      const todasCandidaturas = await prisma.candidatura.findMany({
        include: {
          candidato: { select: { nome: true } },
          vaga: { select: { titulo: true } }
        }
      });
      console.log(`[Debug] Total de candidaturas no banco: ${todasCandidaturas.length}`);
      res.json(todasCandidaturas);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async listar(req: Request, res: Response) {
      const empresaIdParam = (req.params as any).empresaId ?? (req.params as any).id;
      const empresaId = empresaIdParam ? Number(empresaIdParam) : undefined;
    const data = await VagasRepo.list(empresaId);
    res.json(data);
  },

  async detalhar(req: Request, res: Response) {
    const id = Number(req.params.id);
    const vaga = await VagasRepo.findById(id);
    if (!vaga) return res.status(404).json({ error: "Vaga não encontrada" });

    // “achatar” as N:N para resposta mais amigável
    const subtipos = vaga.subtiposAceitos.map((vs) => vs.subtipo);
    const acessibilidades = vaga.acessibilidades.map((va) => va.acessibilidade);

    res.json({
      id: vaga.id,
      titulo: vaga.titulo,
      descricao: vaga.descricao,
      escolaridade: vaga.escolaridade,
      empresa: vaga.empresa,
      subtipos,
      acessibilidades,
    });
  },

  async criar(req: Request, res: Response) {
    try {
      const { empresaId, titulo, descricao, escolaridade, tipo, regimeTrabalho, beneficios, acessibilidades } = req.body;
      const vaga = await VagasService.criarVaga(Number(empresaId), titulo, descricao, escolaridade, tipo, regimeTrabalho, beneficios, acessibilidades);
      res.status(201).json(vaga);
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao criar vaga" });
    }
  },

  async vincularSubtipos(req: Request, res: Response) {
    try {
      const vagaId = Number(req.params.id);
      const { subtipoIds } = req.body as { subtipoIds: number[] };
      await VagasService.vincularSubtipos(vagaId, subtipoIds);
      res.json({ ok: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao vincular subtipos" });
    }
  },

  async vincularAcessibilidades(req: Request, res: Response) {
    try {
      const vagaId = Number(req.params.id);
      const { acessibilidadeIds } = req.body as { acessibilidadeIds: number[] };
      await VagasService.vincularAcessibilidades(vagaId, acessibilidadeIds);
      res.json({ ok: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao vincular acessibilidades" });
    }
  },

  async getAcessibilidadesPossiveis(req: Request, res: Response) {
    try {
      const vagaId = Number(req.params.id);
      if (isNaN(vagaId)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const acess = await VagasService.listarAcessibilidadesPossiveis(vagaId);
      res.json(acess);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Erro ao listar acessibilidades" });
    }
  },

  async listarCandidaturas(req: Request, res: Response) {
    try {
      const vagaId = Number(req.params.id);
      console.log(`[VagasController] Buscando candidaturas para vaga ID: ${vagaId}`);
      
      if (isNaN(vagaId)) {
        return res.status(400).json({ error: "ID da vaga inválido" });
      }

      const candidaturas = await VagasService.listarCandidaturasPorVaga(vagaId);
      console.log(`[VagasController] Retornando ${candidaturas.length} candidaturas`);
      res.json(candidaturas);
    } catch (err: any) {
      console.error(`[VagasController] Erro ao listar candidaturas:`, err.message);
      res.status(500).json({ error: err.message || "Erro ao listar candidaturas" });
    }
  },

  async atualizar(req: Request, res: Response) {
    try {
      const vagaId = Number(req.params.id);
      const { titulo, descricao, escolaridade, tipo, regimeTrabalho, beneficios, acessibilidades, isActive } = req.body;
      
      if (isNaN(vagaId)) {
        return res.status(400).json({ error: "ID da vaga inválido" });
      }

      const vaga = await VagasService.atualizarVaga(vagaId, { titulo, descricao, escolaridade, tipo, regimeTrabalho, beneficios, acessibilidades, isActive });
      res.json(vaga);
    } catch (err: any) {
      res.status(400).json({ error: err.message || "Erro ao atualizar vaga" });
    }
  },
  
};
