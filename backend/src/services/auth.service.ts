import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as authRepo from "../repositories/auth.repo";
import { prisma } from "../repositories/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_this";

export const register = async (payload: {
  name: string;
  email: string;
  password: string;
  role?: string;
}) => {
  const existing = await authRepo.findUserByEmail(payload.email);
  if (existing) throw new Error("E-mail já cadastrado");

  const hashed = await bcrypt.hash(payload.password, 10);
  const user = await authRepo.createUser({
    name: payload.name,
    email: payload.email,
    password: hashed,
    role: payload.role,
  });

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });

  // Buscar empresaId ou candidatoId se já existir
  let empresaId: number | undefined;
  let candidatoId: number | undefined;

  try {
    if (user.role === "COMPANY") {
      const empresa = await authRepo.findEmpresaByUserId(user.id);
      empresaId = empresa?.id;
    } else if (user.role === "CANDIDATE") {
      const candidato = await authRepo.findCandidatoByUserId(user.id);
      candidatoId = candidato?.id;
    }
  } catch (e) {
    console.error("[AUTH][REGISTER] Erro ao buscar empresa/candidato:", e);
  }

  // @ts-ignore
  delete user.password;

  return { user: { ...user, empresaId, candidatoId }, token };
};

export const login = async (email: string, password: string) => {
  const user = await authRepo.findUserByEmail(email);
  if (!user) throw new Error("Credenciais inválidas");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Credenciais inválidas");

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });

  // Buscar empresaId ou candidatoId conforme o role
  let empresaId: number | undefined;
  let candidatoId: number | undefined;

  try {
    if (user.role === "COMPANY") {
      let empresa = await authRepo.findEmpresaByUserId(user.id);
      // Se não existe, criar empresa básica automaticamente
      if (!empresa) {
        console.log("[AUTH][LOGIN] Criando registro de empresa para userId:", user.id);
        empresa = await prisma.empresa.create({
          data: {
            userId: user.id,
            nome: user.name,
            email: user.email,
          },
        });
      }
      empresaId = empresa?.id;
      console.log("[AUTH][LOGIN] EmpresaId encontrado:", empresaId);
    } else if (user.role === "CANDIDATE") {
      let candidato = await authRepo.findCandidatoByUserId(user.id);
      // Se não existe, criar candidato básico automaticamente
      if (!candidato) {
        console.log("[AUTH][LOGIN] Criando registro de candidato para userId:", user.id);
        candidato = await prisma.candidato.create({
          data: {
            userId: user.id,
            nome: user.name,
            email: user.email,
            escolaridade: "",
          },
        });
      }
      candidatoId = candidato?.id;
      console.log("[AUTH][LOGIN] CandidatoId encontrado:", candidatoId);
    }
  } catch (e) {
    console.error("[AUTH][LOGIN] Erro ao buscar/criar empresa/candidato:", e);
    // Continua mesmo se falhar
  }

  // @ts-ignore
  delete user.password;

  return { user: { ...user, empresaId, candidatoId }, token };
};
