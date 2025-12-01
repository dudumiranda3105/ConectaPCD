"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordResetController = void 0;
const passwordReset_service_1 = require("../services/passwordReset.service");
exports.PasswordResetController = {
    // POST /auth/forgot-password
    async forgotPassword(req, res) {
        try {
            const { email, userType } = req.body;
            if (!email || !userType) {
                return res.status(400).json({ error: 'Email e tipo de usuário são obrigatórios' });
            }
            if (!['candidato', 'empresa'].includes(userType)) {
                return res.status(400).json({ error: 'Tipo de usuário inválido' });
            }
            const result = await passwordReset_service_1.PasswordResetService.requestReset(email, userType);
            return res.json(result);
        }
        catch (error) {
            console.error('Erro ao solicitar reset de senha:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    },
    // GET /auth/validate-reset-token/:token
    async validateToken(req, res) {
        try {
            const { token } = req.params;
            const { userType } = req.query;
            if (!token || !userType) {
                return res.status(400).json({ error: 'Token e tipo de usuário são obrigatórios' });
            }
            const result = await passwordReset_service_1.PasswordResetService.validateToken(token, userType);
            return res.json(result);
        }
        catch (error) {
            console.error('Erro ao validar token:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    },
    // POST /auth/reset-password
    async resetPassword(req, res) {
        try {
            const { token, newPassword, userType } = req.body;
            if (!token || !newPassword || !userType) {
                return res.status(400).json({
                    error: 'Token, nova senha e tipo de usuário são obrigatórios'
                });
            }
            if (newPassword.length < 6) {
                return res.status(400).json({
                    error: 'A senha deve ter pelo menos 6 caracteres'
                });
            }
            if (!['candidato', 'empresa'].includes(userType)) {
                return res.status(400).json({ error: 'Tipo de usuário inválido' });
            }
            const result = await passwordReset_service_1.PasswordResetService.resetPassword(token, newPassword, userType);
            return res.json(result);
        }
        catch (error) {
            console.error('Erro ao resetar senha:', error);
            return res.status(400).json({ error: error.message || 'Erro ao resetar senha' });
        }
    },
};
//# sourceMappingURL=passwordReset.controller.js.map