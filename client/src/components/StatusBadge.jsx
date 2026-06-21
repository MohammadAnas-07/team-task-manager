import { CheckCircle2, Circle, AlertCircle, ArrowUpCircle, ArrowRightCircle, ArrowDownCircle } from 'lucide-react';

const STATUS_CONFIG = {
  TODO: {
    label: 'To Do',
    classes: 'bg-theme-secondary text-theme-text border border-theme-border-hover',
    icon: Circle,
    iconColor: 'text-theme-text-secondary'
  },
  IN_PROGRESS: {
    label: 'In Progress',
    classes: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    icon: ArrowRightCircle,
    iconColor: 'text-amber-400'
  },
  DONE: {
    label: 'Done',
    classes: 'bg-gray-100 text-theme-primary border border-gray-200',
    icon: CheckCircle2,
    iconColor: 'text-theme-primary'
  },
};

const PRIORITY_CONFIG = {
  LOW: {
    label: 'Low',
    classes: 'bg-theme-secondary text-theme-text-secondary border border-transparent',
    icon: ArrowDownCircle,
    iconColor: 'text-theme-text-secondary',
  },
  MEDIUM: {
    label: 'Medium',
    classes: 'bg-theme-secondary text-theme-text border border-transparent',
    icon: ArrowRightCircle,
    iconColor: 'text-theme-text',
  },
  HIGH: {
    label: 'High',
    classes: 'bg-red-500/10 text-red-400 border border-red-500/20',
    icon: ArrowUpCircle,
    iconColor: 'text-red-400',
  },
};

export default function StatusBadge({ type = 'status', value }) {
  const config = type === 'status' ? STATUS_CONFIG[value] : PRIORITY_CONFIG[value];

  if (!config) return null;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[11px] text-[12px] font-medium leading-none ${config.classes}`}>
      {Icon && <Icon className={`w-3.5 h-3.5 ${config.iconColor}`} />}
      {config.label}
    </span>
  );
}
