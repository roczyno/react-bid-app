import { cache } from '../utils/cache.js';
import { logger } from '../utils/logger.js';

// Cache middleware with custom key generation
export const cacheResponse = (keyGenerator, ttl = 300) => {
  return async (req, res, next) => {
    if (!cache.cacheEnabled || req.method !== 'GET') {
      return next();
    }

    try {
      // Generate cache key
      const cacheKey = typeof keyGenerator === 'function' 
        ? keyGenerator(req) 
        : keyGenerator;

      // Try to get cached data
      const cachedData = await cache.get(cacheKey);

      if (cachedData) {
        logger.debug(`Cache hit: ${cacheKey}`);
        res.set('X-Cache', 'HIT');
        return res.json(cachedData);
      }

      // Store original res.json
      const originalJson = res.json;

      // Override res.json to cache successful responses
      res.json = function(data) {
        if (res.statusCode === 200) {
          cache.set(cacheKey, data, ttl);
          logger.debug(`Cache set: ${cacheKey}`);
          res.set('X-Cache', 'MISS');
        }
        
        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      logger.error('Cache response middleware error:', error);
      next();
    }
  };
};

// Auction-specific cache middleware
export const cacheAuctions = (ttl = 300) => {
  return cacheResponse((req) => {
    const params = { ...req.query };
    delete params.page; // Don't include page in cache key for better hit rate
    return cache.keys.auctions(params);
  }, ttl);
};

export const cacheAuction = (ttl = 600) => {
  return cacheResponse((req) => {
    return cache.keys.auction(req.params.id);
  }, ttl);
};

export const cacheUserAuctions = (ttl = 300) => {
  return cacheResponse((req) => {
    return cache.keys.userAuctions(req.user.id, req.query);
  }, ttl);
};

export const cacheAuctionBids = (ttl = 60) => {
  return cacheResponse((req) => {
    return cache.keys.auctionBids(req.params.auctionId, req.query);
  }, ttl);
};

export const cacheUserBids = (ttl = 300) => {
  return cacheResponse((req) => {
    return cache.keys.userBids(req.user.id, req.query);
  }, ttl);
};

export const cacheNotifications = (ttl = 60) => {
  return cacheResponse((req) => {
    return cache.keys.notifications(req.user.id, req.query);
  }, ttl);
};

export const cacheMessages = (ttl = 300) => {
  return cacheResponse((req) => {
    return cache.keys.messages(req.user.id, req.params.userId, req.query);
  }, ttl);
};

export const cacheConversations = (ttl = 300) => {
  return cacheResponse((req) => {
    return cache.keys.conversations(req.user.id, req.query);
  }, ttl);
};

// Cache invalidation middleware
export const invalidateCache = (type, ...args) => {
  return async (req, res, next) => {
    // Store original res.json
    const originalJson = res.json;

    // Override res.json to invalidate cache after successful operations
    res.json = function(data) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // Invalidate cache asynchronously
        setImmediate(async () => {
          try {
            await cache.invalidate(type, ...args.map(arg => 
              typeof arg === 'function' ? arg(req, res, data) : arg
            ));
          } catch (error) {
            logger.error('Cache invalidation error:', error);
          }
        });
      }
      
      return originalJson.call(this, data);
    };

    next();
  };
};

// Specific invalidation middleware
export const invalidateAuctionCache = () => {
  return invalidateCache('auction', (req) => req.params.id);
};

export const invalidateUserCache = () => {
  return invalidateCache('user', (req) => req.user.id);
};

export const invalidateBidCache = () => {
  return invalidateCache('bid', 
    (req) => req.body.auctionId || req.params.auctionId,
    (req) => req.user.id
  );
};

export const invalidateMessageCache = () => {
  return invalidateCache('message',
    (req) => req.user.id,
    (req) => req.body.receiverId || req.params.userId
  );
};