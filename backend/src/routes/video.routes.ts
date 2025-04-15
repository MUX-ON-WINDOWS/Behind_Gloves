import { Router } from 'express';
import { uploadVideo, getAnalysisResults } from '../controllers/video.controller';
import { uploadMiddleware } from '../middleware/upload';

const videoRoutes = Router();

// Upload video and start analysis
videoRoutes.post('/upload', uploadMiddleware, uploadVideo);

// Get analysis results
videoRoutes.get('/results/:videoId', getAnalysisResults);

export default videoRoutes; 