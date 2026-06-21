const prisma = require('../lib/prisma');

const getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.json({ notifications });
  } catch (err) {
    console.error('Get notifications error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const markAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    await prisma.notification.update({
      where: { id, userId },
      data: { isRead: true },
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Mark as read error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;

    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Mark all as read error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead
};
