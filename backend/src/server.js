import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import auctionRoutes from './routes/auctions.js';
import bidRoutes from './routes/bids.js';
import messageRoutes from './routes/messages.js';
import paymentRoutes from './routes/payments.js';
import notificationRoutes from './routes/notifications.js';
import cacheRoutes from './routes/cache.js';

// Import middleware
import { authenticateToken } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';

// Import socket handlers
import { setupSocketHandlers } from './socket/socketHandlers.js';

// Import cache
import { cache, warmCache } from './utils/cache.js';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Make prisma and io available to routes
app.use((req, res, next) => {
  req.prisma = prisma;
  req.io = io;
  next();
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', authenticateToken, userRoutes);
app.use('/api/v1/auctions', auctionRoutes);
app.use('/api/v1/bids', authenticateToken, bidRoutes);
app.use('/api/v1/messages', authenticateToken, messageRoutes);
app.use('/api/v1/payments', authenticateToken, paymentRoutes);
app.use('/api/v1/notifications', authenticateToken, notificationRoutes);
app.use('/api/v1/cache', cacheRoutes);

// Health check
app.get('/api/v1/health', (req, res) => {
  const cacheStats = cache.getStats();
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    cache: cacheStats
  });
});

// Setup Socket.IO
setupSocketHandlers(io, prisma);

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize cache and warm it up
const initializeServer = async () => {
  try {
    logger.info('Initializing server...');
    
    // Warm up cache with popular data
    if (cache.cacheEnabled) {
      logger.info('Warming up cache...');
      await warmCache.all();
    }
    
    logger.info('Server initialization complete');
  } catch (error) {
    logger.error('Server initialization error:', error);
  }
};

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received, shutting down gracefully`);
  
  try {
    // Close server
    server.close(() => {
      logger.info('HTTP server closed');
    });
    
    // Disconnect from database
    await prisma.$disconnect();
    logger.info('Database disconnected');
    
    // Close cache connections
    if (cache.redis) {
      await cache.redis.quit();
      logger.info('Redis connection closed');
    }
    
    logger.info('Graceful shutdown complete');
    process.exit(0);
  } catch (error) {
    logger.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
server.listen(PORT, async () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV}`);
  logger.info(`Cache enabled: ${cache.cacheEnabled}`);
  
  await initializeServer();
});

export default app;