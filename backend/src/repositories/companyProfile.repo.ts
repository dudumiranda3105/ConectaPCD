import { prisma } from './prisma'

export const upsertByUserId = async (userId: number, companyData: any) => {
  // userId aqui representa o id da tabela Empresa (conforme JWT userId para company)
  // Atualiza o registro existente; não cria uma nova empresa pois já deve existir após o registro
  // Campos opcionais só são enviados se existirem no payload
  const dataToUpdate: any = {
    companyData,
  }

  if (companyData.razaoSocial) dataToUpdate.razaoSocial = companyData.razaoSocial
  if (companyData.nomeFantasia) dataToUpdate.nomeFantasia = companyData.nomeFantasia
  if (companyData.cnpj) dataToUpdate.cnpj = companyData.cnpj
  if (companyData.emailCorporativo) dataToUpdate.email = companyData.emailCorporativo
  if (companyData.telefone) dataToUpdate.telefone = companyData.telefone
  if (companyData.siteEmpresa) dataToUpdate.site = companyData.siteEmpresa
  if (companyData.porte) dataToUpdate.porte = companyData.porte
  if (companyData.setorAtividade) dataToUpdate.setor = companyData.setorAtividade
  if (companyData.descricao) dataToUpdate.descricao = companyData.descricao

  // Endereço simples concatenado se houver dados de endereço no passo 2
  const enderecoPartes = [
    companyData.logradouro,
    companyData.numero,
    companyData.complemento,
    companyData.bairro,
    companyData.cidade,
    companyData.estado,
    companyData.cep,
  ].filter(Boolean)
  if (enderecoPartes.length) dataToUpdate.endereco = enderecoPartes.join(', ')

  return prisma.empresa.update({ where: { id: userId }, data: dataToUpdate })
}

export const findByUserId = async (userId: number) => {
  return prisma.empresa.findUnique({ where: { id: userId } })
}
