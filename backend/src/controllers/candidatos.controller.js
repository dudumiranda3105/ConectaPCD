"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidatosController = void 0;
const candidatos_service_1 = require("../services/candidatos.service");
const prisma_1 = require("../repositories/prisma");
exports.CandidatosController = {
    async listar(req, res) {
        const data = await candidatos_service_1.CandidatosService.listar();
        res.json(data);
    },
    async buscarPorId(req, res) {
        const id = Number(req.params.id);
        const data = await candidatos_service_1.CandidatosService.buscarPorId(id);
        res.json(data);
    },
    async criar(req, res) {
        const data = await candidatos_service_1.CandidatosService.criar(req.body);
        res.status(201).json(data);
    },
    async listarCandidaturasAprovadas(req, res) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id))
                return res.status(400).json({ error: 'ID inválido' });
            const candidaturas = await prisma_1.prisma.candidatura.findMany({
                where: {
                    candidatoId: id,
                    status: 'APROVADA'
                },
                include: {
                    vaga: {
                        include: {
                            empresa: {
                                select: {
                                    id: true,
                                    nome: true,
                                    companyData: true
                                }
                            }
                        }
                    }
                },
                orderBy: { updatedAt: 'desc' }
            });
            res.json(candidaturas);
        }
        catch (e) {
            res.status(500).json({ error: e.message ?? 'Erro ao buscar candidaturas aprovadas' });
        }
    }
};
//# sourceMappingURL=candidatos.controller.js.map