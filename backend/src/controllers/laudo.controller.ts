import { Request, Response } from 'express';
import { prisma } from '../repositories/prisma';
import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import { ActivityLogService } from '../services/activityLog.service';

// Função para validar se o PDF é válido e não está corrompido
async function validatePDF(filePath: string): Promise<{ valid: boolean; pages?: number; error?: string }> {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    
    // Verificar assinatura do PDF (magic bytes)
    const pdfSignature = fileBuffer.slice(0, 5).toString();
    if (pdfSignature !== '%PDF-') {
      return { valid: false, error: 'Arquivo não é um PDF válido' };
    }
    
    // Tentar carregar o PDF para verificar se está corrompido
    const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
    const pageCount = pdfDoc.getPageCount();
    
    if (pageCount < 1) {
      return { valid: false, error: 'PDF não contém páginas' };
    }
    
    return { valid: true, pages: pageCount };
  } catch (error: any) {
    return { valid: false, error: `PDF inválido ou corrompido: ${error.message}` };
  }
}

export const LaudoController = {
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
      if (!uploaded) {
        return res.status(400).json({ error: 'Arquivo não enviado' });
      }
      
      // Verificar se é PDF
      if (uploaded.mimetype !== 'application/pdf') {
        // Remover arquivo inválido
        fs.unlink(uploaded.path, () => {});
        return res.status(400).json({ error: 'O laudo médico deve ser um arquivo PDF' });
      }
      
      // Validar o PDF
      const validation = await validatePDF(uploaded.path);
      if (!validation.valid) {
        // Remover arquivo inválido
        fs.unlink(uploaded.path, () => {});
        return res.status(400).json({ 
          error: 'Arquivo PDF inválido', 
          details: validation.error 
        });
      }
      
      // Se houver laudo anterior, remover
      if (candidato.laudoMedicoUrl) {
        const oldFilename = candidato.laudoMedicoUrl.replace('/uploads/', '');
        const oldFilePath = path.resolve(process.cwd(), 'uploads', oldFilename);
        fs.unlink(oldFilePath, () => {}); // silencioso
      }
      
      const url = `/uploads/${uploaded.filename}`;
      const updated = await prisma.candidato.update({
        where: { id: candidato.id },
        data: { laudoMedicoUrl: url },
        select: { id: true, laudoMedicoUrl: true },
      });
      
      // Registrar atividade de envio de laudo médico
      await ActivityLogService.logLaudoEnviado(candidato.nome, candidato.id);
      
      res.status(200).json({
        ...updated,
        validation: {
          valid: true,
          pages: validation.pages,
          message: `PDF válido com ${validation.pages} página(s)`
        }
      });
    } catch (e: any) {
      console.error('Erro ao enviar laudo:', e);
      res.status(400).json({ error: e.message || 'Erro ao enviar laudo médico' });
    }
  },
  
  async get(req: Request, res: Response) {
    try {
      const id = Number(req.params.candidatoId);
      const cand = await prisma.candidato.findUnique({ 
        where: { id }, 
        select: { laudoMedicoUrl: true } 
      });
      if (!cand) {
        return res.status(404).json({ error: 'Candidato não encontrado' });
      }
      res.json(cand);
    } catch (e: any) {
      res.status(400).json({ error: e.message || 'Erro ao obter laudo médico' });
    }
  },
  
  async delete(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (!user || user.role !== 'CANDIDATE') {
        return res.status(403).json({ error: 'Acesso negado' });
      }
      
      const candidato = await prisma.candidato.findUnique({ where: { id: user.id } });
      if (!candidato) {
        return res.status(404).json({ error: 'Perfil de candidato não encontrado' });
      }
      
      const current = await prisma.candidato.findUnique({ 
        where: { id: candidato.id }, 
        select: { laudoMedicoUrl: true } 
      });
      
      if (current?.laudoMedicoUrl) {
        const filename = current.laudoMedicoUrl.replace('/uploads/', '');
        const filePath = path.resolve(process.cwd(), 'uploads', filename);
        fs.unlink(filePath, () => {}); // silencioso
      }
      
      const updated = await prisma.candidato.update({ 
        where: { id: candidato.id }, 
        data: { laudoMedicoUrl: null }, 
        select: { id: true, laudoMedicoUrl: true } 
      });
      
      res.json(updated);
    } catch (e: any) {
      res.status(400).json({ error: e.message || 'Erro ao remover laudo médico' });
    }
  },
  
  // Endpoint para validar se um laudo é autêntico (verifica estrutura do PDF)
  async validate(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (!user) {
        return res.status(403).json({ error: 'Acesso negado' });
      }
      
      const uploaded = (req as any).file as any;
      if (!uploaded) {
        return res.status(400).json({ error: 'Arquivo não enviado' });
      }
      
      // Verificar se é PDF
      if (uploaded.mimetype !== 'application/pdf') {
        fs.unlink(uploaded.path, () => {});
        return res.status(400).json({ 
          valid: false,
          error: 'O arquivo deve ser um PDF' 
        });
      }
      
      const validation = await validatePDF(uploaded.path);
      
      // Remover arquivo temporário após validação
      fs.unlink(uploaded.path, () => {});
      
      if (!validation.valid) {
        return res.status(400).json({ 
          valid: false,
          error: validation.error 
        });
      }
      
      res.json({
        valid: true,
        pages: validation.pages,
        message: `PDF válido com ${validation.pages} página(s). O documento pode ser enviado.`
      });
    } catch (e: any) {
      res.status(400).json({ 
        valid: false,
        error: e.message || 'Erro ao validar laudo médico' 
      });
    }
  }
};
