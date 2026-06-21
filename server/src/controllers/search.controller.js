const prisma = require('../lib/prisma');

const globalSearch = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json({ projects: [], tasks: [], members: [] });
    }

    const searchQuery = `%${q}%`;

    // 1. Projects (owned by user or member of)
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } }
        ],
        AND: {
          OR: [
            { ownerId: userId },
            { members: { some: { userId } } }
          ]
        }
      },
      take: 5
    });

    // 2. Tasks (in projects user has access to)
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } }
        ],
        project: {
          OR: [
            { ownerId: userId },
            { members: { some: { userId } } }
          ]
        }
      },
      include: {
        project: { select: { id: true, name: true } }
      },
      take: 10
    });

    // 3. Members (users in the same projects)
    const members = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } }
        ],
        memberships: {
          some: {
            project: {
              OR: [
                { ownerId: userId },
                { members: { some: { userId } } }
              ]
            }
          }
        }
      },
      distinct: ['id'],
      take: 5
    });

    res.json({ projects, tasks, members });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { globalSearch };
