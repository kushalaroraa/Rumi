import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '';
    cb(null, `room-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const isImage = /^image\/(jpeg|jpg|png|gif|webp)$/i.test(file.mimetype);
  const isVideo = /^video\//i.test(file.mimetype);
  const ok = isImage || isVideo;
  cb(null, ok);
};

export const uploadRoomMedia = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB per file
    files: 11,
  },
  fileFilter,
}).fields([
  { name: 'photos', maxCount: 10 },
  { name: 'video', maxCount: 1 },
]);

