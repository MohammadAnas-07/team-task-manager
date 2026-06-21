import { useState, useEffect } from 'react';
import {
  CheckSquare,
  Clock,
  ListTodo,
  CheckCircle2,
  FolderOpen,
  AlertCircle,
  Calendar,
  Layers
} from 'lucide-react';
import api from '../api/axios';
import StatsCard from '../components/StatsCard';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get('/api/dashboard');
        setStats(data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
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
      className="max-w-[1068px] mx-auto space-y-8 pb-12"
    >
      {/* Welcome Header */}
      <div className="mb-10 mt-4">
        <h1 className="text-[40px] font-semibold text-theme-text leading-tight tracking-tight">
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-[21px] text-theme-text-secondary mt-2 tracking-[0.231px]">
          Here is what's happening across your projects today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Total Tasks"
          value={stats.totalTasks}
          icon={CheckSquare}
          color="blue"
          subtitle="Assigned to you"
        />
        <StatsCard
          title="To Do"
          value={stats.todoCount}
          icon={ListTodo}
          color="purple"
        />
        <StatsCard
          title="In Progress"
          value={stats.inProgressCount}
          icon={Clock}
          color="amber"
        />
        <StatsCard
          title="Done"
          value={stats.doneCount}
          icon={CheckCircle2}
          color="green"
          subtitle={`${stats.projectCount} active projects`}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 pt-4">
        {/* Overdue Tasks */}
        <div className="bg-white border border-theme-border rounded-[24px] p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-[11px] bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <h3 className="text-[21px] font-semibold text-theme-text tracking-[-0.374px]">Overdue</h3>
            {stats.overdueTasks.length > 0 && (
              <span className="ml-auto px-3 py-1 rounded-[8px] text-[14px] font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                {stats.overdueTasks.length}
              </span>
            )}
          </div>

          {stats.overdueTasks.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-12 h-12 text-theme-primary mx-auto mb-4 opacity-50" />
              <p className="text-theme-text-secondary text-[17px] tracking-[-0.374px]">No overdue tasks. Great job!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.overdueTasks.map((task) => (
                <motion.div
                  whileHover={{ x: 4 }}
                  key={task.id}
                  className="flex items-center justify-between gap-4 p-4 bg-theme-secondary rounded-[14px] border border-theme-border-hover"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[17px] font-semibold text-theme-text truncate tracking-[-0.374px]">{task.title}</p>
                    <p className="text-[14px] text-theme-text-secondary mt-1 tracking-[-0.224px]">{task.project?.name}</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px] bg-red-500/10 text-[12px] font-medium text-red-400 flex-shrink-0 border border-red-500/20">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Tasks */}
        <div className="bg-white border border-theme-border rounded-[24px] p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-[11px] bg-gray-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-theme-primary" />
            </div>
            <h3 className="text-[21px] font-semibold text-theme-text tracking-[-0.374px]">Recent Activity</h3>
          </div>

          {stats.recentTasks.length === 0 ? (
            <div className="text-center py-12">
              <Layers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-theme-text-secondary text-[17px] tracking-[-0.374px] mb-4">No recent tasks found</p>
              <Link to="/projects" className="btn-secondary">
                Browse projects
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentTasks.map((task) => (
                <motion.div
                  whileHover={{ x: 4 }}
                  key={task.id}
                  className="flex items-center justify-between gap-4 p-4 bg-theme-secondary rounded-[14px] border border-transparent hover:border-theme-border-hover"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[17px] font-semibold text-theme-text truncate tracking-[-0.374px]">{task.title}</p>
                    <p className="text-[14px] text-theme-text-secondary mt-1 tracking-[-0.224px]">{task.project?.name}</p>
                  </div>
                  <StatusBadge type="status" value={task.status} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Projects quick link */}
      {stats.projectCount === 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-dashed border-theme-border-hover rounded-[24px] p-12 text-center"
        >
          <FolderOpen className="w-12 h-12 text-theme-primary mx-auto mb-4" />
          <h3 className="text-[21px] text-theme-text font-semibold tracking-[-0.374px] mb-2">No projects yet</h3>
          <p className="text-[17px] text-theme-text-secondary mb-8 tracking-[-0.374px]">Create your first project to organize tasks and team members.</p>
          <Link to="/projects/new" className="btn-primary">
            Create a project
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
}
