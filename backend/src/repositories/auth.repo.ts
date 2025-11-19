import { prisma } from "./prisma";

// Busca usuário por email em todas as três tabelas
export const findUserByEmail = async (email: string) => {
  if (!email) return null;

  // Busca em paralelo nas três tabelas
  const [candidato, empresa, admin] = await Promise.all([
    prisma.candidato.findUnique({ where: { email } }),
    prisma.empresa.findUnique({ where: { email } }),
    prisma.admin.findUnique({ where: { email } }),
  ]);

  if (candidato && candidato.email && candidato.password) {
    return {
      id: candidato.id,
      name: candidato.nome,
      email: candidato.email,
      password: candidato.password,
      role: "CANDIDATE" as const,
      userType: "candidato" as const,
      isActive: candidato.isActive,
    };
  }

  if (empresa && empresa.email && empresa.password) {
    return {
      id: empresa.id,
      name: empresa.nome,
      email: empresa.email,
      password: empresa.password,
      role: "COMPANY" as const,
      userType: "empresa" as const,
      isActive: empresa.isActive,
    };
  }

  if (admin) {
    return {
      id: admin.id,
      name: admin.nome,
      email: admin.email,
      password: admin.password,
      role: "ADMIN" as const,
      userType: "admin" as const,
      isActive: admin.isActive,
    };
  }

  return null;
};

// Cria candidato
export const createCandidato = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  return prisma.candidato.create({
    data: {
      nome: data.name,
      email: data.email,
      password: data.password,
      escolaridade: "",
    },
  });
};

// Cria empresa
export const createEmpresa = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  return prisma.empresa.create({
    data: {
      nome: data.name,
      email: data.email,
      password: data.password,
    },
  });
};

// Cria admin
export const createAdmin = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  return prisma.admin.create({
    data: {
      nome: data.name,
      email: data.email,
      password: data.password,
    },
  });
};

// Busca candidato por ID
export const findCandidatoById = async (id: number) => {
  return prisma.candidato.findUnique({ where: { id } });
};

// Busca empresa por ID
export const findEmpresaById = async (id: number) => {
  return prisma.empresa.findUnique({ where: { id } });
};

// Busca admin por ID
export const findAdminById = async (id: number) => {
  return prisma.admin.findUnique({ where: { id } });
};
