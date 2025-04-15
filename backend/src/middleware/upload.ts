import multer from 'multer';
import path from 'path';
import { mkdir } from 'fs/promises';

const UPLOADS_DIR = path.join(__dirname, '../../uploads');

// Initialize uploads directory
const initializeUploadsDir = async () => {
  await mkdir(UPLOADS_DIR, { recursive: true });
};

// Call the initialization function
initializeUploadsDir().catch(console.error);

// Configure multer memory storage
const storage = multer.memoryStorage();

// Create multer instance
const upload = multer({ 
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only video files
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'));
    }
  }
});

// Export the middleware
export const uploadMiddleware = upload.single('video'); 