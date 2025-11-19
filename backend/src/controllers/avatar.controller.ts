import { Request, Response } from 'express'
import { prisma } from '../repositories/prisma'
import fs from 'fs'
import path from 'path'

export const AvatarController = {
  async upload(req: Request, res: Response) {
    try {
      const user = (req as any).user
      if (!user || user.role !== 'CANDIDATE') {
        return res.status(403).json({ error: 'Acesso negado' })
      }
      const candidato = await prisma.candidato.findUnique({ where: { id: user.id } })
      if (!candidato) return res.status(404).json({ error: 'Perfil de candidato não encontrado' })

      const uploaded = (req as any).file as any
      if (!uploaded) return res.status(400).json({ error: 'Arquivo não enviado' })
      const url = `/uploads/${uploaded.filename}`

      // remove avatar anterior (se existir)
      const previous = (candidato as any).avatarUrl as string | undefined
      if (previous) {
        const filenamePrev = previous.replace('/uploads/', '')
        const filePathPrev = path.resolve(process.cwd(), 'uploads', filenamePrev)
        fs.unlink(filePathPrev, () => {})
      }

      const updated = await prisma.candidato.update({
        where: { id: candidato.id },
        data: { avatarUrl: url } as any,
        select: { id: true, avatarUrl: true } as any,
      })
      res.status(200).json(updated)
    } catch (e: any) {
      res.status(400).json({ error: e.message || 'Erro ao enviar avatar' })
    }
  },
  async get(req: Request, res: Response) {
    try {
      const id = Number(req.params.candidatoId)
      const cand = await prisma.candidato.findUnique({ where: { id }, select: { avatarUrl: true } as any })
      if (!cand) return res.status(404).json({ error: 'Candidato não encontrado' })
      res.json(cand)
    } catch (e: any) {
      res.status(400).json({ error: e.message || 'Erro ao obter avatar' })
    }
  },
  async delete(req: Request, res: Response) {
    try {
      const user = (req as any).user
      if (!user || user.role !== 'CANDIDATE') {
        return res.status(403).json({ error: 'Acesso negado' })
      }
      const candidato = await prisma.candidato.findUnique({ where: { id: user.id } })
      if (!candidato) return res.status(404).json({ error: 'Perfil de candidato não encontrado' })
      const currentAvatar = (candidato as any).avatarUrl as string | undefined
      if (currentAvatar) {
        const filename = currentAvatar.replace('/uploads/', '')
        const filePath = path.resolve(process.cwd(), 'uploads', filename)
        fs.unlink(filePath, () => {})
      }
      const updated = await prisma.candidato.update({
        where: { id: candidato.id },
        data: { avatarUrl: null } as any,
        select: { id: true, avatarUrl: true } as any,
      })
      res.json(updated)
    } catch (e: any) {
      res.status(400).json({ error: e.message || 'Erro ao remover avatar' })
    }
  },
}
