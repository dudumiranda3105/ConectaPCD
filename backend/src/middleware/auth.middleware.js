"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.candidateOnly = exports.companyOnly = exports.adminOnly = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
if (!process.env.JWT_SECRET) {
    console.warn('JWT_SECRET não definido, usando valor padrão (apenas dev)');
}
const JWT_SECRET = (process.env.JWT_SECRET || 'dev_secret_change_this');
const authMiddleware = (req, res, next) => {
    const auth = (req.headers.authorization || '').split(' ');
    if (auth.length !== 2 || auth[0] !== 'Bearer') {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    const token = auth[1];
    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = {
            id: payload.userId,
            role: payload.role,
            userType: payload.userType
        };
        next();
    }
    catch (err) {
        return res.status(401).json({ error: 'Token inválido' });
    }
};
exports.authMiddleware = authMiddleware;
// Middleware específico para admin
const adminOnly = (req, res, next) => {
    const user = req.user;
    if (!user || user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Acesso negado: apenas administradores' });
    }
    next();
};
exports.adminOnly = adminOnly;
// Middleware específico para empresas
const companyOnly = (req, res, next) => {
    const user = req.user;
    if (!user || user.role !== 'COMPANY') {
        return res.status(403).json({ error: 'Acesso negado: apenas empresas' });
    }
    next();
};
exports.companyOnly = companyOnly;
// Middleware específico para candidatos
const candidateOnly = (req, res, next) => {
    const user = req.user;
    if (!user || user.role !== 'CANDIDATE') {
        return res.status(403).json({ error: 'Acesso negado: apenas candidatos' });
    }
    next();
};
exports.candidateOnly = candidateOnly;
//# sourceMappingURL=auth.middleware.js.map