import { Request, Response } from "express";
import { CandidatosService } from "../services/candidatos.service";
import { prisma } from "../repositories/prisma";

export const CandidatosController = {
  async listar(req: Request, res: Response) {
    const data = await CandidatosService.listar();
    res.json(data);
  },

  async buscarPorId(req: Request, res: Response) {
    const id = Number(req.params.id);
    const data = await CandidatosService.buscarPorId(id);
    res.json(data);
  },

  async criar(req: Request, res: Response) {
    const data = await CandidatosService.criar(req.body);
    res.status(201).json(data);
  },

  async listarCandidaturasAprovadas(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
      
      const candidaturas = await prisma.candidatura.findMany({
        where: {
          candidatoId: id,
          status: 'APROVADA'
        },
        include: {
          vaga: {
            include: {
              empresa: {
                select: {
                  id: true,
                  nome: true,
                  companyData: true
                }
              }
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      });
      
      res.json(candidaturas);
    } catch (e: any) {
      res.status(500).json({ error: e.message ?? 'Erro ao buscar candidaturas aprovadas' });
    }
  }
};