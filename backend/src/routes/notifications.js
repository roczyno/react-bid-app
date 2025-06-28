import express from 'express';
import { cacheNotifications, invalidateUserCache } from '../middleware/cache.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Get user notifications - with caching
router.get('/', cacheNotifications(60), async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      userId: req.user.id,
      ...(unreadOnly === 'true' && { isRead: false })
    };

    const [notifications, total, unreadCount] = await Promise.all([
      req.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      req.prisma.notification.count({ where }),
      req.prisma.notification.count({
        where: { userId: req.user.id, isRead: false }
      })
    ]);

    res.json({
      notifications,
      unreadCount,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    logger.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark notification as read - with cache invalidation
router.put('/:id/read', invalidateUserCache(), async (req, res) => {
  try {
    const notification = await req.prisma.notification.findUnique({
      where: { id: req.params.id }
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    if (notification.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this notification' });
    }

    const updatedNotification = await req.prisma.notification.update({
      where: { id: req.params.id },
      data: { isRead: true }
    });

    res.json({
      message: 'Notification marked as read',
      notification: updatedNotification
    });
  } catch (error) {
    logger.error('Mark notification as read error:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// Mark all notifications as read - with cache invalidation
router.put('/mark-all-read', invalidateUserCache(), async (req, res) => {
  try {
    const result = await req.prisma.notification.updateMany({
      where: { userId: req.user.id, isRead: false },
      data: { isRead: true }
    });

    res.json({
      message: 'All notifications marked as read',
      count: result.count
    });
  } catch (error) {
    logger.error('Mark all notifications as read error:', error);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
});

// Delete notification - with cache invalidation
router.delete('/:id', invalidateUserCache(), async (req, res) => {
  try {
    const notification = await req.prisma.notification.findUnique({
      where: { id: req.params.id }
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    if (notification.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this notification' });
    }

    await req.prisma.notification.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    logger.error('Delete notification error:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

export default router;