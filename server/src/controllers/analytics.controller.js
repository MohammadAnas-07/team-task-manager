const prisma = require('../lib/prisma');
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const getAnalyticsInsights = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch user's projects and tasks to determine context
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } }
        ]
      },
      include: {
        tasks: true
      }
    });

    let totalTasks = 0;
    let completedTasks = 0;
    let overdueTasks = 0;
    const now = new Date();

    projects.forEach(p => {
      totalTasks += p.tasks.length;
      p.tasks.forEach(t => {
        if (t.status === 'DONE') completedTasks++;
        if (t.status !== 'DONE' && t.dueDate && new Date(t.dueDate) < now) overdueTasks++;
      });
    });

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const activeProjects = projects.length;

    let statusDist = { TODO: 0, IN_PROGRESS: 0, DONE: 0 };
    projects.forEach(p => {
      p.tasks.forEach(t => {
        statusDist[t.status]++;
      });
    });

    // Format data for AI
    const prompt = `
You are an expert AI Productivity Analyst. Based on the following project data for a user, provide a Project Health Score (0-100), 3-4 insightful sentences about their productivity, and 2-3 recommendations.

Data:
- Total Tasks: ${totalTasks}
- Completed Tasks: ${completedTasks}
- Overdue Tasks: ${overdueTasks}
- Completion Rate: ${completionRate}%
- Active Projects: ${activeProjects}
- Tasks by Status: TODO (${statusDist.TODO}), IN_PROGRESS (${statusDist.IN_PROGRESS}), DONE (${statusDist.DONE})

Output strictly as JSON matching this schema:
{
  "healthScore": 87,
  "insights": ["insight 1", "insight 2"],
  "recommendations": ["rec 1", "rec 2"]
}
`;

    let aiData = { healthScore: 0, insights: [], recommendations: [] };
    if (process.env.GEMINI_API_KEY) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: "application/json"
          }
        });
        aiData = JSON.parse(response.text);
      } catch (e) {
        console.error('Gemini error:', e);
        aiData = {
          healthScore: completionRate,
          insights: ["Failed to generate insights from AI.", "Check backend logs."],
          recommendations: ["Ensure API key is valid and quota is available."]
        };
      }
    } else {
      // Fallback if no API key
      aiData = {
        healthScore: Math.max(0, completionRate - (overdueTasks * 2)),
        insights: [
          "Gemini API key is not configured.",
          "Please add GEMINI_API_KEY to your .env file to enable AI insights.",
          `You have a completion rate of ${completionRate}%.`
        ],
        recommendations: [
          "Configure your GEMINI_API_KEY.",
          "Clear out your backlog of overdue tasks."
        ]
      };
    }

    res.json({
      metrics: {
        totalTasks,
        completedTasks,
        overdueTasks,
        completionRate,
        activeProjects,
        statusDistribution: [
          { name: 'To Do', value: statusDist.TODO },
          { name: 'In Progress', value: statusDist.IN_PROGRESS },
          { name: 'Done', value: statusDist.DONE }
        ]
      },
      ai: aiData
    });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ error: 'Failed to generate analytics' });
  }
};

module.exports = { getAnalyticsInsights };
