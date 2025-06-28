import express from 'express';
import { 
  cacheAuctionBids, 
  cacheUserBids,
  invalidateBidCache 
} from '../middleware/cache.js';
import { cache } from '../utils/cache.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Place a bid - with cache invalidation
router.post('/', invalidateBidCache(), async (req, res) => {
  try {
    const { auctionId, amount } = req.body;

    if (!auctionId || !amount) {
      return res.status(400).json({ error: 'Auction ID and amount are required' });
    }

    const bidAmount = parseFloat(amount);
    if (bidAmount <= 0) {
      return res.status(400).json({ error: 'Bid amount must be greater than 0' });
    }

    // Get auction details
    const auction = await req.prisma.auction.findUnique({
      where: { id: auctionId },
      include: {
        seller: true,
        bids: {
          orderBy: { timestamp: 'desc' },
          take: 1
        }
      }
    });

    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }

    // Check if auction is active
    if (auction.status !== 'ACTIVE') {
      return res.status(400).json({ error: 'Auction is not active' });
    }

    // Check if auction has ended
    if (new Date() > auction.endTime) {
      return res.status(400).json({ error: 'Auction has ended' });
    }

    // Check if user is not the seller
    if (auction.sellerId === req.user.id) {
      return res.status(400).json({ error: 'Cannot bid on your own auction' });
    }

    // Check if bid is higher than current price
    if (bidAmount <= auction.currentPrice) {
      return res.status(400).json({ 
        error: 'Bid must be higher than current price',
        currentPrice: auction.currentPrice
      });
    }

    // Check if user is not the current highest bidder
    if (auction.bids.length > 0 && auction.bids[0].bidderId === req.user.id) {
      return res.status(400).json({ error: 'You are already the highest bidder' });
    }

    // Create bid and update auction in a transaction
    const result = await req.prisma.$transaction(async (prisma) => {
      // Create the bid
      const bid = await prisma.bid.create({
        data: {
          amount: bidAmount,
          auctionId,
          bidderId: req.user.id
        },
        include: {
          bidder: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true
            }
          },
          auction: {
            select: {
              id: true,
              title: true,
              sellerId: true
            }
          }
        }
      });

      // Update auction current price
      const updatedAuction = await prisma.auction.update({
        where: { id: auctionId },
        data: { currentPrice: bidAmount }
      });

      return { bid, updatedAuction };
    });

    // Invalidate related caches
    await Promise.all([
      cache.del(cache.keys.auction(auctionId)),
      cache.delPattern('auctions:*'),
      cache.delPattern(`auction_bids:${auctionId}:*`),
      cache.delPattern(`user_bids:${req.user.id}:*`)
    ]);

    // Emit real-time bid update
    req.io.to(`auction_${auctionId}`).emit('newBid', {
      bid: result.bid,
      currentPrice: bidAmount
    });

    // Create notifications
    try {
      // Notify seller
      await req.prisma.notification.create({
        data: {
          title: 'New Bid Received',
          message: `${req.user.firstName} ${req.user.lastName} placed a bid of $${bidAmount} on your auction "${auction.title}"`,
          type: 'BID_PLACED',
          userId: auction.sellerId
        }
      });

      // Notify previous highest bidder if exists
      if (auction.bids.length > 0 && auction.bids[0].bidderId !== req.user.id) {
        await req.prisma.notification.create({
          data: {
            title: 'You\'ve Been Outbid',
            message: `Your bid on "${auction.title}" has been outbid. Current price: $${bidAmount}`,
            type: 'BID_OUTBID',
            userId: auction.bids[0].bidderId
          }
        });
      }
    } catch (notificationError) {
      logger.error('Failed to create bid notifications:', notificationError);
    }

    res.status(201).json({
      message: 'Bid placed successfully',
      bid: result.bid
    });
  } catch (error) {
    logger.error('Place bid error:', error);
    res.status(500).json({ error: 'Failed to place bid' });
  }
});

// Get user's bids - with caching
router.get('/my-bids', cacheUserBids(300), async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let where = {
      bidderId: req.user.id
    };

    // Filter by auction status if provided
    if (status) {
      where.auction = { status };
    }

    const [bids, total] = await Promise.all([
      req.prisma.bid.findMany({
        where,
        include: {
          auction: {
            select: {
              id: true,
              title: true,
              currentPrice: true,
              endTime: true,
              status: true,
              images: true,
              make: true,
              model: true,
              year: true
            }
          }
        },
        orderBy: { timestamp: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      req.prisma.bid.count({ where })
    ]);

    // Add status for each bid (winning, outbid, won, lost)
    const bidsWithStatus = await Promise.all(
      bids.map(async (bid) => {
        const highestBid = await req.prisma.bid.findFirst({
          where: { auctionId: bid.auctionId },
          orderBy: { amount: 'desc' }
        });

        let bidStatus = 'outbid';
        if (highestBid && highestBid.id === bid.id) {
          if (bid.auction.status === 'ENDED') {
            bidStatus = 'won';
          } else if (bid.auction.status === 'ACTIVE') {
            bidStatus = 'winning';
          }
        } else if (bid.auction.status === 'ENDED') {
          bidStatus = 'lost';
        }

        return {
          ...bid,
          status: bidStatus,
          isHighestBid: highestBid && highestBid.id === bid.id
        };
      })
    );

    res.json({
      bids: bidsWithStatus,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    logger.error('Get user bids error:', error);
    res.status(500).json({ error: 'Failed to fetch user bids' });
  }
});

// Get bid history for an auction - with caching
router.get('/auction/:auctionId', cacheAuctionBids(60), async (req, res) => {
  try {
    const { auctionId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [bids, total] = await Promise.all([
      req.prisma.bid.findMany({
        where: { auctionId },
        include: {
          bidder: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true
            }
          }
        },
        orderBy: { timestamp: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      req.prisma.bid.count({ where: { auctionId } })
    ]);

    res.json({
      bids,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    logger.error('Get auction bids error:', error);
    res.status(500).json({ error: 'Failed to fetch auction bids' });
  }
});

export default router;