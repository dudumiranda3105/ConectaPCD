import { prisma } from './prisma'

export const upsertByUserId = async (userId: number, companyData: any) => {
  // userId aqui representa o id da tabela Empresa (conforme JWT userId para company)
  // Atualiza o registro existente; não cria uma nova empresa pois já deve existir após o registro
  
  const dataToUpdate: any = {}

  // Dados básicos da empresa
  if (companyData.razaoSocial !== undefined) dataToUpdate.razaoSocial = companyData.razaoSocial
  if (companyData.nomeFantasia !== undefined) dataToUpdate.nomeFantasia = companyData.nomeFantasia
  if (companyData.cnpj !== undefined) dataToUpdate.cnpj = companyData.cnpj
  if (companyData.emailCorporativo !== undefined) dataToUpdate.email = companyData.emailCorporativo
  if (companyData.telefone !== undefined) dataToUpdate.telefone = companyData.telefone
  if (companyData.siteEmpresa !== undefined) dataToUpdate.site = companyData.siteEmpresa
  if (companyData.porte !== undefined) dataToUpdate.porte = companyData.porte
  if (companyData.setorAtividade !== undefined) dataToUpdate.setor = companyData.setorAtividade
  if (companyData.descricao !== undefined) dataToUpdate.descricao = companyData.descricao

  // Dados do responsável
  if (companyData.nomeCompletoResponsavel !== undefined) dataToUpdate.responsavelNome = companyData.nomeCompletoResponsavel
  if (companyData.cargoResponsavel !== undefined) dataToUpdate.responsavelCargo = companyData.cargoResponsavel
  if (companyData.emailResponsavel !== undefined) dataToUpdate.responsavelEmail = companyData.emailResponsavel
  if (companyData.telefoneResponsavel !== undefined) dataToUpdate.responsavelTelefone = companyData.telefoneResponsavel

  // Endereço completo
  if (companyData.cep !== undefined) dataToUpdate.cep = companyData.cep
  if (companyData.logradouro !== undefined) dataToUpdate.logradouro = companyData.logradouro
  if (companyData.numero !== undefined) dataToUpdate.numero = companyData.numero
  if (companyData.complemento !== undefined) dataToUpdate.complemento = companyData.complemento
  if (companyData.bairro !== undefined) dataToUpdate.bairro = companyData.bairro
  if (companyData.cidade !== undefined) dataToUpdate.cidade = companyData.cidade
  if (companyData.estado !== undefined) dataToUpdate.estado = companyData.estado

  // Endereço concatenado (manter para compatibilidade)
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

  // Políticas de inclusão
  if (companyData.politicasInclusao !== undefined) dataToUpdate.politicasInclusao = companyData.politicasInclusao
  if (companyData.possuiSistemaInterno !== undefined) dataToUpdate.possuiSistemaInterno = companyData.possuiSistemaInterno

  // Acessibilidades e barreiras (salvar como JSON se o schema suportar)
  if (companyData.acessibilidadesOferecidas !== undefined) {
    dataToUpdate.acessibilidadesOferecidas = JSON.stringify(companyData.acessibilidadesOferecidas)
  }
  if (companyData.outrosRecursosAcessibilidade !== undefined) {
    dataToUpdate.outrosRecursosAcessibilidade = companyData.outrosRecursosAcessibilidade
  }
  if (companyData.barreiras !== undefined) {
    dataToUpdate.barreiras = JSON.stringify(companyData.barreiras)
  }
  if (companyData.outrasBarreiras !== undefined) {
    dataToUpdate.outrasBarreiras = companyData.outrasBarreiras
  }

  return prisma.empresa.update({ where: { id: userId }, data: dataToUpdate })
}

export const findByUserId = async (userId: number) => {
  return prisma.empresa.findUnique({ where: { id: userId } })
}
