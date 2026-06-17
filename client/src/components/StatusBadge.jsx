import { CheckCircle2, Circle, AlertCircle, ArrowUpCircle, ArrowRightCircle, ArrowDownCircle } from 'lucide-react';

const STATUS_CONFIG = {
  TODO: {
    label: 'To Do',
    classes: 'bg-apple-surface-tile-2 text-apple-on-dark border border-apple-surface-tile-3',
    icon: Circle,
    iconColor: 'text-apple-body-muted'
  },
  IN_PROGRESS: {
    label: 'In Progress',
    classes: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    icon: ArrowRightCircle,
    iconColor: 'text-amber-400'
  },
  DONE: {
    label: 'Done',
    classes: 'bg-apple-primary/10 text-apple-primary border border-apple-primary/20',
    icon: CheckCircle2,
    iconColor: 'text-apple-primary'
  },
};

const PRIORITY_CONFIG = {
  LOW: {
    label: 'Low',
    classes: 'bg-apple-surface-tile-2 text-apple-body-muted border border-transparent',
    icon: ArrowDownCircle,
    iconColor: 'text-apple-body-muted',
  },
  MEDIUM: {
    label: 'Medium',
    classes: 'bg-apple-surface-tile-2 text-apple-on-dark border border-transparent',
    icon: ArrowRightCircle,
    iconColor: 'text-apple-on-dark',
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
