import { prisma } from './prisma'

export const upsertByUserId = async (userId: number, profileData: any) => {
  // tenta encontrar candidato existente
  const existing = await prisma.candidato.findFirst({ where: { userId } })
  if (existing) {
    return prisma.candidato.update({
      where: { id: existing.id },
      data: {
        nome: profileData.name || existing.nome,
        cpf: profileData.cpf || existing.cpf,
        email: profileData.email || existing.email,
        telefone: profileData.telefone || existing.telefone,
        escolaridade: profileData.educationLevel || existing.escolaridade,
      },
      include: {
        subtipos: {
          include: {
            subtipo: {
              include: {
                tipo: true,
              },
            },
            barreiras: {
              include: {
                barreira: true,
              },
            },
          },
        },
      },
    })
  }
  return prisma.candidato.create({
    data: {
      nome: profileData.name || 'Sem nome',
      cpf: profileData.cpf,
      email: profileData.email,
      telefone: profileData.telefone,
      escolaridade: profileData.educationLevel || 'Não informado',
      user: { connect: { id: userId } },
    },
    include: {
      subtipos: {
        include: {
          subtipo: {
            include: {
              tipo: true,
            },
          },
          barreiras: {
            include: {
              barreira: true,
            },
          },
        },
      },
    },
  })
}

export const findByUserId = async (userId: number) => {
  return prisma.candidato.findUnique({
    where: { userId },
    include: {
      subtipos: {
        include: {
          subtipo: {
            include: {
              tipo: true,
            },
          },
          barreiras: {
            include: {
              barreira: true,
            },
          },
        },
      },
    },
  })
}
