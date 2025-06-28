import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger.js';

export const setupSocketHandlers = (io, prisma) => {
  // Authentication middleware for socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true
        }
      });

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user.id;
      socket.user = user;
      next();
    } catch (error) {
      logger.error('Socket authentication error:', error);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`User ${socket.user.firstName} ${socket.user.lastName} connected`);

    // Join user to their personal room for notifications
    socket.join(`user_${socket.userId}`);

    // Join auction room
    socket.on('joinAuction', (auctionId) => {
      socket.join(`auction_${auctionId}`);
      logger.info(`User ${socket.userId} joined auction ${auctionId}`);
    });

    // Leave auction room
    socket.on('leaveAuction', (auctionId) => {
      socket.leave(`auction_${auctionId}`);
      logger.info(`User ${socket.userId} left auction ${auctionId}`);
    });

    // Handle real-time bidding
    socket.on('placeBid', async (data) => {
      try {
        const { auctionId, amount } = data;

        // Validate bid (similar to REST API validation)
        const auction = await prisma.auction.findUnique({
          where: { id: auctionId },
          include: {
            bids: {
              orderBy: { timestamp: 'desc' },
              take: 1
            }
          }
        });

        if (!auction || auction.status !== 'ACTIVE' || new Date() > auction.endTime) {
          socket.emit('bidError', { error: 'Auction is not available for bidding' });
          return;
        }

        if (auction.sellerId === socket.userId) {
          socket.emit('bidError', { error: 'Cannot bid on your own auction' });
          return;
        }

        if (amount <= auction.currentPrice) {
          socket.emit('bidError', { 
            error: 'Bid must be higher than current price',
            currentPrice: auction.currentPrice
          });
          return;
        }

        // Create bid
        const bid = await prisma.bid.create({
          data: {
            amount: parseFloat(amount),
            auctionId,
            bidderId: socket.userId
          },
          include: {
            bidder: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true
              }
            }
          }
        });

        // Update auction current price
        await prisma.auction.update({
          where: { id: auctionId },
          data: { currentPrice: parseFloat(amount) }
        });

        // Broadcast bid to all users in auction room
        io.to(`auction_${auctionId}`).emit('newBid', {
          bid,
          currentPrice: parseFloat(amount)
        });

        logger.info(`Bid placed: ${amount} on auction ${auctionId} by user ${socket.userId}`);
      } catch (error) {
        logger.error('Socket bid error:', error);
        socket.emit('bidError', { error: 'Failed to place bid' });
      }
    });

    // Handle real-time messaging
    socket.on('sendMessage', async (data) => {
      try {
        const { receiverId, content, auctionId } = data;

        // Create message
        const message = await prisma.message.create({
          data: {
            content,
            senderId: socket.userId,
            receiverId,
            auctionId
          },
          include: {
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true
              }
            },
            receiver: {
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
                title: true
              }
            }
          }
        });

        // Send message to receiver
        io.to(`user_${receiverId}`).emit('newMessage', message);
        
        // Confirm to sender
        socket.emit('messageSent', message);

        logger.info(`Message sent from ${socket.userId} to ${receiverId}`);
      } catch (error) {
        logger.error('Socket message error:', error);
        socket.emit('messageError', { error: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing', (data) => {
      const { receiverId, isTyping } = data;
      io.to(`user_${receiverId}`).emit('userTyping', {
        userId: socket.userId,
        user: socket.user,
        isTyping
      });
    });

    // Handle auction updates (for sellers)
    socket.on('updateAuction', async (data) => {
      try {
        const { auctionId, updates } = data;

        // Verify ownership
        const auction = await prisma.auction.findUnique({
          where: { id: auctionId }
        });

        if (!auction || auction.sellerId !== socket.userId) {
          socket.emit('updateError', { error: 'Not authorized to update this auction' });
          return;
        }

        // Update auction
        const updatedAuction = await prisma.auction.update({
          where: { id: auctionId },
          data: updates
        });

        // Broadcast update to auction room
        io.to(`auction_${auctionId}`).emit('auctionUpdated', updatedAuction);

        logger.info(`Auction ${auctionId} updated by user ${socket.userId}`);
      } catch (error) {
        logger.error('Socket auction update error:', error);
        socket.emit('updateError', { error: 'Failed to update auction' });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      logger.info(`User ${socket.user.firstName} ${socket.user.lastName} disconnected`);
    });
  });

  // Auction ending scheduler (runs every minute)
  setInterval(async () => {
    try {
      const endedAuctions = await prisma.auction.findMany({
        where: {
          status: 'ACTIVE',
          endTime: {
            lte: new Date()
          }
        },
        include: {
          bids: {
            orderBy: { amount: 'desc' },
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
          seller: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          }
        }
      });

      for (const auction of endedAuctions) {
        // Update auction status
        await prisma.auction.update({
          where: { id: auction.id },
          data: { status: 'ENDED' }
        });

        // Notify auction room
        io.to(`auction_${auction.id}`).emit('auctionEnded', {
          auctionId: auction.id,
          winningBid: auction.bids[0] || null
        });

        // Create notifications
        if (auction.bids.length > 0) {
          const winningBid = auction.bids[0];
          
          // Notify winner
          await prisma.notification.create({
            data: {
              title: 'Auction Won!',
              message: `Congratulations! You won the auction for "${auction.title}" with a bid of $${winningBid.amount}`,
              type: 'AUCTION_WON',
              userId: winningBid.bidderId
            }
          });

          io.to(`user_${winningBid.bidderId}`).emit('notification', {
            type: 'AUCTION_WON',
            message: `You won the auction for "${auction.title}"!`
          });
        }

        // Notify seller
        await prisma.notification.create({
          data: {
            title: 'Auction Ended',
            message: `Your auction "${auction.title}" has ended${auction.bids.length > 0 ? ` with a winning bid of $${auction.bids[0].amount}` : ' with no bids'}`,
            type: 'AUCTION_ENDED',
            userId: auction.sellerId
          }
        });

        logger.info(`Auction ${auction.id} ended automatically`);
      }
    } catch (error) {
      logger.error('Auction ending scheduler error:', error);
    }
  }, 60000); // Run every minute
};