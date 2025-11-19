import { api } from './api';

export interface Barreira {
  id: number;
  descricao: string;
  createdAt?: string;
  updatedAt?: string;
}

export const barreirasService = {
  // Listar todas as barreiras
  async list(): Promise<Barreira[]> {
    const response = await api.get('barreiras');
    return (response as Barreira[]) || [];
  },

  // Criar barreira
  async create(descricao: string): Promise<Barreira> {
    const response = await api.post('barreiras', { descricao });
    return response as Barreira;
  },
};

// Manter funções antigas para compatibilidade
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function getBarreiras(): Promise<Barreira[]> {
  const res = await fetch(`${API_URL}/barreiras`);
  if (!res.ok) throw new Error('Erro ao buscar barreiras');
  return res.json();
}

export async function createBarreira(descricao: string): Promise<Barreira> {
  const token = localStorage.getItem('auth_token')
  const res = await fetch(`${API_URL}/barreiras`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ descricao }),
  });
  if (!res.ok) throw new Error('Erro ao criar barreira');
  return res.json();
}
