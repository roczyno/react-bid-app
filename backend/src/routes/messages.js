import express from 'express';
import { 
  cacheMessages, 
  cacheConversations,
  invalidateMessageCache 
} from '../middleware/cache.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Send a message - with cache invalidation
router.post('/', invalidateMessageCache(), async (req, res) => {
  try {
    const { receiverId, content, auctionId, type = 'TEXT' } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ error: 'Receiver ID and content are required' });
    }

    if (receiverId === req.user.id) {
      return res.status(400).json({ error: 'Cannot send message to yourself' });
    }

    // Check if receiver exists
    const receiver = await req.prisma.user.findUnique({
      where: { id: receiverId },
      select: { id: true, firstName: true, lastName: true }
    });

    if (!receiver) {
      return res.status(404).json({ error: 'Receiver not found' });
    }

    // If auctionId is provided, verify the auction exists
    if (auctionId) {
      const auction = await req.prisma.auction.findUnique({
        where: { id: auctionId }
      });

      if (!auction) {
        return res.status(404).json({ error: 'Auction not found' });
      }
    }

    const message = await req.prisma.message.create({
      data: {
        content,
        type,
        senderId: req.user.id,
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

    // Emit real-time message
    req.io.to(`user_${receiverId}`).emit('newMessage', message);

    // Create notification for receiver
    try {
      await req.prisma.notification.create({
        data: {
          title: 'New Message',
          message: `${req.user.firstName} ${req.user.lastName} sent you a message`,
          type: 'MESSAGE_RECEIVED',
          userId: receiverId
        }
      });
    } catch (notificationError) {
      logger.error('Failed to create message notification:', notificationError);
    }

    res.status(201).json({
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    logger.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get conversation between two users - with caching
router.get('/conversation/:userId', cacheMessages(300), async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 50, auctionId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let where = {
      OR: [
        { senderId: req.user.id, receiverId: userId },
        { senderId: userId, receiverId: req.user.id }
      ]
    };

    // Filter by auction if provided
    if (auctionId) {
      where.auctionId = auctionId;
    }

    const [messages, total] = await Promise.all([
      req.prisma.message.findMany({
        where,
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
        },
        orderBy: { timestamp: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      req.prisma.message.count({ where })
    ]);

    res.json({
      messages: messages.reverse(), // Reverse to show oldest first
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    logger.error('Get conversation error:', error);
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
});

// Get all conversations for a user - with caching
router.get('/conversations', cacheConversations(300), async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get unique conversation partners
    const conversations = await req.prisma.$queryRaw`
      SELECT DISTINCT
        CASE 
          WHEN sender_id = ${req.user.id} THEN receiver_id
          ELSE sender_id
        END as partner_id,
        MAX(timestamp) as last_message_time
      FROM messages
      WHERE sender_id = ${req.user.id} OR receiver_id = ${req.user.id}
      GROUP BY partner_id
      ORDER BY last_message_time DESC
      LIMIT ${parseInt(limit)} OFFSET ${skip}
    `;

    // Get partner details and last message for each conversation
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conv) => {
        const partner = await req.prisma.user.findUnique({
          where: { id: conv.partner_id },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        });

        const lastMessage = await req.prisma.message.findFirst({
          where: {
            OR: [
              { senderId: req.user.id, receiverId: conv.partner_id },
              { senderId: conv.partner_id, receiverId: req.user.id }
            ]
          },
          orderBy: { timestamp: 'desc' },
          include: {
            auction: {
              select: {
                id: true,
                title: true
              }
            }
          }
        });

        // Count unread messages
        const unreadCount = await req.prisma.message.count({
          where: {
            senderId: conv.partner_id,
            receiverId: req.user.id,
            // Add isRead field to schema if you want to track read status
          }
        });

        return {
          partner,
          lastMessage,
          unreadCount,
          lastMessageTime: conv.last_message_time
        };
      })
    );

    res.json({
      conversations: conversationsWithDetails,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: conversations.length
      }
    });
  } catch (error) {
    logger.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

export default router;