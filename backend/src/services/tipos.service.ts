import { TiposRepo } from "../repositories/tipos.repo";

export const TiposService = {
  list() {
    return TiposRepo.list();
  },
  listWithSubtipos() {
    return TiposRepo.listWithSubtipos();
  },
  async create(nome: string, descricao?: string, cor?: string) {
    const final = (nome ?? "").trim();
    if (!final) throw Object.assign(new Error("O campo 'nome' é obrigatório"), { status: 400 });
    return TiposRepo.create(final, descricao, cor);
  },
  async update(id: number, nome: string, descricao?: string, cor?: string) {
    const final = (nome ?? "").trim();
    if (!final) throw Object.assign(new Error("O campo 'nome' é obrigatório"), { status: 400 });
    return TiposRepo.update(id, final, descricao, cor);
  },
  async delete(id: number) {
    const tipo = await TiposRepo.findById(id);
    if (!tipo) throw Object.assign(new Error("Tipo não encontrado"), { status: 404 });
    return TiposRepo.delete(id);
  },
};