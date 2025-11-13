import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.middleware'
import candidateController from '../controllers/candidateProfile.controller'
import companyController from '../controllers/companyProfile.controller'

const router = Router()

// rotas protegidas: /profiles/candidate, /profiles/company
router.use('/candidate', authMiddleware, candidateController)
router.use('/company', authMiddleware, companyController)

export default router
