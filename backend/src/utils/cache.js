import Redis from 'ioredis';
import NodeCache from 'node-cache';
import { logger } from './logger.js';

class CacheManager {
  constructor() {
    this.redis = null;
    this.nodeCache = new NodeCache({ 
      stdTTL: parseInt(process.env.CACHE_TTL) || 300, // 5 minutes default
      checkperiod: 60 // Check for expired keys every 60 seconds
    });
    this.isRedisConnected = false;
    this.cacheEnabled = process.env.CACHE_ENABLED === 'true';
    
    this.initializeRedis();
  }

  async initializeRedis() {
    if (!this.cacheEnabled) {
      logger.info('Cache is disabled');
      return;
    }

    try {
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
      
      this.redis = new Redis(redisUrl, {
        retryDelayOnFailover: 100,
        enableReadyCheck: false,
        maxRetriesPerRequest: null,
        lazyConnect: true,
        password: process.env.REDIS_PASSWORD || undefined,
        db: parseInt(process.env.REDIS_DB) || 0,
      });

      this.redis.on('connect', () => {
        logger.info('Redis connected successfully');
        this.isRedisConnected = true;
      });

      this.redis.on('error', (error) => {
        logger.error('Redis connection error:', error);
        this.isRedisConnected = false;
      });

      this.redis.on('close', () => {
        logger.warn('Redis connection closed');
        this.isRedisConnected = false;
      });

      // Test connection
      await this.redis.ping();
      
    } catch (error) {
      logger.error('Failed to initialize Redis:', error);
      this.isRedisConnected = false;
    }
  }

  async get(key) {
    if (!this.cacheEnabled) return null;

    try {
      // Try Redis first
      if (this.isRedisConnected && this.redis) {
        const value = await this.redis.get(key);
        if (value) {
          return JSON.parse(value);
        }
      }

      // Fallback to NodeCache
      return this.nodeCache.get(key) || null;
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  }

  async set(key, value, ttl = null) {
    if (!this.cacheEnabled) return false;

    try {
      const serializedValue = JSON.stringify(value);
      const cacheTTL = ttl || parseInt(process.env.CACHE_TTL) || 300;

      // Try Redis first
      if (this.isRedisConnected && this.redis) {
        await this.redis.setex(key, cacheTTL, serializedValue);
      }

      // Also set in NodeCache as fallback
      this.nodeCache.set(key, value, cacheTTL);
      
      return true;
    } catch (error) {
      logger.error('Cache set error:', error);
      return false;
    }
  }

  async del(key) {
    if (!this.cacheEnabled) return false;

    try {
      // Delete from Redis
      if (this.isRedisConnected && this.redis) {
        await this.redis.del(key);
      }

      // Delete from NodeCache
      this.nodeCache.del(key);
      
      return true;
    } catch (error) {
      logger.error('Cache delete error:', error);
      return false;
    }
  }

  async delPattern(pattern) {
    if (!this.cacheEnabled) return false;

    try {
      // Delete from Redis using pattern
      if (this.isRedisConnected && this.redis) {
        const keys = await this.redis.keys(pattern);
        if (keys.length > 0) {
          await this.redis.del(...keys);
        }
      }

      // Delete from NodeCache (get all keys and filter)
      const allKeys = this.nodeCache.keys();
      const matchingKeys = allKeys.filter(key => {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        return regex.test(key);
      });
      
      matchingKeys.forEach(key => this.nodeCache.del(key));
      
      return true;
    } catch (error) {
      logger.error('Cache delete pattern error:', error);
      return false;
    }
  }

  async flush() {
    if (!this.cacheEnabled) return false;

    try {
      // Flush Redis
      if (this.isRedisConnected && this.redis) {
        await this.redis.flushdb();
      }

      // Flush NodeCache
      this.nodeCache.flushAll();
      
      return true;
    } catch (error) {
      logger.error('Cache flush error:', error);
      return false;
    }
  }

  // Generate cache keys
  generateKey(prefix, ...parts) {
    return `${prefix}:${parts.join(':')}`;
  }

  // Cache key patterns
  keys = {
    auction: (id) => this.generateKey('auction', id),
    auctions: (params) => this.generateKey('auctions', JSON.stringify(params)),
    userAuctions: (userId, params) => this.generateKey('user_auctions', userId, JSON.stringify(params)),
    auctionBids: (auctionId, params) => this.generateKey('auction_bids', auctionId, JSON.stringify(params)),
    userBids: (userId, params) => this.generateKey('user_bids', userId, JSON.stringify(params)),
    user: (id) => this.generateKey('user', id),
    notifications: (userId, params) => this.generateKey('notifications', userId, JSON.stringify(params)),
    messages: (userId, receiverId, params) => this.generateKey('messages', userId, receiverId, JSON.stringify(params)),
    conversations: (userId, params) => this.generateKey('conversations', userId, JSON.stringify(params)),
  };

  // Cache invalidation patterns
  invalidatePatterns = {
    auction: (auctionId) => [`auction:${auctionId}`, 'auctions:*', 'auction_bids:*'],
    user: (userId) => [`user:${userId}`, `user_auctions:${userId}:*`, `user_bids:${userId}:*`, `notifications:${userId}:*`],
    bid: (auctionId, userId) => [`auction:${auctionId}`, 'auctions:*', `auction_bids:${auctionId}:*`, `user_bids:${userId}:*`],
    message: (senderId, receiverId) => [
      `messages:${senderId}:${receiverId}:*`,
      `messages:${receiverId}:${senderId}:*`,
      `conversations:${senderId}:*`,
      `conversations:${receiverId}:*`
    ],
  };

  // Invalidate related cache entries
  async invalidate(type, ...args) {
    if (!this.cacheEnabled) return false;

    try {
      const patterns = this.invalidatePatterns[type]?.(...args) || [];
      
      for (const pattern of patterns) {
        await this.delPattern(pattern);
      }
      
      logger.info(`Cache invalidated for ${type}:`, args);
      return true;
    } catch (error) {
      logger.error('Cache invalidation error:', error);
      return false;
    }
  }

  // Get cache statistics
  getStats() {
    const nodeStats = this.nodeCache.getStats();
    
    return {
      redis: {
        connected: this.isRedisConnected,
        url: process.env.REDIS_URL || 'redis://localhost:6379'
      },
      nodeCache: {
        keys: nodeStats.keys,
        hits: nodeStats.hits,
        misses: nodeStats.misses,
        hitRate: nodeStats.hits / (nodeStats.hits + nodeStats.misses) || 0
      },
      enabled: this.cacheEnabled
    };
  }
}

// Create singleton instance
export const cache = new CacheManager();

// Cache middleware for Express routes
export const cacheMiddleware = (ttl = null) => {
  return async (req, res, next) => {
    if (!cache.cacheEnabled || req.method !== 'GET') {
      return next();
    }

    try {
      // Generate cache key based on URL and query parameters
      const cacheKey = `route:${req.originalUrl}`;
      const cachedData = await cache.get(cacheKey);

      if (cachedData) {
        logger.debug(`Cache hit for ${cacheKey}`);
        return res.json(cachedData);
      }

      // Store original res.json function
      const originalJson = res.json;

      // Override res.json to cache the response
      res.json = function(data) {
        // Cache the response
        cache.set(cacheKey, data, ttl);
        logger.debug(`Cache set for ${cacheKey}`);
        
        // Call original json function
        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      logger.error('Cache middleware error:', error);
      next();
    }
  };
};

// Cache warming functions
export const warmCache = {
  async auctions() {
    try {
      logger.info('Warming auction cache...');
      
      // Cache popular auction queries
      const popularQueries = [
        { page: 1, limit: 20, status: 'ACTIVE' },
        { page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' },
        { page: 1, limit: 10, sortBy: 'endTime', sortOrder: 'asc' },
      ];

      // This would be called from your auction service
      // Implementation depends on your auction fetching logic
      
      logger.info('Auction cache warmed');
    } catch (error) {
      logger.error('Error warming auction cache:', error);
    }
  },

  async all() {
    await this.auctions();
  }
};