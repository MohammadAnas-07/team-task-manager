import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Bot, Trash2, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function AiMeetingAssistant() {
  const [notes, setNotes] = useState('');
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [creating, setCreating] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.get('/api/projects');
        setProjects(data.projects);
        if (data.projects.length > 0) {
          setSelectedProjectId(data.projects[0].id);
        }
      } catch (err) {
        toast.error('Failed to load projects');
      }
    };
    fetchProjects();
  }, []);

  const handleAnalyze = async () => {
    if (!notes.trim()) {
      toast.error('Please enter some meeting notes');
      return;
    }
    setAnalyzing(true);
    try {
      const { data } = await api.post('/api/ai/meeting-notes', { notes });
      setTasks(data.tasks);
      toast.success('Successfully analyzed notes');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to analyze notes. Ensure GEMINI_API_KEY is configured.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCreateTasks = async () => {
    if (!selectedProjectId) {
      toast.error('Please select a project');
      return;
    }
    setCreating(true);
    let successCount = 0;

    try {
      // First fetch members to map assignee names to IDs
      const { data: project } = await api.get(`/api/projects/${selectedProjectId}`);
      const members = project.members || [];
      const owner = project.owner;
      
      const findAssigneeId = (name) => {
        if (!name) return null;
        const normalizedName = name.toLowerCase();
        
        // Check owner
        if (owner && owner.name.toLowerCase().includes(normalizedName)) return owner.id;
        
        // Check members
        for (const m of members) {
          if (m.user && m.user.name.toLowerCase().includes(normalizedName)) {
            return m.user.id;
          }
        }
        return null;
      };

      for (const t of tasks) {
        const assigneeId = findAssigneeId(t.assigneeName);
        
        await api.post(`/api/projects/${selectedProjectId}/tasks`, {
          title: t.title,
          description: t.description + (t.estimatedEffort ? `\n\nEstimated Effort: ${t.estimatedEffort}` : ''),
          priority: t.priority || 'MEDIUM',
          dueDate: t.dueDate,
          assigneeId: assigneeId
        });
        successCount++;
      }
      toast.success(`Created ${successCount} tasks successfully`);
      setTasks([]);
      setNotes('');
    } catch (err) {
      console.error(err);
      toast.error(`Failed after creating ${successCount} tasks`);
    } finally {
      setCreating(false);
    }
  };

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[1068px] mx-auto space-y-6 pb-12"
    >
      <div className="mb-8 mt-4">
        <h1 className="text-[40px] font-semibold text-theme-text leading-tight tracking-tight flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-theme-primary" />
          AI Meeting Assistant
        </h1>
        <p className="text-[21px] text-theme-text-secondary mt-2 tracking-[0.231px]">
          Turn your raw meeting notes into actionable tasks instantly.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Side: Input */}
        <div className="bg-white border border-theme-border rounded-[24px] p-6 shadow-sm flex flex-col h-[600px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[17px] font-semibold text-theme-text tracking-[-0.374px]">Meeting Notes</h3>
            <button 
              onClick={() => setNotes('')}
              className="text-[14px] text-theme-text-secondary hover:text-theme-text"
            >
              Clear
            </button>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste your meeting transcript or raw notes here..."
            className="flex-1 w-full p-4 bg-theme-bg border border-theme-border rounded-[14px] resize-none text-[15px] focus:outline-none focus:ring-2 focus:ring-theme-primary transition-all text-theme-text"
          />
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleAnalyze}
              disabled={analyzing || !notes.trim()}
              className="btn-primary w-full sm:w-auto"
            >
              {analyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Bot className="w-5 h-5" />}
              Analyze Notes
            </button>
          </div>
        </div>

        {/* Right Side: Output */}
        <div className="bg-white border border-theme-border rounded-[24px] p-6 shadow-sm flex flex-col h-[600px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[17px] font-semibold text-theme-text tracking-[-0.374px]">Generated Tasks</h3>
            <span className="text-[14px] text-theme-text-secondary bg-theme-secondary px-2 py-1 rounded-[8px]">
              {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {tasks.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-theme-text-secondary">
                <Bot className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-[15px] text-center max-w-[250px]">
                  Paste your notes and click Analyze to see AI-suggested tasks here.
                </p>
              </div>
            ) : (
              tasks.map((task, i) => (
                <div key={i} className="bg-theme-bg border border-theme-border rounded-[14px] p-4 group">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-theme-text text-[15px]">{task.title}</h4>
                    <button 
                      onClick={() => removeTask(i)}
                      className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[13px] text-theme-text-secondary mt-1 line-clamp-2">{task.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <span className="text-[11px] font-medium px-2 py-1 bg-theme-secondary text-theme-text rounded-[6px]">
                      {task.priority || 'MEDIUM'}
                    </span>
                    {task.assigneeName && (
                      <span className="text-[11px] font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded-[6px]">
                        @{task.assigneeName}
                      </span>
                    )}
                    {task.dueDate && (
                      <span className="text-[11px] font-medium px-2 py-1 bg-orange-50 text-orange-600 rounded-[6px]">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {tasks.length > 0 && (
            <div className="mt-4 pt-4 border-t border-theme-border">
              <div className="mb-3">
                <label className="block text-[13px] font-semibold text-theme-text-secondary mb-1">
                  Add to Project
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full px-3 py-2 bg-theme-bg border border-theme-border rounded-[8px] text-[14px] focus:outline-none focus:border-theme-primary"
                >
                  <option value="" disabled>Select a project...</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleCreateTasks}
                disabled={creating || !selectedProjectId}
                className="btn-primary w-full justify-between"
              >
                {creating ? (
                  <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Creating...</span>
                ) : (
                  <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Create All Tasks</span>
                )}
                {!creating && <ArrowRight className="w-5 h-5" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
