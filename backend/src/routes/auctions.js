import express from 'express';
import { authenticateToken, requireSubscription, requireEmailVerification } from '../middleware/auth.js';
import { 
  cacheAuctions, 
  cacheAuction, 
  cacheUserAuctions,
  invalidateAuctionCache,
  invalidateUserCache 
} from '../middleware/cache.js';
import { cache } from '../utils/cache.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Get all auctions (public) - with caching
router.get('/', cacheAuctions(300), async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status = 'ACTIVE',
      make,
      model,
      minPrice,
      maxPrice,
      condition,
      sortBy = 'endTime',
      sortOrder = 'asc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const where = {
      status,
      ...(make && { make: { contains: make, mode: 'insensitive' } }),
      ...(model && { model: { contains: model, mode: 'insensitive' } }),
      ...(minPrice && { currentPrice: { gte: parseFloat(minPrice) } }),
      ...(maxPrice && { currentPrice: { lte: parseFloat(maxPrice) } }),
      ...(condition && { condition })
    };

    const orderBy = {
      [sortBy]: sortOrder
    };

    const [auctions, total] = await Promise.all([
      req.prisma.auction.findMany({
        where,
        include: {
          seller: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true
            }
          },
          bids: {
            orderBy: { timestamp: 'desc' },
            take: 1,
            include: {
              bidder: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true
                }
              }
            }
          },
          _count: {
            select: { bids: true }
          }
        },
        orderBy,
        skip,
        take: parseInt(limit)
      }),
      req.prisma.auction.count({ where })
    ]);

    res.json({
      auctions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    logger.error('Get auctions error:', error);
    res.status(500).json({ error: 'Failed to fetch auctions' });
  }
});

// Get single auction (public) - with caching
router.get('/:id', cacheAuction(600), async (req, res) => {
  try {
    const auction = await req.prisma.auction.findUnique({
      where: { id: req.params.id },
      include: {
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            phone: true
          }
        },
        bids: {
          orderBy: { timestamp: 'desc' },
          include: {
            bidder: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          }
        },
        _count: {
          select: { bids: true }
        }
      }
    });

    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }

    res.json(auction);
  } catch (error) {
    logger.error('Get auction error:', error);
    res.status(500).json({ error: 'Failed to fetch auction' });
  }
});

// Create auction - with cache invalidation
router.post('/', 
  authenticateToken, 
  requireEmailVerification,
  requireSubscription('STANDARD'),
  invalidateUserCache(),
  async (req, res) => {
    try {
      const {
        title,
        description,
        startingPrice,
        buyNowPrice,
        reservePrice,
        endTime,
        images,
        make,
        model,
        year,
        mileage,
        condition,
        fuelType,
        transmission,
        color,
        vin,
        location
      } = req.body;

      // Validation
      if (!title || !description || !startingPrice || !endTime || !make || !model || !year || !condition || !location) {
        return res.status(400).json({ error: 'All required fields must be provided' });
      }

      if (new Date(endTime) <= new Date()) {
        return res.status(400).json({ error: 'End time must be in the future' });
      }

      if (parseFloat(startingPrice) <= 0) {
        return res.status(400).json({ error: 'Starting price must be greater than 0' });
      }

      const auction = await req.prisma.auction.create({
        data: {
          title,
          description,
          startingPrice: parseFloat(startingPrice),
          currentPrice: parseFloat(startingPrice),
          buyNowPrice: buyNowPrice ? parseFloat(buyNowPrice) : null,
          reservePrice: reservePrice ? parseFloat(reservePrice) : null,
          startTime: new Date(),
          endTime: new Date(endTime),
          images: images || [],
          make,
          model,
          year: parseInt(year),
          mileage: mileage ? parseInt(mileage) : null,
          condition,
          fuelType,
          transmission,
          color,
          vin,
          location,
          sellerId: req.user.id
        },
        include: {
          seller: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true
            }
          }
        }
      });

      // Invalidate auction list caches
      await cache.delPattern('auctions:*');

      res.status(201).json({
        message: 'Auction created successfully',
        auction
      });
    } catch (error) {
      logger.error('Create auction error:', error);
      res.status(500).json({ error: 'Failed to create auction' });
    }
  }
);

// Update auction - with cache invalidation
router.put('/:id', 
  authenticateToken, 
  invalidateAuctionCache(),
  invalidateUserCache(),
  async (req, res) => {
    try {
      const auction = await req.prisma.auction.findUnique({
        where: { id: req.params.id }
      });

      if (!auction) {
        return res.status(404).json({ error: 'Auction not found' });
      }

      if (auction.sellerId !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized to update this auction' });
      }

      if (auction.status !== 'DRAFT' && auction.status !== 'ACTIVE') {
        return res.status(400).json({ error: 'Cannot update ended or cancelled auction' });
      }

      const updatedAuction = await req.prisma.auction.update({
        where: { id: req.params.id },
        data: req.body,
        include: {
          seller: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true
            }
          }
        }
      });

      // Invalidate auction list caches
      await cache.delPattern('auctions:*');

      res.json({
        message: 'Auction updated successfully',
        auction: updatedAuction
      });
    } catch (error) {
      logger.error('Update auction error:', error);
      res.status(500).json({ error: 'Failed to update auction' });
    }
  }
);

// Delete auction - with cache invalidation
router.delete('/:id', 
  authenticateToken,
  invalidateAuctionCache(),
  invalidateUserCache(),
  async (req, res) => {
    try {
      const auction = await req.prisma.auction.findUnique({
        where: { id: req.params.id },
        include: {
          _count: {
            select: { bids: true }
          }
        }
      });

      if (!auction) {
        return res.status(404).json({ error: 'Auction not found' });
      }

      if (auction.sellerId !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized to delete this auction' });
      }

      if (auction._count.bids > 0) {
        return res.status(400).json({ error: 'Cannot delete auction with existing bids' });
      }

      await req.prisma.auction.delete({
        where: { id: req.params.id }
      });

      // Invalidate auction list caches
      await cache.delPattern('auctions:*');

      res.json({ message: 'Auction deleted successfully' });
    } catch (error) {
      logger.error('Delete auction error:', error);
      res.status(500).json({ error: 'Failed to delete auction' });
    }
  }
);

// Get user's auctions - with caching
router.get('/user/my-auctions', 
  authenticateToken, 
  cacheUserAuctions(300),
  async (req, res) => {
    try {
      const { status, page = 1, limit = 10 } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const where = {
        sellerId: req.user.id,
        ...(status && { status })
      };

      const [auctions, total] = await Promise.all([
        req.prisma.auction.findMany({
          where,
          include: {
            bids: {
              orderBy: { timestamp: 'desc' },
              take: 1
            },
            _count: {
              select: { bids: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: parseInt(limit)
        }),
        req.prisma.auction.count({ where })
      ]);

      res.json({
        auctions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      logger.error('Get user auctions error:', error);
      res.status(500).json({ error: 'Failed to fetch user auctions' });
    }
  }
);

export default router;