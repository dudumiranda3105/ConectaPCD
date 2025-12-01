import { AcessRepo } from "../repositories/acessibilidades.repo";

export const AcessService = {
  list() {
    return AcessRepo.list();
  },
  async create(nome: string | undefined, descricao: string) {
    const finalDescricao = (descricao ?? "").trim();
    if (!finalDescricao) throw Object.assign(new Error("O campo 'descricao' é obrigatório"), { status: 400 });
    const finalNome = nome?.trim() || undefined;
    return AcessRepo.create(finalNome, finalDescricao);
  },
  async findByDescricao(descricao: string) {
    return AcessRepo.findByDescricao(descricao);
  },
  listBarreiras(acessibilidadeId: number) {
    return AcessRepo.listBarreiras(acessibilidadeId);
  },
  connect(acessibilidadeId: number, barreiraId: number) {
    return AcessRepo.addBarreira(acessibilidadeId, barreiraId);
  },
  disconnect(acessibilidadeId: number, barreiraId: number) {
    return AcessRepo.removeBarreira(acessibilidadeId, barreiraId);
  },
  async delete(id: number) {
    const existing = await AcessRepo.findById(id);
    if (!existing) throw Object.assign(new Error('Acessibilidade não encontrada'), { status: 404 });
    return AcessRepo.delete(id);
  },
};