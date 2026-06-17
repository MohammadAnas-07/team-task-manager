import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderPlus, ArrowLeft } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { motion } from 'framer-motion';

export default function CreateProject() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/api/projects', { name, description });
      toast.success('Project created successfully!');
      navigate(`/projects/${data.project.id}`);
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to create project';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-[560px] mx-auto pt-6 pb-12"
    >
      {/* Back button */}
      <button
        onClick={() => navigate('/projects')}
        className="flex items-center gap-2 text-apple-body-muted hover:text-apple-on-dark text-[14px] mb-8 transition-colors tracking-[-0.224px] font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to projects
      </button>

      <div className="bg-apple-surface-tile-1 border border-apple-surface-tile-2 rounded-[24px] p-8 shadow-product">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-[11px] bg-apple-primary/10 flex items-center justify-center border border-apple-primary/20">
            <FolderPlus className="w-6 h-6 text-apple-primary" />
          </div>
          <div>
            <h1 className="text-[24px] font-semibold text-apple-on-dark tracking-tight">Create New Project</h1>
            <p className="text-[14px] text-apple-body-muted mt-1 tracking-[-0.224px]">You'll be the administrator</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" id="create-project-form">
          <div>
            <label htmlFor="project-name" className="label">Project Name *</label>
            <input
              id="project-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Website Redesign"
              className="input-field text-[17px] font-semibold"
              required
              minLength={2}
              maxLength={100}
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="project-description" className="label">Description</label>
            <textarea
              id="project-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this project about?"
              rows={4}
              className="input-field resize-none"
              maxLength={500}
            />
            <p className="text-[12px] text-apple-ink-muted-48 mt-2 tracking-[-0.12px] text-right">{description.length}/500</p>
          </div>

          <div className="flex gap-4 pt-4 border-t border-apple-surface-tile-2">
            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="btn-secondary flex-1 justify-center"
            >
              Cancel
            </button>
            <button
              id="create-project-submit"
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 justify-center"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
