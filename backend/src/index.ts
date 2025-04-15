import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { config } from 'dotenv';
import videoRoutes from './routes/video.routes';
import { errorHandler } from './middleware/errorHandler';

// Load environment variables
config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/videos', videoRoutes);

// Error handling
app.use(errorHandler);

const server = createServer(app);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 