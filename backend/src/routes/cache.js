import express from 'express';
import { cache, warmCache } from '../utils/cache.js';
import { authenticateToken } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Get cache statistics (admin only)
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // In a real app, you'd check for admin role here
    const stats = cache.getStats();
    res.json(stats);
  } catch (error) {
    logger.error('Get cache stats error:', error);
    res.status(500).json({ error: 'Failed to get cache statistics' });
  }
});

// Clear all cache (admin only)
router.delete('/flush', authenticateToken, async (req, res) => {
  try {
    // In a real app, you'd check for admin role here
    await cache.flush();
    res.json({ message: 'Cache flushed successfully' });
  } catch (error) {
    logger.error('Cache flush error:', error);
    res.status(500).json({ error: 'Failed to flush cache' });
  }
});

// Clear specific cache pattern (admin only)
router.delete('/pattern/:pattern', authenticateToken, async (req, res) => {
  try {
    // In a real app, you'd check for admin role here
    const { pattern } = req.params;
    await cache.delPattern(pattern);
    res.json({ message: `Cache pattern '${pattern}' cleared successfully` });
  } catch (error) {
    logger.error('Cache pattern delete error:', error);
    res.status(500).json({ error: 'Failed to clear cache pattern' });
  }
});

// Warm cache (admin only)
router.post('/warm', authenticateToken, async (req, res) => {
  try {
    // In a real app, you'd check for admin role here
    await warmCache.all();
    res.json({ message: 'Cache warmed successfully' });
  } catch (error) {
    logger.error('Cache warm error:', error);
    res.status(500).json({ error: 'Failed to warm cache' });
  }
});

// Get specific cache entry
router.get('/key/:key', authenticateToken, async (req, res) => {
  try {
    // In a real app, you'd check for admin role here
    const { key } = req.params;
    const value = await cache.get(key);
    
    if (value === null) {
      return res.status(404).json({ error: 'Cache key not found' });
    }
    
    res.json({ key, value });
  } catch (error) {
    logger.error('Get cache key error:', error);
    res.status(500).json({ error: 'Failed to get cache key' });
  }
});

// Set cache entry (admin only)
router.put('/key/:key', authenticateToken, async (req, res) => {
  try {
    // In a real app, you'd check for admin role here
    const { key } = req.params;
    const { value, ttl } = req.body;
    
    await cache.set(key, value, ttl);
    res.json({ message: `Cache key '${key}' set successfully` });
  } catch (error) {
    logger.error('Set cache key error:', error);
    res.status(500).json({ error: 'Failed to set cache key' });
  }
});

// Delete specific cache key (admin only)
router.delete('/key/:key', authenticateToken, async (req, res) => {
  try {
    // In a real app, you'd check for admin role here
    const { key } = req.params;
    await cache.del(key);
    res.json({ message: `Cache key '${key}' deleted successfully` });
  } catch (error) {
    logger.error('Delete cache key error:', error);
    res.status(500).json({ error: 'Failed to delete cache key' });
  }
});

export default router;