import { Request, Response } from 'express';
import { prisma } from '../repositories/prisma';
import fs from 'fs';
import path from 'path';

export const CurriculoController = {
  async upload(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (!user || user.role !== 'CANDIDATE') {
        return res.status(403).json({ error: 'Acesso negado' });
      }
      const candidato = await prisma.candidato.findUnique({ where: { id: user.id } });
      if (!candidato) {
        return res.status(404).json({ error: 'Perfil de candidato não encontrado' });
      }
      const uploaded = (req as any).file as any;
      if (!uploaded) return res.status(400).json({ error: 'Arquivo não enviado' });
      const url = `/uploads/${uploaded.filename}`;
      const updated = await prisma.candidato.update({
        where: { id: candidato.id },
        data: { curriculoUrl: url },
        select: { id: true, curriculoUrl: true },
      });
      res.status(200).json(updated);
    } catch (e: any) {
      res.status(400).json({ error: e.message || 'Erro ao enviar currículo' });
    }
  },
  async get(req: Request, res: Response) {
    try {
      const id = Number(req.params.candidatoId);
      const cand = await prisma.candidato.findUnique({ where: { id }, select: { curriculoUrl: true } });
      if (!cand) return res.status(404).json({ error: 'Candidato não encontrado' });
      res.json(cand);
    } catch (e: any) {
      res.status(400).json({ error: e.message || 'Erro ao obter currículo' });
    }
  },
  async delete(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (!user || user.role !== 'CANDIDATE') {
        return res.status(403).json({ error: 'Acesso negado' });
      }
      const candidato = await prisma.candidato.findUnique({ where: { id: user.id } });
      if (!candidato) return res.status(404).json({ error: 'Perfil de candidato não encontrado' });
      const current = await prisma.candidato.findUnique({ where: { id: candidato.id }, select: { curriculoUrl: true } });
      if (current?.curriculoUrl) {
        const filename = current.curriculoUrl.replace('/uploads/', '');
        const filePath = path.resolve(process.cwd(), 'uploads', filename);
        fs.unlink(filePath, () => {}); // silencioso
      }
      const updated = await prisma.candidato.update({ where: { id: candidato.id }, data: { curriculoUrl: null }, select: { id: true, curriculoUrl: true } });
      res.json(updated);
    } catch (e: any) {
      res.status(400).json({ error: e.message || 'Erro ao remover currículo' });
    }
  }
};
