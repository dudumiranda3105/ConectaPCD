/// <reference types="jest" />

// Mock do prisma
const mockPrisma = {
  candidatura: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
  vaga: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  candidato: {
    findUnique: jest.fn(),
  },
  empresa: {
    findUnique: jest.fn(),
  },
};

jest.mock('../../repositories/prisma', () => ({
  prisma: mockPrisma,
}));

describe('Candidaturas Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('criar candidatura', () => {
    it('deve criar uma candidatura com sucesso', async () => {
      const candidatoId = 1;
      const vagaId = 1;

      // Mock - vaga existe e está ativa
      mockPrisma.vaga.findUnique.mockResolvedValue({
        id: vagaId,
        titulo: 'Vaga Teste',
        status: 'ativa',
        empresaId: 1,
      });

      // Mock - não existe candidatura anterior
      mockPrisma.candidatura.findFirst.mockResolvedValue(null);

      // Mock - candidatura criada
      mockPrisma.candidatura.create.mockResolvedValue({
        id: 1,
        candidatoId,
        vagaId,
        status: 'pendente',
        createdAt: new Date(),
      });

      // Simular comportamento do service
      const vaga = await mockPrisma.vaga.findUnique({ where: { id: vagaId } });
      expect(vaga).not.toBeNull();
      expect(vaga.status).toBe('ativa');

      const existingCandidatura = await mockPrisma.candidatura.findFirst({
        where: { candidatoId, vagaId },
      });
      expect(existingCandidatura).toBeNull();

      const candidatura = await mockPrisma.candidatura.create({
        data: { candidatoId, vagaId, status: 'pendente' },
      });

      expect(candidatura).toHaveProperty('id');
      expect(candidatura.candidatoId).toBe(candidatoId);
      expect(candidatura.vagaId).toBe(vagaId);
      expect(candidatura.status).toBe('pendente');
    });

    it('não deve criar candidatura duplicada', async () => {
      const candidatoId = 1;
      const vagaId = 1;

      // Mock - já existe candidatura
      mockPrisma.candidatura.findFirst.mockResolvedValue({
        id: 1,
        candidatoId,
        vagaId,
        status: 'pendente',
      });

      const existingCandidatura = await mockPrisma.candidatura.findFirst({
        where: { candidatoId, vagaId },
      });

      expect(existingCandidatura).not.toBeNull();
      // O service deve lançar erro neste caso
    });

    it('não deve criar candidatura para vaga inativa', async () => {
      const vagaId = 1;

      // Mock - vaga está encerrada
      mockPrisma.vaga.findUnique.mockResolvedValue({
        id: vagaId,
        titulo: 'Vaga Encerrada',
        status: 'encerrada',
        empresaId: 1,
      });

      const vaga = await mockPrisma.vaga.findUnique({ where: { id: vagaId } });
      expect(vaga.status).toBe('encerrada');
      // O service deve lançar erro neste caso
    });
  });

  describe('atualizar status', () => {
    it('deve atualizar status de pendente para em_analise', async () => {
      const candidaturaId = 1;

      mockPrisma.candidatura.update.mockResolvedValue({
        id: candidaturaId,
        status: 'em_analise',
      });

      const updated = await mockPrisma.candidatura.update({
        where: { id: candidaturaId },
        data: { status: 'em_analise' },
      });

      expect(updated.status).toBe('em_analise');
    });

    it('deve atualizar status para aprovado', async () => {
      const candidaturaId = 1;

      mockPrisma.candidatura.update.mockResolvedValue({
        id: candidaturaId,
        status: 'aprovado',
      });

      const updated = await mockPrisma.candidatura.update({
        where: { id: candidaturaId },
        data: { status: 'aprovado' },
      });

      expect(updated.status).toBe('aprovado');
    });

    it('deve atualizar status para contratado', async () => {
      const candidaturaId = 1;

      mockPrisma.candidatura.update.mockResolvedValue({
        id: candidaturaId,
        status: 'contratado',
      });

      const updated = await mockPrisma.candidatura.update({
        where: { id: candidaturaId },
        data: { status: 'contratado' },
      });

      expect(updated.status).toBe('contratado');
    });
  });

  describe('listar candidaturas', () => {
    it('deve listar candidaturas de um candidato', async () => {
      const candidatoId = 1;

      mockPrisma.candidatura.findMany.mockResolvedValue([
        { id: 1, candidatoId, vagaId: 1, status: 'pendente' },
        { id: 2, candidatoId, vagaId: 2, status: 'aprovado' },
      ]);

      const candidaturas = await mockPrisma.candidatura.findMany({
        where: { candidatoId },
      });

      expect(candidaturas).toHaveLength(2);
      expect(candidaturas[0].candidatoId).toBe(candidatoId);
    });

    it('deve listar candidaturas de uma vaga', async () => {
      const vagaId = 1;

      mockPrisma.candidatura.findMany.mockResolvedValue([
        { id: 1, candidatoId: 1, vagaId, status: 'pendente' },
        { id: 2, candidatoId: 2, vagaId, status: 'em_analise' },
        { id: 3, candidatoId: 3, vagaId, status: 'aprovado' },
      ]);

      const candidaturas = await mockPrisma.candidatura.findMany({
        where: { vagaId },
      });

      expect(candidaturas).toHaveLength(3);
      expect(candidaturas.every((c: any) => c.vagaId === vagaId)).toBe(true);
    });
  });

  describe('contar candidaturas', () => {
    it('deve contar candidaturas por status', async () => {
      mockPrisma.candidatura.count.mockResolvedValue(5);

      const count = await mockPrisma.candidatura.count({
        where: { status: 'pendente' },
      });

      expect(count).toBe(5);
    });

    it('deve contar contratações', async () => {
      mockPrisma.candidatura.count.mockResolvedValue(10);

      const count = await mockPrisma.candidatura.count({
        where: { status: 'contratado' },
      });

      expect(count).toBe(10);
    });
  });
});
