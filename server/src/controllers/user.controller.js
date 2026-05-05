const prisma = require('../lib/prisma');

const getDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get all tasks assigned to user
    const [
      totalTasks,
      todoCount,
      inProgressCount,
      doneCount,
      overdueTasks,
      recentTasks,
      projectCount,
    ] = await Promise.all([
      // Total tasks assigned to user
      prisma.task.count({
        where: { assigneeId: userId },
      }),

      // TODO count
      prisma.task.count({
        where: { assigneeId: userId, status: 'TODO' },
      }),

      // IN_PROGRESS count
      prisma.task.count({
        where: { assigneeId: userId, status: 'IN_PROGRESS' },
      }),

      // DONE count
      prisma.task.count({
        where: { assigneeId: userId, status: 'DONE' },
      }),

      // Overdue tasks
      prisma.task.findMany({
        where: {
          assigneeId: userId,
          status: { not: 'DONE' },
          dueDate: { lt: new Date() },
        },
        include: {
          project: { select: { name: true } },
        },
        orderBy: { dueDate: 'asc' },
      }),

      // Recent tasks
      prisma.task.findMany({
        where: { assigneeId: userId },
        include: {
          project: { select: { name: true } },
          creator: { select: { id: true, name: true } },
        },
        orderBy: { updatedAt: 'desc' },
        take: 10,
      }),

      // Project count (where user is owner or member)
      prisma.project.count({
        where: {
          OR: [
            { ownerId: userId },
            { members: { some: { userId } } },
          ],
        },
      }),
    ]);

    res.json({
      totalTasks,
      todoCount,
      inProgressCount,
      doneCount,
      overdueTasks,
      recentTasks,
      projectCount,
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getDashboard };
