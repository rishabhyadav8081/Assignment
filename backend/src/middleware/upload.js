import multer from 'multer';

const storage = multer.memoryStorage();
const fileFilter = (_, file, cb) => cb(null, file.mimetype.startsWith('image/'));
export default multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

