import { prisma } from '../repositories/prisma';
import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from './email.service';

export const PasswordResetService = {
  // Solicitar reset de senha
  async requestReset(email: string, userType: 'candidato' | 'empresa') {
    // Buscar usuário
    let user: any = null;
    
    if (userType === 'candidato') {
      user = await prisma.candidato.findUnique({ where: { email } });
    } else {
      user = await prisma.empresa.findUnique({ where: { email } });
    }

    if (!user) {
      // Não revelar se o email existe ou não por segurança
      return { success: true, message: 'Se o email existir, você receberá as instruções' };
    }

    // Gerar token único
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 3600000); // 1 hora

    // Salvar token no banco (usando JSON field do usuário temporariamente)
    // Em produção, criar uma tabela específica para tokens
    const resetData = {
      resetToken: token,
      resetExpires: expiresAt.toISOString(),
    };

    if (userType === 'candidato') {
      await prisma.candidato.update({
        where: { id: user.id },
        data: { profileData: { ...(user.profileData as object || {}), ...resetData } },
      });
    } else {
      await prisma.empresa.update({
        where: { id: user.id },
        data: { companyData: { ...(user.companyData as object || {}), ...resetData } },
      });
    }

    // Enviar email
    await EmailService.sendPasswordReset(email, user.nome, token);

    return { success: true, message: 'Se o email existir, você receberá as instruções' };
  },

  // Validar token de reset
  async validateToken(token: string, userType: 'candidato' | 'empresa') {
    // Buscar por token em candidatos ou empresas
    let user: any = null;

    if (userType === 'candidato') {
      const candidatos = await prisma.candidato.findMany({
        where: {
          profileData: {
            path: ['resetToken'],
            equals: token,
          },
        },
      });
      user = candidatos[0];
    } else {
      const empresas = await prisma.empresa.findMany({
        where: {
          companyData: {
            path: ['resetToken'],
            equals: token,
          },
        },
      });
      user = empresas[0];
    }

    if (!user) {
      return { valid: false, message: 'Token inválido ou expirado' };
    }

    const data = userType === 'candidato' ? user.profileData : user.companyData;
    const resetExpires = new Date(data?.resetExpires);

    if (resetExpires < new Date()) {
      return { valid: false, message: 'Token expirado' };
    }

    return { valid: true, userId: user.id, userType };
  },

  // Resetar senha
  async resetPassword(token: string, newPassword: string, userType: 'candidato' | 'empresa') {
    const validation = await this.validateToken(token, userType);
    
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    if (userType === 'candidato') {
      const user = await prisma.candidato.findUnique({ where: { id: validation.userId } });
      const profileData = user?.profileData as any || {};
      delete profileData.resetToken;
      delete profileData.resetExpires;

      await prisma.candidato.update({
        where: { id: validation.userId },
        data: { 
          password: hashedPassword,
          profileData,
        },
      });
    } else {
      const user = await prisma.empresa.findUnique({ where: { id: validation.userId } });
      const companyData = user?.companyData as any || {};
      delete companyData.resetToken;
      delete companyData.resetExpires;

      await prisma.empresa.update({
        where: { id: validation.userId },
        data: { 
          password: hashedPassword,
          companyData,
        },
      });
    }

    return { success: true, message: 'Senha alterada com sucesso' };
  },
};
