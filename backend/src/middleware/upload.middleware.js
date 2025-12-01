"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.laudoUpload = exports.resumeUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uploadDir = path_1.default.resolve(process.cwd(), 'uploads');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path_1.default.extname(file.originalname);
        cb(null, 'curriculo-' + unique + ext);
    },
});
exports.resumeUpload = (0, multer_1.default)({
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
const laudoStorage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path_1.default.extname(file.originalname);
        cb(null, 'laudo-' + unique + ext);
    },
});
exports.laudoUpload = (0, multer_1.default)({
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
//# sourceMappingURL=upload.middleware.js.map