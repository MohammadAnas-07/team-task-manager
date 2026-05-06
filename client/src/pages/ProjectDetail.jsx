import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Settings,
  Trash2,
  Plus,
  Filter,
  Users,
  CheckSquare,
  AlertCircle,
  FolderOpen,
  ChevronDown,
  Edit3,
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import MemberList from '../components/MemberList';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'TODO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'DONE', label: 'Done' },
];

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [error, setError] = useState(null);

  const [statusFilter, setStatusFilter] = useState('');
  const [activeTab, setActiveTab] = useState('tasks');

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [editingProject, setEditingProject] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // Derived state
  const members = project?.members || [];
  const currentMembership = members.find((m) => m.user.id === user?.id);
  const isAdmin =
    project?.ownerId === user?.id ||
    currentMembership?.role === 'ADMIN';

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await api.get(`/api/projects/${id}`);
        setProject(data.project);
        setEditName(data.project.name);
        setEditDescription(data.project.description || '');
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  useEffect(() => {
    if (!project) return;
    const fetchTasks = async () => {
      setTasksLoading(true);
      try {
        const params = new URLSearchParams();
        if (statusFilter) params.append('status', statusFilter);
        const { data } = await api.get(`/api/projects/${id}/tasks?${params}`);
        setTasks(data.tasks);
      } catch (err) {
        toast.error('Failed to load tasks');
      } finally {
        setTasksLoading(false);
      }
    };
    fetchTasks();
  }, [id, project, statusFilter]);

  const handleTaskSuccess = (task, mode) => {
    if (mode === 'create') {
      setTasks((prev) => [task, ...prev]);
    } else {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
    }
  };

  const handleDeleteTask = async (task) => {
    if (!window.confirm(`Delete task "${task.title}"?`)) return;
    try {
      await api.delete(`/api/projects/${id}/tasks/${task.id}`);
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
      toast.success('Task deleted');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete task');
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskModalOpen(true);
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const { data } = await api.put(`/api/projects/${id}`, {
        name: editName,
        description: editDescription,
      });
      setProject((prev) => ({ ...prev, name: data.project.name, description: data.project.description }));
      toast.success('Project updated');
      setEditingProject(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update project');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm(`Delete project "${project.name}"? This will delete all tasks and members.`)) return;
    try {
      await api.delete(`/api/projects/${id}`);
      toast.success('Project deleted');
      navigate('/projects');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete project');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <AlertCircle className="w-10 h-10 text-red-400" />
        <p className="text-red-400 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Project Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        {editingProject ? (
          <form onSubmit={handleSaveProject} className="space-y-3" id="edit-project-form">
            <div>
              <label className="label">Project Name</label>
              <input
                id="edit-project-name"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="input-field"
                required
                autoFocus
              />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea
                id="edit-project-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={2}
                className="input-field resize-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditingProject(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                id="save-project-btn"
                type="submit"
                disabled={editLoading}
                className="btn-primary"
              >
                {editLoading ? <LoadingSpinner size="sm" /> : 'Save'}
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                <FolderOpen className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{project.name}</h1>
                {project.description && (
                  <p className="text-slate-400 text-sm mt-1">{project.description}</p>
                )}
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {members.length} member{members.length !== 1 ? 's' : ''}
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckSquare className="w-3.5 h-3.5" />
                    {tasks.length} task{tasks.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>

            {isAdmin && (
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  id="edit-project-btn"
                  onClick={() => setEditingProject(true)}
                  className="btn-secondary gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  id="delete-project-btn"
                  onClick={handleDeleteProject}
                  className="btn-danger gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
        <button
          id="tab-tasks"
          onClick={() => setActiveTab('tasks')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'tasks'
              ? 'bg-blue-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          Tasks
        </button>
        <button
          id="tab-members"
          onClick={() => setActiveTab('members')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'members'
              ? 'bg-blue-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          Members ({members.length})
        </button>
      </div>

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          {/* Filter bar + Add task */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-slate-500" />
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.value}
                  id={`filter-${f.value || 'all'}`}
                  onClick={() => setStatusFilter(f.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    statusFilter === f.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <button
              id="add-task-btn"
              onClick={() => { setEditingTask(null); setTaskModalOpen(true); }}
              className="btn-primary sm:ml-auto"
            >
              <Plus className="w-4 h-4" />
              Add Task
            </button>
          </div>

          {/* Task list */}
          {tasksLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="md" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="bg-slate-900 border border-dashed border-slate-700 rounded-xl p-12 text-center">
              <CheckSquare className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-white font-medium mb-1">
                {statusFilter ? `No ${statusFilter.toLowerCase().replace('_', ' ')} tasks` : 'No tasks yet'}
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                {statusFilter ? 'Try a different filter' : 'Add your first task to get started'}
              </p>
              {!statusFilter && (
                <button
                  onClick={() => { setEditingTask(null); setTaskModalOpen(true); }}
                  className="btn-primary inline-flex"
                >
                  <Plus className="w-4 h-4" />
                  Add Task
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isAdmin={isAdmin}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onClick={isAdmin ? handleEditTask : undefined}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="font-semibold text-white mb-4">Project Members</h3>
          <MemberList
            members={members}
            projectId={id}
            isAdmin={isAdmin}
            onMembersChange={(updatedMembers) =>
              setProject((prev) => ({ ...prev, members: updatedMembers }))
            }
          />
        </div>
      )}

      {/* Task Modal */}
      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => { setTaskModalOpen(false); setEditingTask(null); }}
        onSuccess={handleTaskSuccess}
        projectId={id}
        members={members}
        task={editingTask}
      />
    </div>
  );
}
