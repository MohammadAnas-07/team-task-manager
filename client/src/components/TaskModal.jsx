import { useState, useEffect } from 'react';
import { X, Calendar, User, Flag, FileText, Tag } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';

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

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            id="task-modal-close"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4" id="task-form">
          {/* Title */}
          <div>
            <label htmlFor="task-title" className="label">
              <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> Title *</span>
            </label>
            <input
              id="task-title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              placeholder="What needs to be done?"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="task-description" className="label">
              <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Description</span>
            </label>
            <textarea
              id="task-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="input-field resize-none"
              placeholder="Add more details..."
            />
          </div>

          {/* Priority + Status grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="task-priority" className="label">
                <span className="flex items-center gap-1.5"><Flag className="w-3.5 h-3.5" /> Priority</span>
              </label>
              <select
                id="task-priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="input-field"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
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
                  className="input-field"
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
            )}
          </div>

          {/* Assignee */}
          <div>
            <label htmlFor="task-assignee" className="label">
              <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Assignee</span>
            </label>
            <select
              id="task-assignee"
              name="assigneeId"
              value={formData.assigneeId}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Unassigned</option>
              {members.map((member) => (
                <option key={member.user.id} value={member.user.id}>
                  {member.user.name} ({member.user.email})
                </option>
              ))}
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label htmlFor="task-due-date" className="label">
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Due Date</span>
            </label>
            <input
              id="task-due-date"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
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
              {loading ? <LoadingSpinner size="sm" /> : isEditing ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
