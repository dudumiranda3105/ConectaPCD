import { api } from './api';

export interface Acessibilidade {
  id: number;
  descricao: string;
  barreiras?: Barreira[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Barreira {
  id: number;
  descricao: string;
  barreiraId?: number;
  acessibilidadeId?: number;
}

export const acessibilidadesService = {
  // Listar todas as acessibilidades
  async list(): Promise<Acessibilidade[]> {
    const response = await api.get('acessibilidades');
    return (response as Acessibilidade[]) || [];
  },

  // Criar nova acessibilidade
  async create(descricao: string): Promise<Acessibilidade> {
    const response = await api.post('acessibilidades', { descricao });
    return response as Acessibilidade;
  },

  // Listar barreiras de uma acessibilidade
  async listBarreiras(acessibilidadeId: number): Promise<Barreira[]> {
    const response = await api.get(`acessibilidades/${acessibilidadeId}/barreiras`);
    return (response as Barreira[]) || [];
  },

  // Conectar barreira a acessibilidade
  async connectBarreira(acessibilidadeId: number, barreiraId: number): Promise<void> {
    await api.post(`acessibilidades/${acessibilidadeId}/barreiras`, { barreiraId });
  },

  // Desconectar barreira de acessibilidade
  async disconnectBarreira(acessibilidadeId: number, barreiraId: number): Promise<void> {
    await api.delete(`acessibilidades/${acessibilidadeId}/barreiras/${barreiraId}`);
  },
};
