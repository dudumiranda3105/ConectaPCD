import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'curriculo-' + unique + ext);
  },
});

export const resumeUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Formato inválido. Envie PDF ou DOC/DOCX.'));
    }
    cb(null, true);
  },
});

// Storage específico para laudos médicos (apenas PDF)
const laudoStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'laudo-' + unique + ext);
  },
});

export const laudoUpload = multer({
  storage: laudoStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB para laudos
  fileFilter: (_req, file, cb) => {
    // Apenas PDF para laudos médicos
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('O laudo médico deve ser um arquivo PDF.'));
    }
    cb(null, true);
  },
});
