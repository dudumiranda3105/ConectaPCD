import { Router } from 'express'
import { avatarUpload } from '../middleware/avatarUpload.middleware'
import { authMiddleware, candidateOnly } from '../middleware/auth.middleware'
import { AvatarController } from '../controllers/avatar.controller'

const router = Router()

router.post('/upload', authMiddleware, candidateOnly, avatarUpload.single('file'), AvatarController.upload)
router.get('/:candidatoId', AvatarController.get)
router.delete('/', authMiddleware, candidateOnly, AvatarController.delete)

export default router
