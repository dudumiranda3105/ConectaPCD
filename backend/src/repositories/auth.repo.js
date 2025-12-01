"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAdminById = exports.findEmpresaById = exports.findCandidatoById = exports.createAdmin = exports.createEmpresa = exports.createCandidato = exports.findUserByEmail = void 0;
const prisma_1 = require("./prisma");
// Busca usuário por email em todas as três tabelas
const findUserByEmail = async (email) => {
    if (!email)
        return null;
    // Busca em paralelo nas três tabelas
    const [candidato, empresa, admin] = await Promise.all([
        prisma_1.prisma.candidato.findUnique({ where: { email } }),
        prisma_1.prisma.empresa.findUnique({ where: { email } }),
        prisma_1.prisma.admin.findUnique({ where: { email } }),
    ]);
    if (candidato && candidato.email && candidato.password) {
        return {
            id: candidato.id,
            name: candidato.nome,
            email: candidato.email,
            password: candidato.password,
            role: "CANDIDATE",
            userType: "candidato",
            isActive: candidato.isActive,
        };
    }
    if (empresa && empresa.email && empresa.password) {
        return {
            id: empresa.id,
            name: empresa.nome,
            email: empresa.email,
            password: empresa.password,
            role: "COMPANY",
            userType: "empresa",
            isActive: empresa.isActive,
        };
    }
    if (admin) {
        return {
            id: admin.id,
            name: admin.nome,
            email: admin.email,
            password: admin.password,
            role: "ADMIN",
            userType: "admin",
            isActive: admin.isActive,
        };
    }
    return null;
};
exports.findUserByEmail = findUserByEmail;
// Cria candidato
const createCandidato = async (data) => {
    return prisma_1.prisma.candidato.create({
        data: {
            nome: data.name,
            email: data.email,
            password: data.password,
            escolaridade: "",
        },
    });
};
exports.createCandidato = createCandidato;
// Cria empresa
const createEmpresa = async (data) => {
    return prisma_1.prisma.empresa.create({
        data: {
            nome: data.name,
            email: data.email,
            password: data.password,
        },
    });
};
exports.createEmpresa = createEmpresa;
// Cria admin
const createAdmin = async (data) => {
    return prisma_1.prisma.admin.create({
        data: {
            nome: data.name,
            email: data.email,
            password: data.password,
        },
    });
};
exports.createAdmin = createAdmin;
// Busca candidato por ID
const findCandidatoById = async (id) => {
    return prisma_1.prisma.candidato.findUnique({ where: { id } });
};
exports.findCandidatoById = findCandidatoById;
// Busca empresa por ID
const findEmpresaById = async (id) => {
    return prisma_1.prisma.empresa.findUnique({ where: { id } });
};
exports.findEmpresaById = findEmpresaById;
// Busca admin por ID
const findAdminById = async (id) => {
    return prisma_1.prisma.admin.findUnique({ where: { id } });
};
exports.findAdminById = findAdminById;
//# sourceMappingURL=auth.repo.js.map