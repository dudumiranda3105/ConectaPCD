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
/// <reference types="jest" />
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Mock do prisma
const mockPrisma = {
    candidato: {
        findUnique: jest.fn(),
        create: jest.fn(),
        count: jest.fn(),
    },
    empresa: {
        findUnique: jest.fn(),
        create: jest.fn(),
        count: jest.fn(),
    },
};
jest.mock('../../repositories/prisma', () => ({
    prisma: mockPrisma,
}));
// Importar após o mock
const authService = __importStar(require("../../services/auth.service"));
describe('Auth Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('register', () => {
        it('deve registrar um novo candidato com sucesso', async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                role: 'candidato',
            };
            mockPrisma.candidato.findUnique.mockResolvedValue(null);
            mockPrisma.empresa.findUnique.mockResolvedValue(null);
            mockPrisma.candidato.create.mockResolvedValue({
                id: 1,
                nome: userData.name,
                email: userData.email,
                password: await bcryptjs_1.default.hash(userData.password, 10),
            });
            const result = await authService.register(userData);
            expect(result).toHaveProperty('token');
            expect(result).toHaveProperty('user');
            expect(result.user.email).toBe(userData.email);
            expect(mockPrisma.candidato.create).toHaveBeenCalled();
        });
        it('deve lançar erro se email já existe como candidato', async () => {
            const userData = {
                name: 'Test User',
                email: 'existing@example.com',
                password: 'password123',
                role: 'candidato',
            };
            mockPrisma.candidato.findUnique.mockResolvedValue({
                id: 1,
                email: userData.email,
            });
            await expect(authService.register(userData)).rejects.toThrow();
        });
        it('deve registrar uma nova empresa com sucesso', async () => {
            const userData = {
                name: 'Test Company',
                email: 'company@example.com',
                password: 'password123',
                role: 'empresa',
            };
            mockPrisma.candidato.findUnique.mockResolvedValue(null);
            mockPrisma.empresa.findUnique.mockResolvedValue(null);
            mockPrisma.empresa.create.mockResolvedValue({
                id: 1,
                nome: userData.name,
                email: userData.email,
                password: await bcryptjs_1.default.hash(userData.password, 10),
            });
            const result = await authService.register(userData);
            expect(result).toHaveProperty('token');
            expect(result).toHaveProperty('user');
            expect(result.user.email).toBe(userData.email);
            expect(mockPrisma.empresa.create).toHaveBeenCalled();
        });
    });
    describe('login', () => {
        it('deve fazer login de candidato com sucesso', async () => {
            const email = 'test@example.com';
            const password = 'password123';
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            mockPrisma.candidato.findUnique.mockResolvedValue({
                id: 1,
                nome: 'Test User',
                email,
                password: hashedPassword,
            });
            const result = await authService.login(email, password);
            expect(result).toHaveProperty('token');
            expect(result).toHaveProperty('user');
            expect(result.user.email).toBe(email);
            expect(result.user.role).toBe('candidato');
        });
        it('deve fazer login de empresa com sucesso', async () => {
            const email = 'company@example.com';
            const password = 'password123';
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            mockPrisma.candidato.findUnique.mockResolvedValue(null);
            mockPrisma.empresa.findUnique.mockResolvedValue({
                id: 1,
                nome: 'Test Company',
                email,
                password: hashedPassword,
            });
            const result = await authService.login(email, password);
            expect(result).toHaveProperty('token');
            expect(result).toHaveProperty('user');
            expect(result.user.email).toBe(email);
            expect(result.user.role).toBe('empresa');
        });
        it('deve lançar erro para email não encontrado', async () => {
            mockPrisma.candidato.findUnique.mockResolvedValue(null);
            mockPrisma.empresa.findUnique.mockResolvedValue(null);
            await expect(authService.login('notfound@example.com', 'password123')).rejects.toThrow();
        });
        it('deve lançar erro para senha incorreta', async () => {
            const email = 'test@example.com';
            const correctPassword = 'password123';
            const wrongPassword = 'wrongpassword';
            const hashedPassword = await bcryptjs_1.default.hash(correctPassword, 10);
            mockPrisma.candidato.findUnique.mockResolvedValue({
                id: 1,
                nome: 'Test User',
                email,
                password: hashedPassword,
            });
            await expect(authService.login(email, wrongPassword)).rejects.toThrow();
        });
    });
});
//# sourceMappingURL=auth.service.test.js.map