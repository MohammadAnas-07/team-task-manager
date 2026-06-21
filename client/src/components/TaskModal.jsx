import { useState, useEffect } from 'react';
import { X, Calendar, User, Flag, FileText, Tag } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';

export default function TaskModal({ isOpen, onClose, onSuccess, projectId, members, task }) {
  const isEditing = !!task;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    status: 'TODO',
    assigneeId: '',
    dueDate: '',
  });
  const [loading, setLoading] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'MEDIUM',
        status: task.status || 'TODO',
        assigneeId: task.assigneeId || '',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'MEDIUM',
        status: 'TODO',
        assigneeId: '',
        dueDate: '',
      });
    }
  }, [task, isOpen]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title: formData.title,
      description: formData.description || undefined,
      priority: formData.priority,
      status: formData.status,
      assigneeId: formData.assigneeId || null,
      dueDate: formData.dueDate || null,
    };

    try {
      if (isEditing) {
        const { data } = await api.put(`/api/projects/${projectId}/tasks/${task.id}`, payload);
        toast.success('Task updated successfully');
        onSuccess(data.task, 'update');
      } else {
        const { data } = await api.post(`/api/projects/${projectId}/tasks`, payload);
        toast.success('Task created successfully');
        onSuccess(data.task, 'create');
      }
      onClose();
    } catch (err) {
      const message = err.response?.data?.error || 'Operation failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white border border-theme-border rounded-[24px] shadow-product max-h-[90vh] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-theme-border shrink-0">
              <h2 className="text-[21px] font-semibold text-theme-text tracking-[-0.374px]">
                {isEditing ? 'Edit Task' : 'New Task'}
              </h2>
              <button
                id="task-modal-close"
                onClick={onClose}
                className="btn-icon"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto" id="task-form">
              {/* Title */}
              <div>
                <label htmlFor="task-title" className="label">
                  <span className="flex items-center gap-1.5"><Tag className="w-4 h-4" /> Title *</span>
                </label>
                <input
                  id="task-title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  className="input-field text-[17px] font-semibold"
                  placeholder="Task name"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="task-description" className="label">
                  <span className="flex items-center gap-1.5"><FileText className="w-4 h-4" /> Description</span>
                </label>
                <textarea
                  id="task-description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="input-field resize-none"
                  placeholder="Add details, links, or context..."
                />
              </div>

              {/* Priority + Status grid */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="task-priority" className="label">
                    <span className="flex items-center gap-1.5"><Flag className="w-4 h-4" /> Priority</span>
                  </label>
                  <select
                    id="task-priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="input-field appearance-none bg-no-repeat bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23cccccc%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[position:right_16px_center] bg-[size:16px]"
                  >
                    <option value="LOW">Low Priority</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="HIGH">High Priority</option>
                  </select>
                </div>

                {isEditing && (
                  <div>
                    <label htmlFor="task-status" className="label">Status</label>
                    <select
                      id="task-status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="input-field appearance-none bg-no-repeat bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23cccccc%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[position:right_16px_center] bg-[size:16px]"
                    >
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="DONE">Done</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Assignee & Due Date Grid */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="task-assignee" className="label">
                    <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> Assignee</span>
                  </label>
                  <select
                    id="task-assignee"
                    name="assigneeId"
                    value={formData.assigneeId}
                    onChange={handleChange}
                    className="input-field appearance-none bg-no-repeat bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23cccccc%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[position:right_16px_center] bg-[size:16px]"
                  >
                    <option value="">Unassigned</option>
                    {members.map((member) => (
                      <option key={member.user.id} value={member.user.id}>
                        {member.user.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="task-due-date" className="label">
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Due Date</span>
                  </label>
                  <input
                    id="task-due-date"
                    name="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="input-field [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-6 mt-6 border-t border-theme-border">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary flex-1 justify-center"
                >
                  Cancel
                </button>
                <button
                  id="task-form-submit"
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1 justify-center"
                >
                  {loading ? <LoadingSpinner size="sm" /> : isEditing ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
