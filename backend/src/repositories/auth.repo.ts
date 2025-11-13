import { prisma } from "./prisma";

export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
  role?: string;
}) => {
  // normaliza role para os valores do enum Prisma (CANDIDATE | COMPANY | ADMIN)
  const roleInput = data.role ? String(data.role).toUpperCase() : undefined;
  const role = roleInput === "COMPANY" ? "COMPANY" : roleInput === "ADMIN" ? "ADMIN" : roleInput === "CANDIDATE" ? "CANDIDATE" : undefined;

  const createData: any = {
    name: data.name,
    email: data.email,
    password: data.password,
  };
  if (role) createData.role = role;

  return prisma.user.create({ data: createData });
};

export const findUserByEmail = async (email: string) => {
  if (!email) return null
  return prisma.user.findUnique({ where: { email } });
};

export const findUserById = async (id: number) => {
  return prisma.user.findUnique({ where: { id } });
};

export const findEmpresaByUserId = async (userId: number) => {
  return prisma.empresa.findUnique({ where: { userId } });
};

export const findCandidatoByUserId = async (userId: number) => {
  return prisma.candidato.findUnique({ where: { userId } });
};
