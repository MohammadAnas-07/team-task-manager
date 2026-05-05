const STATUS_CONFIG = {
  TODO: {
    label: 'To Do',
    classes: 'bg-slate-700/50 text-slate-300 border border-slate-600',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    classes: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  },
  DONE: {
    label: 'Done',
    classes: 'bg-green-500/15 text-green-400 border border-green-500/30',
  },
};

const PRIORITY_CONFIG = {
  LOW: {
    label: 'Low',
    classes: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
    dot: 'bg-blue-400',
  },
  MEDIUM: {
    label: 'Medium',
    classes: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    dot: 'bg-amber-400',
  },
  HIGH: {
    label: 'High',
    classes: 'bg-red-500/15 text-red-400 border border-red-500/30',
    dot: 'bg-red-400',
  },
};

export default function StatusBadge({ type = 'status', value }) {
  const config = type === 'status' ? STATUS_CONFIG[value] : PRIORITY_CONFIG[value];

  if (!config) return null;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${config.classes}`}>
      {type === 'priority' && (
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      )}
      {config.label}
    </span>
  );
}
