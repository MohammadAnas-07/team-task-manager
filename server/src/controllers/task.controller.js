const prisma = require('../lib/prisma');
const { notifyUser, logActivity } = require('../services/notification.service');

const getTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, assigneeId, priority } = req.query;

    const where = { projectId };

    if (status) where.status = status;
    if (assigneeId) where.assigneeId = assigneeId;
    if (priority) where.priority = priority;

    const tasks = await prisma.task.findMany({
      where,
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        creator: { select: { id: true, name: true, email: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json({ tasks });
  } catch (err) {
    console.error('Get tasks error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.userId;
    const { title, description, priority, status, assigneeId, dueDate } = req.body;

    // Verify assignee is a project member if provided
    if (assigneeId) {
      const assigneeMembership = await prisma.projectMember.findUnique({
        where: { userId_projectId: { userId: assigneeId, projectId } },
      });

      if (!assigneeMembership) {
        // Check if they're the owner
        const project = await prisma.project.findUnique({
          where: { id: projectId },
          select: { ownerId: true },
        });

        if (!project || project.ownerId !== assigneeId) {
          return res.status(400).json({ error: 'Assignee must be a project member' });
        }
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority: priority || 'MEDIUM',
        status: status || 'TODO',
        assigneeId: assigneeId || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        creatorId: userId,
      },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        creator: { select: { id: true, name: true, email: true } },
      },
    });

    // Activity Log
    await logActivity({
      projectId,
      userId,
      action: 'TASK_CREATED',
      details: `Created task "${task.title}"`
    });

    // Notify assignee
    if (assigneeId && assigneeId !== userId) {
      await notifyUser({
        userId: assigneeId,
        type: 'TASK_ASSIGNED',
        title: 'New Task Assigned',
        message: `You were assigned: ${task.title}`,
        emailHtml: `
          <h3>New Task Assigned</h3>
          <p>You have been assigned a new task: <strong>${task.title}</strong></p>
          <p>Priority: ${task.priority}</p>
          <p>Log in to view details.</p>
        `
      });
    }

    res.status(201).json({ task });
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateTask = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;
    const userId = req.user.userId;
    const { title, description, priority, status, assigneeId, dueDate } = req.body;

    // Find the task
    const task = await prisma.task.findFirst({
      where: { id: taskId, projectId },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check permissions: assignee can only update status, ADMIN can update everything
    const membership = await prisma.projectMember.findUnique({
      where: { userId_projectId: { userId, projectId } },
    });

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { ownerId: true },
    });

    const isAdmin = project.ownerId === userId || (membership && membership.role === 'ADMIN');
    const isAssignee = task.assigneeId === userId;

    if (!isAdmin && !isAssignee) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    // Assignees can only update status
    let updateData = {};
    if (isAdmin) {
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (priority !== undefined) updateData.priority = priority;
      if (status !== undefined) updateData.status = status;
      if (assigneeId !== undefined) updateData.assigneeId = assigneeId || null;
      if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
    } else {
      // Only assignee updating status
      if (status !== undefined) updateData.status = status;
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        creator: { select: { id: true, name: true, email: true } },
      },
    });

    // Activity log if status changed
    if (status !== undefined && status !== task.status) {
      const action = status === 'DONE' ? 'TASK_COMPLETED' : 'TASK_UPDATED';
      await logActivity({
        projectId,
        userId,
        action,
        details: `${action === 'TASK_COMPLETED' ? 'Completed' : 'Updated status of'} task "${updatedTask.title}"`
      });

      // Notify assignee if someone else updated it
      if (updatedTask.assigneeId && updatedTask.assigneeId !== userId) {
        await notifyUser({
          userId: updatedTask.assigneeId,
          type: 'TASK_UPDATED',
          title: 'Task Updated',
          message: `Task "${updatedTask.title}" status changed to ${status}`,
          emailHtml: `<p>Your task <strong>${updatedTask.title}</strong> status was changed to ${status}.</p>`
        });
      }
    }

    res.json({ task: updatedTask });
  } catch (err) {
    console.error('Update task error:', err);
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;

    const task = await prisma.task.findFirst({
      where: { id: taskId, projectId },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await prisma.task.delete({ where: { id: taskId } });

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Delete task error:', err);
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
