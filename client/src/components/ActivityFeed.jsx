import { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { 
  FolderKanban, 
  UserPlus, 
  UserMinus, 
  CheckSquare, 
  Edit3, 
  CheckCircle2,
  Clock
} from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const iconMap = {
  PROJECT_CREATED: FolderKanban,
  MEMBER_ADDED: UserPlus,
  MEMBER_REMOVED: UserMinus,
  TASK_CREATED: CheckSquare,
  TASK_UPDATED: Edit3,
  TASK_COMPLETED: CheckCircle2,
};

const colorMap = {
  PROJECT_CREATED: 'bg-blue-50 text-blue-600',
  MEMBER_ADDED: 'bg-green-50 text-green-600',
  MEMBER_REMOVED: 'bg-red-50 text-red-600',
  TASK_CREATED: 'bg-purple-50 text-purple-600',
  TASK_UPDATED: 'bg-orange-50 text-orange-600',
  TASK_COMPLETED: 'bg-emerald-50 text-emerald-600',
};

export default function ActivityFeed({ projectId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const { data } = await api.get(`/api/projects/${projectId}/activity`);
        setActivities(data.activities);
      } catch (err) {
        console.error('Failed to fetch activity:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="py-12 text-center text-theme-text-secondary">
        <Clock className="w-12 h-12 mx-auto mb-4 opacity-20" />
        <p className="text-[15px]">No activity recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative border-l border-theme-border ml-4 space-y-6 pb-4">
        {activities.map((activity, index) => {
          const Icon = iconMap[activity.action] || Clock;
          const colorClass = colorMap[activity.action] || 'bg-gray-50 text-gray-600';
          
          return (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              key={activity.id} 
              className="relative pl-8"
            >
              <div className={`absolute -left-4 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white ${colorClass}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              
              <div className="bg-white border border-theme-border rounded-[14px] p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[14px] text-theme-text font-medium">
                      {activity.user ? activity.user.name : 'System'}
                    </p>
                    <p className="text-[13px] text-theme-text-secondary mt-0.5">
                      {activity.details}
                    </p>
                  </div>
                  <span className="text-[11px] text-gray-400 whitespace-nowrap bg-theme-secondary px-2 py-1 rounded-[6px]">
                    {new Date(activity.createdAt).toLocaleString(undefined, {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
