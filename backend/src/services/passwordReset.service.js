"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordResetService = void 0;
const prisma_1 = require("../repositories/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const email_service_1 = require("./email.service");
exports.PasswordResetService = {
    // Solicitar reset de senha
    async requestReset(email, userType) {
        // Buscar usuário
        let user = null;
        if (userType === 'candidato') {
            user = await prisma_1.prisma.candidato.findUnique({ where: { email } });
        }
        else {
            user = await prisma_1.prisma.empresa.findUnique({ where: { email } });
        }
        if (!user) {
            // Não revelar se o email existe ou não por segurança
            return { success: true, message: 'Se o email existir, você receberá as instruções' };
        }
        // Gerar token único
        const token = (0, uuid_1.v4)();
        const expiresAt = new Date(Date.now() + 3600000); // 1 hora
        // Salvar token no banco (usando JSON field do usuário temporariamente)
        // Em produção, criar uma tabela específica para tokens
        const resetData = {
            resetToken: token,
            resetExpires: expiresAt.toISOString(),
        };
        if (userType === 'candidato') {
            await prisma_1.prisma.candidato.update({
                where: { id: user.id },
                data: { profileData: { ...(user.profileData || {}), ...resetData } },
            });
        }
        else {
            await prisma_1.prisma.empresa.update({
                where: { id: user.id },
                data: { companyData: { ...(user.companyData || {}), ...resetData } },
            });
        }
        // Enviar email
        await email_service_1.EmailService.sendPasswordReset(email, user.nome, token);
        return { success: true, message: 'Se o email existir, você receberá as instruções' };
    },
    // Validar token de reset
    async validateToken(token, userType) {
        // Buscar por token em candidatos ou empresas
        let user = null;
        if (userType === 'candidato') {
            const candidatos = await prisma_1.prisma.candidato.findMany({
                where: {
                    profileData: {
                        path: ['resetToken'],
                        equals: token,
                    },
                },
            });
            user = candidatos[0];
        }
        else {
            const empresas = await prisma_1.prisma.empresa.findMany({
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
    async resetPassword(token, newPassword, userType) {
        const validation = await this.validateToken(token, userType);
        if (!validation.valid) {
            throw new Error(validation.message);
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        if (userType === 'candidato') {
            const user = await prisma_1.prisma.candidato.findUnique({ where: { id: validation.userId } });
            const profileData = user?.profileData || {};
            delete profileData.resetToken;
            delete profileData.resetExpires;
            await prisma_1.prisma.candidato.update({
                where: { id: validation.userId },
                data: {
                    password: hashedPassword,
                    profileData,
                },
            });
        }
        else {
            const user = await prisma_1.prisma.empresa.findUnique({ where: { id: validation.userId } });
            const companyData = user?.companyData || {};
            delete companyData.resetToken;
            delete companyData.resetExpires;
            await prisma_1.prisma.empresa.update({
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
//# sourceMappingURL=passwordReset.service.js.map