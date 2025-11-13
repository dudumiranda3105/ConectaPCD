import * as repo from '../repositories/companyProfile.repo'

export const saveCompanyProfile = async (userId: number, companyData: any) => {
  return repo.upsertByUserId(userId, companyData)
}

export const getCompanyProfile = async (userId: number) => {
  return repo.findByUserId(userId)
}
