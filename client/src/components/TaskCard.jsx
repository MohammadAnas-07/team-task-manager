import { Calendar, AlertCircle } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { motion } from 'framer-motion';

export default function TaskCard({ task, onClick, onEdit, onDelete, isAdmin }) {
  const isOverdue =
    task.dueDate &&
    task.status !== 'DONE' &&
    new Date(task.dueDate) < new Date();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      id={`task-card-${task.id}`}
      className="bg-apple-surface-tile-1 border border-apple-surface-tile-2 rounded-[18px] p-5 hover:border-apple-surface-tile-3 transition-colors duration-300 cursor-pointer group"
      onClick={() => onClick && onClick(task)}
    >
      {/* Top row: title + badges */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <StatusBadge type="priority" value={task.priority} />
            <StatusBadge type="status" value={task.status} />
            {task.project?.name && (
              <span className="px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase bg-apple-surface-tile-2 text-apple-body-muted rounded-[6px] border border-apple-surface-tile-3">
                {task.project.name}
              </span>
            )}
          </div>
          <h3 className={`text-[17px] font-semibold tracking-[-0.374px] ${isOverdue ? 'text-red-400' : 'text-apple-on-dark'} leading-snug`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-[14px] text-apple-body-muted mt-2 line-clamp-2 tracking-[-0.224px]">{task.description}</p>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between gap-2 mt-5 pt-4 border-t border-apple-surface-tile-2">
        <div className="flex items-center gap-3 text-[12px] text-apple-body-muted font-normal tracking-[-0.12px]">
          {task.assignee && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-apple-surface-tile-3 flex items-center justify-center text-apple-on-dark font-semibold border border-apple-surface-tile-2">
                {task.assignee.name.charAt(0).toUpperCase()}
              </div>
              <span className="truncate max-w-[100px]">{task.assignee.name}</span>
            </div>
          )}
          {task.dueDate && (
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-[5px] ${isOverdue ? 'bg-red-500/10 text-red-400' : 'bg-apple-surface-tile-2'}`}>
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {isAdmin && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              id={`edit-task-${task.id}`}
              onClick={(e) => { e.stopPropagation(); onEdit && onEdit(task); }}
              className="px-3 py-1.5 text-[12px] font-medium text-apple-primary hover:bg-apple-primary/10 rounded-[8px] transition-colors"
            >
              Edit
            </button>
            <button
              id={`delete-task-${task.id}`}
              onClick={(e) => { e.stopPropagation(); onDelete && onDelete(task); }}
              className="px-3 py-1.5 text-[12px] font-medium text-red-400 hover:bg-red-500/10 rounded-[8px] transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
