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
  LayoutList,
  KanbanSquare
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import MemberList from '../components/MemberList';
import LoadingSpinner from '../components/LoadingSpinner';
import KanbanBoard from '../components/KanbanBoard';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext } from '@hello-pangea/dnd';

const STATUS_FILTERS = [
  { value: '', label: 'All Tasks' },
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
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'board'

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
        if (statusFilter && viewMode === 'list') {
          // Only apply status filter in list view, board view needs all tasks to show columns
          params.append('status', statusFilter);
        }
        const { data } = await api.get(`/api/projects/${id}/tasks?${params}`);
        setTasks(data.tasks);
      } catch (err) {
        toast.error('Failed to load tasks');
      } finally {
        setTasksLoading(false);
      }
    };
    fetchTasks();
  }, [id, project, statusFilter, viewMode]);

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

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId;
    const taskToMove = tasks.find(t => t.id === draggableId);
    
    if (!taskToMove) return;
    if (taskToMove.status === newStatus) return;

    // Permissions check: Assignee can move their own task, Admin can move any task
    const isAssignee = taskToMove.assigneeId === user?.id;
    if (!isAdmin && !isAssignee) {
      toast.error("You don't have permission to move this task.");
      return;
    }

    // Optimistic update
    const previousTasks = [...tasks];
    setTasks(prev => prev.map(t => t.id === draggableId ? { ...t, status: newStatus } : t));

    try {
      await api.put(`/api/projects/${id}/tasks/${draggableId}`, { status: newStatus });
    } catch (err) {
      // Revert on failure
      setTasks(previousTasks);
      toast.error(err.response?.data?.error || 'Failed to update task status');
    }
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <p className="text-red-400 font-semibold text-[17px] tracking-[-0.374px]">{error}</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-[1068px] mx-auto space-y-8 pb-12"
    >
      {/* Project Header */}
      <div className="bg-apple-surface-tile-1 border border-apple-surface-tile-2 rounded-[24px] p-8 shadow-product mt-4">
        {editingProject ? (
          <form onSubmit={handleSaveProject} className="space-y-5" id="edit-project-form">
            <div>
              <label className="label">Project Name</label>
              <input
                id="edit-project-name"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="input-field text-[17px] font-semibold"
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
                rows={3}
                className="input-field resize-none"
              />
            </div>
            <div className="flex gap-4 pt-2">
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
                {editLoading ? <LoadingSpinner size="sm" /> : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-[14px] bg-apple-primary/10 border border-apple-primary/20 flex items-center justify-center flex-shrink-0">
                <FolderOpen className="w-7 h-7 text-apple-primary" />
              </div>
              <div>
                <h1 className="text-[28px] font-semibold text-apple-on-dark tracking-tight leading-tight">{project.name}</h1>
                {project.description && (
                  <p className="text-[14px] text-apple-body-muted mt-1 tracking-[-0.224px]">{project.description}</p>
                )}
                <div className="flex items-center gap-5 mt-3 text-[14px] font-medium text-apple-body-muted tracking-[-0.224px]">
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {members.length} member{members.length !== 1 ? 's' : ''}
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4" />
                    {tasks.length} task{tasks.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>

            {isAdmin && (
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  id="edit-project-btn"
                  onClick={() => setEditingProject(true)}
                  className="btn-secondary flex-1 md:flex-none justify-center"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Settings
                </button>
                <button
                  id="delete-project-btn"
                  onClick={handleDeleteProject}
                  className="btn-danger flex-1 md:flex-none justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-apple-surface-tile-1 border border-apple-surface-tile-2 rounded-[14px] p-1.5 w-max shadow-sm">
        <button
          id="tab-tasks"
          onClick={() => setActiveTab('tasks')}
          className={`flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-[11px] text-[14px] font-medium transition-all duration-200 ${
            activeTab === 'tasks'
              ? 'bg-apple-surface-tile-2 text-apple-on-dark shadow-product'
              : 'text-apple-body-muted hover:text-apple-on-dark hover:bg-apple-surface-tile-2/50'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          Tasks
        </button>
        <button
          id="tab-members"
          onClick={() => setActiveTab('members')}
          className={`flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-[11px] text-[14px] font-medium transition-all duration-200 ${
            activeTab === 'members'
              ? 'bg-apple-surface-tile-2 text-apple-on-dark shadow-product'
              : 'text-apple-body-muted hover:text-apple-on-dark hover:bg-apple-surface-tile-2/50'
          }`}
        >
          <Users className="w-4 h-4" />
          Members ({members.length})
        </button>
      </div>

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
              
              <div className="flex items-center gap-4">
                {/* View Toggle */}
                <div className="flex items-center p-1 bg-apple-surface-tile-1 border border-apple-surface-tile-2 rounded-[12px] shadow-sm">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-[9px] text-[13px] font-medium transition-all duration-200 ${
                      viewMode === 'list' 
                        ? 'bg-apple-surface-tile-2 text-apple-on-dark shadow-sm' 
                        : 'text-apple-body-muted hover:text-apple-on-dark'
                    }`}
                  >
                    <LayoutList className="w-4 h-4" />
                    List
                  </button>
                  <button
                    onClick={() => setViewMode('board')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-[9px] text-[13px] font-medium transition-all duration-200 ${
                      viewMode === 'board' 
                        ? 'bg-apple-surface-tile-2 text-apple-on-dark shadow-sm' 
                        : 'text-apple-body-muted hover:text-apple-on-dark'
                    }`}
                  >
                    <KanbanSquare className="w-4 h-4" />
                    Board
                  </button>
                </div>

                {/* Filters (only visible in List view) */}
                {viewMode === 'list' && (
                  <div className="hidden sm:flex items-center gap-2 flex-wrap">
                    <Filter className="w-4 h-4 text-apple-ink-muted-48 mr-1" />
                    {STATUS_FILTERS.map((f) => (
                      <button
                        key={f.value}
                        id={`filter-${f.value || 'all'}`}
                        onClick={() => setStatusFilter(f.value)}
                        className={`px-3.5 py-1.5 rounded-[9px] text-[13px] font-medium transition-all duration-200 ${
                          statusFilter === f.value
                            ? 'bg-apple-surface-tile-2 text-apple-on-dark border border-apple-surface-tile-3'
                            : 'bg-transparent text-apple-body-muted border border-transparent hover:text-apple-on-dark hover:bg-apple-surface-tile-2/50'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                id="add-task-btn"
                onClick={() => { setEditingTask(null); setTaskModalOpen(true); }}
                className="btn-primary w-full sm:w-auto justify-center"
              >
                <Plus className="w-4 h-4" />
                New Task
              </button>
            </div>

            {/* Task list / board */}
            {tasksLoading ? (
              <div className="flex justify-center py-24">
                <LoadingSpinner size="md" />
              </div>
            ) : tasks.length === 0 && viewMode === 'list' ? (
              <div className="bg-apple-surface-tile-1 border border-dashed border-apple-surface-tile-3 rounded-[24px] p-16 text-center mt-8">
                <CheckSquare className="w-12 h-12 text-apple-ink-muted-48 mx-auto mb-4" />
                <h3 className="text-apple-on-dark font-semibold text-[21px] tracking-tight mb-2">
                  {statusFilter ? `No ${statusFilter.toLowerCase().replace('_', ' ')} tasks` : 'No tasks yet'}
                </h3>
                <p className="text-apple-body-muted text-[17px] mb-6 tracking-[-0.374px]">
                  {statusFilter ? 'Try a different filter or create a new task.' : 'Add your first task to get started.'}
                </p>
                {!statusFilter && (
                  <button
                    onClick={() => { setEditingTask(null); setTaskModalOpen(true); }}
                    className="btn-primary inline-flex"
                  >
                    <Plus className="w-4 h-4" />
                    Create Task
                  </button>
                )}
              </div>
            ) : viewMode === 'list' ? (
              <div className="grid gap-4">
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
            ) : (
              <KanbanBoard 
                tasks={tasks}
                isAdmin={isAdmin}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            )}
          </motion.div>
        </DragDropContext>
      )}

      {/* Members Tab */}
      {activeTab === 'members' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-apple-surface-tile-1 border border-apple-surface-tile-2 rounded-[24px] p-8 shadow-product"
        >
          <h3 className="text-[21px] font-semibold text-apple-on-dark mb-6 tracking-[-0.374px]">Project Members</h3>
          <MemberList
            members={members}
            projectId={id}
            isAdmin={isAdmin}
            onMembersChange={(updatedMembers) =>
              setProject((prev) => ({ ...prev, members: updatedMembers }))
            }
          />
        </motion.div>
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
    </motion.div>
  );
}
