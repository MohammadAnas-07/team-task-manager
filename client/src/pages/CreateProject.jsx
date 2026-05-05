import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderPlus, ArrowLeft } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

export default function CreateProject() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/projects', { name, description });
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
    <div className="max-w-xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate('/projects')}
        className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to projects
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
            <FolderPlus className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Create New Project</h1>
            <p className="text-slate-400 text-sm">You'll be the admin</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" id="create-project-form">
          <div>
            <label htmlFor="project-name" className="label">Project Name *</label>
            <input
              id="project-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Website Redesign"
              className="input-field"
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
            <p className="text-xs text-slate-600 mt-1">{description.length}/500</p>
          </div>

          <div className="flex gap-3 pt-2">
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
    </div>
  );
}
