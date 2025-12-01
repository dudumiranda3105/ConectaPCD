"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpresasRepo = void 0;
const prisma_1 = require("./prisma");
exports.EmpresasRepo = {
    list() {
        return prisma_1.prisma.empresa.findMany({
            orderBy: { id: "asc" },
            select: { id: true, nome: true, cnpj: true, email: true },
        });
    },
    findById(id) {
        return prisma_1.prisma.empresa.findUnique({
            where: { id },
            include: {
                vagas: {
                    orderBy: { id: "asc" },
                    select: { id: true, descricao: true, escolaridade: true },
                },
            },
        });
    },
    findByCnpj(cnpj) {
        return prisma_1.prisma.empresa.findUnique({ where: { cnpj } });
    },
    create(nome, cnpj, email) {
        return prisma_1.prisma.empresa.create({ data: { nome, cnpj, email } });
    },
};
//# sourceMappingURL=empresas.repo.js.map