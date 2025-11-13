import * as repo from '../repositories/candidateProfile.repo'

export const saveCandidateProfile = async (userId: number, profileData: any) => {
  return repo.upsertByUserId(userId, profileData)
}

export const getCandidateProfile = async (userId: number) => {
  return repo.findByUserId(userId)
}
