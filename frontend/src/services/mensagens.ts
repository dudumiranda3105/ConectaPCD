const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface Mensagem {
  id: number;
  conversaId: number;
  remetenteId: number;
  tipoRemetente: 'CANDIDATO' | 'EMPRESA';
  conteudo: string;
  lida: boolean;
  createdAt: string;
}

export interface Conversa {
  id: number;
  candidaturaId: number;
  createdAt: string;
  updatedAt: string;
  candidatura: {
    id: number;
    status: string;
    candidato: {
      id: number;
      nome: string;
      avatarUrl?: string;
      email?: string;
    };
    vaga: {
      id: number;
      titulo: string;
      empresa: {
        id: number;
        nome: string;
        email?: string;
      };
    };
  };
  mensagens: Mensagem[];
  naoLidas?: number;
}

// Obter ou criar conversa para uma candidatura
export async function getOrCreateConversa(token: string, candidaturaId: number): Promise<Conversa> {
  const res = await fetch(`${API_URL}/mensagens/candidatura/${candidaturaId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Erro ao obter conversa');
  return res.json();
}

// Buscar conversa por ID
export async function getConversaById(token: string, conversaId: number): Promise<Conversa> {
  const res = await fetch(`${API_URL}/mensagens/conversa/${conversaId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Erro ao buscar conversa');
  return res.json();
}

// Listar conversas de um candidato
export async function listarConversasCandidato(token: string, candidatoId: number): Promise<Conversa[]> {
  const res = await fetch(`${API_URL}/mensagens/candidato/${candidatoId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Erro ao listar conversas');
  return res.json();
}

// Listar conversas de uma empresa
export async function listarConversasEmpresa(token: string, empresaId: number): Promise<Conversa[]> {
  const res = await fetch(`${API_URL}/mensagens/empresa/${empresaId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Erro ao listar conversas');
  return res.json();
}

// Buscar mensagens de uma conversa
export async function getMensagens(token: string, conversaId: number): Promise<Mensagem[]> {
  const res = await fetch(`${API_URL}/mensagens/conversa/${conversaId}/mensagens`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Erro ao buscar mensagens');
  return res.json();
}

// Enviar mensagem
export async function enviarMensagem(
  token: string, 
  conversaId: number, 
  remetenteId: number, 
  tipoRemetente: 'CANDIDATO' | 'EMPRESA', 
  conteudo: string
): Promise<Mensagem> {
  const res = await fetch(`${API_URL}/mensagens/conversa/${conversaId}/mensagens`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ remetenteId, tipoRemetente, conteudo }),
  });
  if (!res.ok) throw new Error('Erro ao enviar mensagem');
  return res.json();
}

// Marcar mensagens como lidas
export async function marcarComoLidas(
  token: string, 
  conversaId: number, 
  tipoLeitor: 'CANDIDATO' | 'EMPRESA'
): Promise<void> {
  const res = await fetch(`${API_URL}/mensagens/conversa/${conversaId}/lidas`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ tipoLeitor }),
  });
  if (!res.ok) throw new Error('Erro ao marcar como lidas');
}

// Contar mensagens não lidas
export async function contarNaoLidas(
  token: string, 
  userId: number, 
  tipoUsuario: 'CANDIDATO' | 'EMPRESA'
): Promise<number> {
  const res = await fetch(`${API_URL}/mensagens/nao-lidas?userId=${userId}&tipoUsuario=${tipoUsuario}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Erro ao contar mensagens não lidas');
  const data = await res.json();
  return data.total;
}
