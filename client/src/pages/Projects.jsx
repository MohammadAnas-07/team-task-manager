import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FolderOpen, Plus, Users, CheckSquare, AlertCircle, ChevronRight } from 'lucide-react';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.get('/api/projects');
        setProjects(data.projects);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

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
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Your Projects</h1>
          <p className="text-slate-400 text-sm mt-0.5">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/projects/new" id="new-project-btn" className="btn-primary">
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </div>

      {/* Projects grid */}
      {projects.length === 0 ? (
        <div className="bg-slate-900 border border-dashed border-slate-700 rounded-xl p-12 text-center">
          <FolderOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-white font-semibold text-lg mb-2">No projects yet</h3>
          <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
            Create your first project to start organizing tasks and collaborating with your team.
          </p>
          <Link to="/projects/new" className="btn-primary inline-flex">
            <Plus className="w-4 h-4" />
            Create your first project
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              id={`project-card-${project.id}`}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-blue-500/50 hover:bg-slate-900/80 transition-all duration-150 group block"
            >
              {/* Project icon + name */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                  <FolderOpen className="w-5 h-5 text-blue-400" />
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors mt-1" />
              </div>

              <h3 className="font-semibold text-white text-base mb-1 truncate">{project.name}</h3>
              {project.description && (
                <p className="text-sm text-slate-400 line-clamp-2 mb-3">{project.description}</p>
              )}

              {/* Stats */}
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Users className="w-3.5 h-3.5" />
                  <span>{project._count?.members ?? 0} member{(project._count?.members ?? 0) !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>{project._count?.tasks ?? 0} task{(project._count?.tasks ?? 0) !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
