import { CandidatosRepo } from "../repositories/candidatos.repo";

export const CandidatosService = {
  async listar() {
    return CandidatosRepo.findAll();
  },

  async buscarPorId(id: number) {
    const candidato = await CandidatosRepo.findById(id);
    if (!candidato) throw new Error("Candidato não encontrado");
    return candidato;
  },

  async criar(data: { nome: string; email?: string; telefone?: string, escolaridade: string }) {
    if (!data.nome?.trim()) throw new Error("O campo 'nome' é obrigatório");
    return CandidatosRepo.create({
      nome: data.nome.trim(),
      email: data.email?.trim(),
      telefone: data.telefone?.trim(),
      escolaridade: data.escolaridade.trim()
    });
  },
};