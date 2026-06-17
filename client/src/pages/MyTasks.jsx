import { useState, useEffect } from 'react';
import {
  CheckSquare,
  AlertCircle,
  LayoutList,
  KanbanSquare,
  Filter
} from 'lucide-react';
import api from '../api/axios';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import LoadingSpinner from '../components/LoadingSpinner';
import KanbanBoard from '../components/KanbanBoard';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { DragDropContext } from '@hello-pangea/dnd';

const STATUS_FILTERS = [
  { value: '', label: 'All Tasks' },
  { value: 'TODO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'DONE', label: 'Done' },
];

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'board'

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (statusFilter && viewMode === 'list') {
          params.append('status', statusFilter);
        }
        const { data } = await api.get(`/api/dashboard/tasks?${params}`);
        setTasks(data.tasks);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load tasks');
        toast.error('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [statusFilter, viewMode]);

  const handleTaskSuccess = (task, mode) => {
    // If the task was edited and is no longer assigned to me, we could filter it out.
    // For simplicity, just update it in place.
    if (mode === 'create') {
      setTasks((prev) => [task, ...prev]);
    } else {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
    }
  };

  const handleDeleteTask = async (task) => {
    if (!window.confirm(`Delete task "${task.title}"?`)) return;
    try {
      await api.delete(`/api/projects/${task.projectId}/tasks/${task.id}`);
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

    // Optimistic update
    const previousTasks = [...tasks];
    setTasks(prev => prev.map(t => t.id === draggableId ? { ...t, status: newStatus } : t));

    try {
      // Need projectId for the API call
      await api.put(`/api/projects/${taskToMove.projectId}/tasks/${draggableId}`, { status: newStatus });
    } catch (err) {
      // Revert on failure
      setTasks(previousTasks);
      toast.error(err.response?.data?.error || 'Failed to update task status');
    }
  };

  if (loading && tasks.length === 0) {
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
      <div className="flex items-center justify-between mb-8 mt-4">
        <div>
          <h1 className="text-[28px] font-semibold text-apple-on-dark tracking-tight leading-tight">My Tasks</h1>
          <p className="text-[14px] text-apple-body-muted mt-1 tracking-[-0.224px]">View all tasks assigned to you across all projects</p>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="space-y-6">
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
          </div>

          {/* Task list / board */}
          {tasks.length === 0 && viewMode === 'list' ? (
            <div className="bg-apple-surface-tile-1 border border-dashed border-apple-surface-tile-3 rounded-[24px] p-16 text-center mt-8">
              <CheckSquare className="w-12 h-12 text-apple-ink-muted-48 mx-auto mb-4" />
              <h3 className="text-apple-on-dark font-semibold text-[21px] tracking-tight mb-2">
                {statusFilter ? `No ${statusFilter.toLowerCase().replace('_', ' ')} tasks` : 'No tasks yet'}
              </h3>
              <p className="text-apple-body-muted text-[17px] tracking-[-0.374px]">
                {statusFilter ? 'Try a different filter.' : "You don't have any assigned tasks."}
              </p>
            </div>
          ) : viewMode === 'list' ? (
            <div className="grid gap-4">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isAdmin={true} // Allow editing assigned tasks
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onClick={handleEditTask}
                />
              ))}
            </div>
          ) : (
            <KanbanBoard 
              tasks={tasks}
              isAdmin={true} // Allow editing assigned tasks
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          )}
        </div>
      </DragDropContext>

      {/* Task Modal */}
      {editingTask && (
        <TaskModal
          isOpen={taskModalOpen}
          onClose={() => { setTaskModalOpen(false); setEditingTask(null); }}
          onSuccess={handleTaskSuccess}
          projectId={editingTask.projectId}
          members={[{ user: editingTask.assignee, role: 'MEMBER' }]} // Minimal mock for members if needed
          task={editingTask}
        />
      )}
    </motion.div>
  );
}
