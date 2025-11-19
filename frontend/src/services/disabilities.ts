const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export interface DisabilityType {
  id: number
  nome: string
}

export interface DisabilitySubtype {
  id: number
  tipoId: number
  tipo_id: number // backend compatibility
  nome: string
}

export interface Barrier {
  id: number
  descricao: string
}

export const getDisabilityTypes = async (): Promise<DisabilityType[]> => {
  const res = await fetch(`${API_URL}/tipos`)
  if (!res.ok) throw new Error('Erro ao buscar tipos de deficiência')
  return res.json()
}

export const getSubtypes = async (): Promise<DisabilitySubtype[]> => {
  const res = await fetch(`${API_URL}/subtipos`)
  if (!res.ok) throw new Error('Erro ao buscar subtipos')
  return res.json()
}

export const getSubtypesForType = async (
  typeId: number,
): Promise<DisabilitySubtype[]> => {
  const allSubtypes = await getSubtypes()
  return allSubtypes.filter((subtype) => subtype.tipoId === typeId)
}

export const getBarriers = async (): Promise<Barrier[]> => {
  const res = await fetch(`${API_URL}/barreiras`)
  if (!res.ok) throw new Error('Erro ao buscar barreiras')
  return res.json()
}

export const createDisabilityType = async (
  name: string,
  description: string,
): Promise<DisabilityType> => {
  const token = localStorage.getItem('auth_token')
  const res = await fetch(`${API_URL}/tipos`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ nome: name }),
  })
  if (!res.ok) throw new Error('Erro ao criar tipo de deficiência')
  return res.json()
}

export const updateDisabilityType = async (
  id: number,
  name: string,
  description: string,
): Promise<DisabilityType | null> => {
  const token = localStorage.getItem('auth_token')
  const res = await fetch(`${API_URL}/tipos/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ nome: name }),
  })
  if (!res.ok) throw new Error('Erro ao atualizar tipo de deficiência')
  return res.json()
}

export const deleteDisabilityType = async (id: number): Promise<void> => {
  const token = localStorage.getItem('auth_token')
  const res = await fetch(`${API_URL}/tipos/${id}`, {
    method: 'DELETE',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  })
  if (!res.ok) throw new Error('Erro ao deletar tipo de deficiência')
}

export const createDisabilitySubtype = async (
  name: string,
  typeId: number,
): Promise<DisabilitySubtype> => {
  const token = localStorage.getItem('auth_token')
  const res = await fetch(`${API_URL}/subtipos`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ nome: name, tipoId: typeId }),
  })
  if (!res.ok) throw new Error('Erro ao criar subtipo')
  return res.json()
}

export const updateDisabilitySubtype = async (
  id: number,
  name: string,
  typeId: number,
): Promise<DisabilitySubtype | null> => {
  const token = localStorage.getItem('auth_token')
  const res = await fetch(`${API_URL}/subtipos/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ nome: name, tipoId: typeId }),
  })
  if (!res.ok) throw new Error('Erro ao atualizar subtipo')
  return res.json()
}

export const deleteDisabilitySubtype = async (id: number): Promise<void> => {
  const token = localStorage.getItem('auth_token')
  const res = await fetch(`${API_URL}/subtipos/${id}`, {
    method: 'DELETE',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  })
  if (!res.ok) throw new Error('Erro ao deletar subtipo')
}

export const createBarrier = async (description: string): Promise<Barrier> => {
  const token = localStorage.getItem('auth_token')
  const res = await fetch(`${API_URL}/barreiras`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ descricao: description }),
  })
  if (!res.ok) throw new Error('Erro ao criar barreira')
  return res.json()
}

export const updateBarrier = async (
  id: number,
  description: string,
): Promise<Barrier | null> => {
  const token = localStorage.getItem('auth_token')
  const res = await fetch(`${API_URL}/barreiras/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ descricao: description }),
  })
  if (!res.ok) throw new Error('Erro ao atualizar barreira')
  return res.json()
}

export const deleteBarrier = async (id: number): Promise<void> => {
  const token = localStorage.getItem('auth_token')
  const res = await fetch(`${API_URL}/barreiras/${id}`, {
    method: 'DELETE',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  })
  if (!res.ok) throw new Error('Erro ao deletar barreira')
}
