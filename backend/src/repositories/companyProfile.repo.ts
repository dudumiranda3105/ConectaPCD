import { prisma } from './prisma'

export const upsertByUserId = async (userId: number, companyData: any) => {
  const existing = await prisma.empresa.findUnique({ where: { userId } })
  if (existing) {
    return prisma.empresa.update({ where: { id: existing.id }, data: { companyData, nome: companyData.razaoSocial || existing.nome, cnpj: companyData.cnpj || existing.cnpj, email: companyData.emailCorporativo || existing.email } })
  }
  return prisma.empresa.create({ data: { userId, nome: companyData.razaoSocial || companyData.nomeFantasia || 'Empresa', cnpj: companyData.cnpj, email: companyData.emailCorporativo, companyData } })
}

export const findByUserId = async (userId: number) => {
  return prisma.empresa.findUnique({ where: { userId } })
}
