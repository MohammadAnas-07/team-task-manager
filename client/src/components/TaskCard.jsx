import { Calendar, User, AlertCircle } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function TaskCard({ task, onClick, onEdit, onDelete, isAdmin }) {
  const isOverdue =
    task.dueDate &&
    task.status !== 'DONE' &&
    new Date(task.dueDate) < new Date();

  return (
    <div
      id={`task-card-${task.id}`}
      className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all duration-150 cursor-pointer group"
      onClick={() => onClick && onClick(task)}
    >
      {/* Top row: title + badges */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {isOverdue && (
              <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
            )}
            <h3 className={`text-sm font-semibold ${isOverdue ? 'text-red-300' : 'text-white'} leading-snug`}>
              {task.title}
            </h3>
          </div>
          {task.description && (
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{task.description}</p>
          )}
        </div>
        <div className="flex flex-col gap-1 items-end flex-shrink-0">
          <StatusBadge type="status" value={task.status} />
          <StatusBadge type="priority" value={task.priority} />
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-800">
        <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
          {task.assignee && (
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold text-[10px]">
                {task.assignee.name.charAt(0).toUpperCase()}
              </div>
              <span>{task.assignee.name}</span>
            </div>
          )}
          {task.dueDate && (
            <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-400' : ''}`}>
              <Calendar className="w-3 h-3" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {isAdmin && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              id={`edit-task-${task.id}`}
              onClick={(e) => { e.stopPropagation(); onEdit && onEdit(task); }}
              className="px-2 py-1 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-950/30 rounded transition-colors"
            >
              Edit
            </button>
            <button
              id={`delete-task-${task.id}`}
              onClick={(e) => { e.stopPropagation(); onDelete && onDelete(task); }}
              className="px-2 py-1 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
