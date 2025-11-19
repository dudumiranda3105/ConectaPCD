import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as authRepo from "../repositories/auth.repo";

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

  // Normaliza role
  const roleInput = payload.role ? String(payload.role).toUpperCase() : "CANDIDATE";
  const role = roleInput === "COMPANY" ? "COMPANY" : roleInput === "ADMIN" ? "ADMIN" : "CANDIDATE";

  let user: any;
  let userType: string;
  let entityId: number;

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
  } else if (role === "ADMIN") {
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
  } else {
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
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role, userType },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  // Retorna com IDs específicos
  const responseUser: any = { ...user };
  if (userType === "empresa") {
    responseUser.empresaId = entityId;
  } else if (userType === "candidato") {
    responseUser.candidatoId = entityId;
  }

  return { user: responseUser, token };
};

export const login = async (email: string, password: string) => {
  const user = await authRepo.findUserByEmail(email);
  if (!user) throw new Error("Credenciais inválidas");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Credenciais inválidas");

  if (!user.isActive) throw new Error("Usuário inativo");

  const token = jwt.sign(
    { userId: user.id, role: user.role, userType: user.userType },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  // Remove password do retorno
  const userResponse: any = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
  };

  // Adiciona ID específico
  if (user.userType === "empresa") {
    userResponse.empresaId = user.id;
  } else if (user.userType === "candidato") {
    userResponse.candidatoId = user.id;
  }

  return { user: userResponse, token };
};
