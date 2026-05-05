import { useState, useEffect } from 'react';
import {
  CheckSquare,
  Clock,
  ListTodo,
  CheckCircle2,
  FolderOpen,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import api from '../api/axios';
import StatsCard from '../components/StatsCard';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get('/dashboard');
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
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
          subtitle={`${stats.projectCount} projects`}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Overdue Tasks */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <h3 className="font-semibold text-white">Overdue Tasks</h3>
            {stats.overdueTasks.length > 0 && (
              <span className="ml-auto px-2 py-0.5 rounded-full text-xs bg-red-500/15 text-red-400 border border-red-500/30">
                {stats.overdueTasks.length}
              </span>
            )}
          </div>

          {stats.overdueTasks.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">No overdue tasks! 🎉</p>
            </div>
          ) : (
            <div className="space-y-2">
              {stats.overdueTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start justify-between gap-3 p-3 bg-red-950/20 border border-red-900/30 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-red-300 truncate">{task.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{task.project?.name}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-red-400 flex-shrink-0">
                    <Calendar className="w-3 h-3" />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Tasks */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-blue-400" />
            <h3 className="font-semibold text-white">Recent Tasks</h3>
          </div>

          {stats.recentTasks.length === 0 ? (
            <div className="text-center py-8">
              <ListTodo className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">No tasks assigned yet</p>
              <Link to="/projects" className="text-blue-400 hover:text-blue-300 text-sm mt-1 inline-block">
                Browse projects →
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {stats.recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between gap-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{task.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{task.project?.name}</p>
                  </div>
                  <StatusBadge type="status" value={task.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Projects quick link */}
      {stats.projectCount === 0 && (
        <div className="bg-slate-900 border border-dashed border-slate-700 rounded-xl p-8 text-center">
          <FolderOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-white font-medium mb-1">No projects yet</h3>
          <p className="text-slate-400 text-sm mb-4">Create your first project to get started</p>
          <Link to="/projects/new" className="btn-primary inline-flex">
            Create a project
          </Link>
        </div>
      )}
    </div>
  );
}
