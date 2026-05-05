const prisma = require('../lib/prisma');

const requireRole = (...roles) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const projectId = req.params.projectId || req.params.id;

      if (!projectId) {
        return res.status(400).json({ error: 'Project ID not found in request' });
      }

      // Check if user is the project owner
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { ownerId: true },
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      if (project.ownerId === userId) {
        return next();
      }

      // Check if user is a member with the required role
      const membership = await prisma.projectMember.findUnique({
        where: {
          userId_projectId: { userId, projectId },
        },
      });

      if (!membership) {
        return res.status(403).json({ error: 'You are not a member of this project' });
      }

      if (roles.length > 0 && !roles.includes(membership.role)) {
        return res.status(403).json({ error: 'Insufficient permissions for this action' });
      }

      next();
    } catch (err) {
      console.error('Role middleware error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
};

module.exports = { requireRole };
