import {
  DisabilityType,
  DisabilitySubtype,
  Barrier,
} from '@/services/disabilities'

const initialDisabilityTypes: DisabilityType[] = [
  {
    id: 1,
    nome: 'Visual',
    description:
      'Abrange desde a baixa visão até a cegueira total, impactando a percepção de informações visuais.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    nome: 'Auditiva',
    description:
      'Refere-se à perda parcial ou total da audição, dificultando a comunicação oral.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    nome: 'Física/Motora',
    description:
      'Envolve a alteração completa ou parcial de um ou mais segmentos do corpo, afetando a mobilidade.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    nome: 'Intelectual/Cognitiva',
    description:
      'Caracteriza-se por limitações no funcionamento intelectual e no comportamento adaptativo.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 5,
    nome: 'Mental/Psicossocial',
    description:
      'Relacionada a transtornos mentais que podem afetar a interação social e o comportamento.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 6,
    nome: 'Múltipla',
    description: 'Associação de duas ou mais deficiências.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const initialSubtypes: DisabilitySubtype[] = [
  {
    id: 1,
    tipo_id: 1,
    nome: 'Cegueira',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    tipo_id: 1,
    nome: 'Baixa Visão',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    tipo_id: 1,
    nome: 'Visão Monocular',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    tipo_id: 2,
    nome: 'Surdez Total (Profunda)',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 5,
    tipo_id: 2,
    nome: 'Surdez Parcial (Severa/Moderada)',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 6,
    tipo_id: 3,
    nome: 'Paraplegia',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 7,
    tipo_id: 3,
    nome: 'Tetraplegia',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 8,
    tipo_id: 3,
    nome: 'Amputação ou ausência de membro',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 9,
    tipo_id: 3,
    nome: 'Paralisia Cerebral',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 10,
    tipo_id: 4,
    nome: 'Síndrome de Down',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 11,
    tipo_id: 4,
    nome: 'Atraso Cognitivo',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 12,
    tipo_id: 5,
    nome: 'Transtorno do Espectro Autista (TEA)',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 13,
    tipo_id: 5,
    nome: 'Esquizofrenia',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 14,
    tipo_id: 5,
    nome: 'Transtorno Bipolar',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 15,
    tipo_id: 6,
    nome: 'Surdocegueira',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const initialBarriers: Barrier[] = [
  {
    id: 1,
    descricao: 'Arquitetônica (Ex: Falta de rampas, elevadores)',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    descricao: 'Comunicacional (Ex: Falta de Libras, Braille)',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    descricao: 'Atitudinal (Ex: Preconceito, estereótipos)',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    descricao: 'Tecnológica (Ex: Softwares inacessíveis)',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 5,
    descricao: 'Transporte (Ex: Falta de transporte público adaptado)',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 6,
    descricao: 'Instrumental (Ex: Ferramentas de trabalho inadequadas)',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

let types: DisabilityType[] = [...initialDisabilityTypes]
let subtypes: DisabilitySubtype[] = [...initialSubtypes]
const barriers: Barrier[] = [...initialBarriers]

export const getTypes = () => types
export const getSubtypes = () => subtypes
export const getBarriersStore = () => barriers

export const addType = (name: string, description: string) => {
  const newType: DisabilityType = {
    id: Math.max(0, ...types.map((t) => t.id)) + 1,
    nome: name,
    description: description,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  types.push(newType)
  return newType
}

export const updateType = (id: number, name: string, description: string) => {
  const typeIndex = types.findIndex((t) => t.id === id)
  if (typeIndex > -1) {
    types[typeIndex] = {
      ...types[typeIndex],
      nome: name,
      description: description,
      updated_at: new Date().toISOString(),
    }
    return types[typeIndex]
  }
  return null
}

export const deleteType = (id: number) => {
  if (subtypes.some((s) => s.tipo_id === id)) {
    throw new Error(
      'Não é possível excluir o tipo, pois existem subtipos associados.',
    )
  }
  types = types.filter((t) => t.id !== id)
}

export const addSubtype = (name: string, typeId: number) => {
  const newSubtype: DisabilitySubtype = {
    id: Math.max(0, ...subtypes.map((s) => s.id)) + 1,
    nome: name,
    tipo_id: typeId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  subtypes.push(newSubtype)
  return newSubtype
}

export const updateSubtype = (id: number, name: string, typeId: number) => {
  const subtypeIndex = subtypes.findIndex((s) => s.id === id)
  if (subtypeIndex > -1) {
    subtypes[subtypeIndex] = {
      ...subtypes[subtypeIndex],
      nome: name,
      tipo_id: typeId,
      updated_at: new Date().toISOString(),
    }
    return subtypes[subtypeIndex]
  }
  return null
}

export const deleteSubtype = (id: number) => {
  subtypes = subtypes.filter((s) => s.id !== id)
}
