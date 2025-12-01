"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authRepo = __importStar(require("../repositories/auth.repo"));
const activityLog_service_1 = require("./activityLog.service");
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_this";
const register = async (payload) => {
    const existing = await authRepo.findUserByEmail(payload.email);
    if (existing)
        throw new Error("E-mail já cadastrado");
    const hashed = await bcryptjs_1.default.hash(payload.password, 10);
    // Normaliza role
    const roleInput = payload.role ? String(payload.role).toUpperCase() : "CANDIDATE";
    const role = roleInput === "COMPANY" ? "COMPANY" : roleInput === "ADMIN" ? "ADMIN" : "CANDIDATE";
    let user;
    let userType;
    let entityId;
    // Cria na tabela apropriada
    if (role === "COMPANY") {
        const empresa = await authRepo.createEmpresa({
            name: payload.name,
            email: payload.email,
            password: hashed,
        });
        user = {
            id: empresa.id,
            name: empresa.nome,
            email: empresa.email,
            role: "COMPANY",
            isActive: empresa.isActive,
        };
        userType = "empresa";
        entityId = empresa.id;
        // Registrar atividade de cadastro de empresa
        await activityLog_service_1.ActivityLogService.logCadastro(payload.name, 'EMPRESA', empresa.id);
    }
    else if (role === "ADMIN") {
        const admin = await authRepo.createAdmin({
            name: payload.name,
            email: payload.email,
            password: hashed,
        });
        user = {
            id: admin.id,
            name: admin.nome,
            email: admin.email,
            role: "ADMIN",
            isActive: admin.isActive,
        };
        userType = "admin";
        entityId = admin.id;
    }
    else {
        const candidato = await authRepo.createCandidato({
            name: payload.name,
            email: payload.email,
            password: hashed,
        });
        user = {
            id: candidato.id,
            name: candidato.nome,
            email: candidato.email,
            role: "CANDIDATE",
            isActive: candidato.isActive,
        };
        userType = "candidato";
        entityId = candidato.id;
        // Registrar atividade de cadastro de candidato
        await activityLog_service_1.ActivityLogService.logCadastro(payload.name, 'CANDIDATO', candidato.id);
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role, userType }, JWT_SECRET, { expiresIn: "7d" });
    // Retorna com IDs específicos
    const responseUser = { ...user };
    if (userType === "empresa") {
        responseUser.empresaId = entityId;
    }
    else if (userType === "candidato") {
        responseUser.candidatoId = entityId;
    }
    return { user: responseUser, token };
};
exports.register = register;
const login = async (email, password) => {
    const user = await authRepo.findUserByEmail(email);
    if (!user)
        throw new Error("Credenciais inválidas");
    const isValid = await bcryptjs_1.default.compare(password, user.password);
    if (!isValid)
        throw new Error("Credenciais inválidas");
    if (!user.isActive)
        throw new Error("Usuário inativo");
    const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role, userType: user.userType }, JWT_SECRET, { expiresIn: "7d" });
    // Remove password do retorno
    const userResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
    };
    // Adiciona ID específico
    if (user.userType === "empresa") {
        userResponse.empresaId = user.id;
    }
    else if (user.userType === "candidato") {
        userResponse.candidatoId = user.id;
    }
    // Registrar atividade de login
    const activityUserType = user.userType === 'empresa' ? 'EMPRESA' :
        user.userType === 'admin' ? 'ADMIN' : 'CANDIDATO';
    await activityLog_service_1.ActivityLogService.logLogin(user.name, activityUserType, user.id);
    return { user: userResponse, token };
};
exports.login = login;
//# sourceMappingURL=auth.service.js.map