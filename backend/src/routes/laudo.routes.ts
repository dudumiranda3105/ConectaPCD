import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { LaudoController } from '../controllers/laudo.controller';
import { laudoUpload } from '../middleware/upload.middleware';

const router = Router();

// Upload de laudo médico (apenas PDF)
router.post('/upload', authMiddleware, laudoUpload.single('file'), LaudoController.upload);

// Validar laudo antes de enviar (verifica se PDF é válido)
router.post('/validate', authMiddleware, laudoUpload.single('file'), LaudoController.validate);

// Obter laudo de um candidato
router.get('/:candidatoId', authMiddleware, LaudoController.get);

// Remover laudo
router.delete('/', authMiddleware, LaudoController.delete);

export default router;
