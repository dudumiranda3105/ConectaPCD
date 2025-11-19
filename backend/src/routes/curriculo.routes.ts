import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { CurriculoController } from '../controllers/curriculo.controller';
import { resumeUpload } from '../middleware/upload.middleware';

const router = Router();

router.post('/upload', authMiddleware, resumeUpload.single('file'), CurriculoController.upload);
router.get('/:candidatoId', authMiddleware, CurriculoController.get);
router.delete('/', authMiddleware, CurriculoController.delete);

export default router;
