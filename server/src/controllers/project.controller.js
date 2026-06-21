const prisma = require('../lib/prisma');
const { notifyUser, logActivity } = require('../services/notification.service');

const getProjects = async (req, res) => {
  try {
    const userId = req.user.userId;

    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
        ],
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        _count: { select: { members: true, tasks: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json({ projects });
  } catch (err) {
    console.error('Get projects error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createProject = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, description } = req.body;

    const project = await prisma.$transaction(async (tx) => {
      const newProject = await tx.project.create({
        data: {
          name,
          description,
          ownerId: userId,
        },
      });

      await tx.projectMember.create({
        data: {
          userId,
          projectId: newProject.id,
          role: 'ADMIN',
        },
      });

      return newProject;
    });

    await logActivity({
      projectId: project.id,
      userId,
      action: 'PROJECT_CREATED',
      details: `Created project "${project.name}"`
    });

    const fullProject = await prisma.project.findUnique({
      where: { id: project.id },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        _count: { select: { members: true, tasks: true } },
      },
    });

    res.status(201).json({ project: fullProject });
  } catch (err) {
    console.error('Create project error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getProject = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        members: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
        _count: { select: { tasks: true } },
      },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Verify user is a member or owner
    const isMember = project.ownerId === userId || project.members.some(m => m.userId === userId);
    if (!isMember) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ project });
  } catch (err) {
    console.error('Get project error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        _count: { select: { members: true, tasks: true } },
      },
    });

    res.json({ project });
  } catch (err) {
    console.error('Update project error:', err);
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.project.delete({ where: { id } });

    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('Delete project error:', err);
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

const addMember = async (req, res) => {
  try {
    const { id: projectId } = req.params;
    const { email, role = 'MEMBER' } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already a member
    const existingMember = await prisma.projectMember.findUnique({
      where: { userId_projectId: { userId: user.id, projectId } },
    });

    if (existingMember) {
      return res.status(409).json({ error: 'User is already a member of this project' });
    }

    const member = await prisma.projectMember.create({
      data: {
        userId: user.id,
        projectId,
        role,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    
    // Activity Log
    await logActivity({
      projectId,
      userId: req.user.userId, // The one adding the member
      action: 'MEMBER_ADDED',
      details: `Added ${user.name} to the project`
    });

    // Notification & Email
    await notifyUser({
      userId: user.id,
      type: 'PROJECT_INVITATION',
      title: 'Project Invitation',
      message: `You were added to the project: ${project.name}`,
      emailHtml: `
        <h3>Welcome to the team!</h3>
        <p>You have been added to the project <strong>${project.name}</strong>.</p>
        <p>Log in to view your tasks and collaborate.</p>
      `
    });

    res.status(201).json({ member });
  } catch (err) {
    console.error('Add member error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const removeMember = async (req, res) => {
  try {
    const { id: projectId, userId: targetUserId } = req.params;
    const requestingUserId = req.user.userId;

    // Cannot remove yourself if you're the sole admin
    if (targetUserId === requestingUserId) {
      const adminCount = await prisma.projectMember.count({
        where: { projectId, role: 'ADMIN' },
      });

      if (adminCount <= 1) {
        return res.status(400).json({ error: 'Cannot remove the sole admin from the project' });
      }
    }

    const membership = await prisma.projectMember.findUnique({
      where: { userId_projectId: { userId: targetUserId, projectId } },
    });

    if (!membership) {
      return res.status(404).json({ error: 'Member not found' });
    }

    await prisma.projectMember.delete({
      where: { userId_projectId: { userId: targetUserId, projectId } },
    });

    const user = await prisma.user.findUnique({ where: { id: targetUserId } });
    await logActivity({
      projectId,
      userId: requestingUserId,
      action: 'MEMBER_REMOVED',
      details: `Removed ${user ? user.name : 'a member'} from the project`
    });

    res.json({ message: 'Member removed successfully' });
  } catch (err) {
    console.error('Remove member error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
};
