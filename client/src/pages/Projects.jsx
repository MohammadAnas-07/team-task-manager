import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FolderOpen, Plus, Users, CheckSquare, AlertCircle, ChevronRight, Layers } from 'lucide-react';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { motion } from 'framer-motion';

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
      className="max-w-[1068px] mx-auto pb-12"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8 mt-4">
        <div>
          <h1 className="text-[40px] font-semibold text-theme-text leading-tight tracking-tight">Your Projects</h1>
          <p className="text-[21px] text-theme-text-secondary mt-2 tracking-[0.231px]">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/projects/new" id="new-project-btn" className="btn-primary">
          <Plus className="w-5 h-5" />
          New Project
        </Link>
      </div>

      {/* Projects grid */}
      {projects.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-dashed border-theme-border-hover rounded-[24px] p-16 text-center mt-12"
        >
          <Layers className="w-16 h-16 text-gray-400 mx-auto mb-6" />
          <h3 className="text-theme-text font-semibold text-[28px] tracking-tight mb-3">No projects yet</h3>
          <p className="text-[17px] text-theme-text-secondary mb-8 tracking-[-0.374px] max-w-md mx-auto">
            Create your first project to start organizing tasks and collaborating with your team.
          </p>
          <Link to="/projects/new" className="btn-primary inline-flex">
            <Plus className="w-5 h-5" />
            Create Project
          </Link>
        </motion.div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={project.id}
            >
              <Link
                to={`/projects/${project.id}`}
                id={`project-card-${project.id}`}
                className="bg-white border border-theme-border rounded-[24px] p-6 hover:border-theme-border-hover transition-colors duration-300 group block h-full flex flex-col shadow-product"
              >
                {/* Project icon + name */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-12 h-12 rounded-[11px] bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <FolderOpen className="w-6 h-6 text-theme-primary" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-theme-text-secondary group-hover:text-theme-text transition-colors mt-1" />
                </div>

                <h3 className="font-semibold text-theme-text text-[21px] tracking-[-0.374px] mb-2 truncate">{project.name}</h3>
                <div className="flex-1">
                  {project.description ? (
                    <p className="text-[14px] text-theme-text-secondary line-clamp-2 tracking-[-0.224px] leading-relaxed">{project.description}</p>
                  ) : (
                    <p className="text-[14px] text-gray-400 italic tracking-[-0.224px]">No description</p>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-5 mt-6 pt-5 border-t border-theme-border">
                  <div className="flex items-center gap-2 text-[14px] font-medium text-theme-text-secondary tracking-[-0.224px]">
                    <Users className="w-4 h-4" />
                    <span>{project._count?.members ?? 0}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[14px] font-medium text-theme-text-secondary tracking-[-0.224px]">
                    <CheckSquare className="w-4 h-4" />
                    <span>{project._count?.tasks ?? 0}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
