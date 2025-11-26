/// <reference types="jest" />
import bcryptjs from 'bcryptjs';

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
import * as authService from '../../services/auth.service';

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
        password: await bcryptjs.hash(userData.password, 10),
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
        password: await bcryptjs.hash(userData.password, 10),
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
      const hashedPassword = await bcryptjs.hash(password, 10);

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
      const hashedPassword = await bcryptjs.hash(password, 10);

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
      const hashedPassword = await bcryptjs.hash(correctPassword, 10);

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
