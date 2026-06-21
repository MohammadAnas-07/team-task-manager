const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const extractTasksFromNotes = async (req, res) => {
  try {
    const { notes } = req.body;

    if (!notes) {
      return res.status(400).json({ error: 'Notes are required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key is not configured' });
    }

    const prompt = `
You are an AI assistant that extracts actionable tasks from meeting notes.
Analyze the following meeting notes and extract a list of tasks.
For each task, provide:
- title: A short, descriptive title
- description: Details about the task
- assigneeName: Name of the person assigned to the task (or null if unassigned)
- priority: LOW, MEDIUM, or HIGH
- dueDate: Extract the due date if mentioned (ISO 8601 format), or null
- estimatedEffort: A string like "2 hours", "1 day", or null

Meeting Notes:
${notes}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY",
          description: "List of tasks extracted from the meeting notes",
          items: {
            type: "OBJECT",
            properties: {
              title: {
                type: "STRING",
                description: "Short descriptive title of the task"
              },
              description: {
                type: "STRING",
                description: "Detailed description"
              },
              assigneeName: {
                type: "STRING",
                description: "Name of the assigned person, if any",
                nullable: true
              },
              priority: {
                type: "STRING",
                description: "Priority of the task",
                enum: ["LOW", "MEDIUM", "HIGH"]
              },
              dueDate: {
                type: "STRING",
                description: "Due date in ISO 8601 format, if any",
                nullable: true
              },
              estimatedEffort: {
                type: "STRING",
                description: "Estimated effort string, if any",
                nullable: true
              }
            },
            required: ["title", "description", "priority"]
          }
        }
      }
    });

    const tasks = JSON.parse(response.text);

    res.json({ tasks });
  } catch (err) {
    console.error('Extract tasks error:', err);
    res.status(500).json({ error: 'Failed to process meeting notes' });
  }
};

module.exports = { extractTasksFromNotes };
