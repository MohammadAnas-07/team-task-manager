const prisma = require('../lib/prisma');

const getProjectActivity = async (req, res) => {
  try {
    const { id: projectId } = req.params;
    const userId = req.user.userId;

    // Check project membership
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { members: true }
    });

    if (!project) return res.status(404).json({ error: 'Project not found' });
    const isMember = project.ownerId === userId || project.members.some(m => m.userId === userId);
    if (!isMember) return res.status(403).json({ error: 'Access denied' });

    const activities = await prisma.activity.findMany({
      where: { projectId },
      include: {
        user: { select: { id: true, name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    res.json({ activities });
  } catch (err) {
    console.error('Get project activity error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getProjectActivity
};
