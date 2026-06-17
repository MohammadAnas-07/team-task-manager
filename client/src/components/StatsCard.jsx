import { motion } from 'framer-motion';

export default function StatsCard({ title, value, icon: Icon, color = 'blue', subtitle }) {
  const colorMap = {
    blue: {
      bg: 'bg-apple-primary/10',
      icon: 'text-apple-primary',
    },
    green: {
      bg: 'bg-green-500/10',
      icon: 'text-green-400',
    },
    amber: {
      bg: 'bg-amber-500/10',
      icon: 'text-amber-400',
    },
    red: {
      bg: 'bg-red-500/10',
      icon: 'text-red-400',
    },
    purple: {
      bg: 'bg-purple-500/10',
      icon: 'text-purple-400',
    },
  };

  const colors = colorMap[color] || colorMap.blue;

  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-apple-surface-tile-1 border border-apple-surface-tile-2 rounded-[18px] p-6 hover:border-apple-surface-tile-3 transition-colors duration-300"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-[14px] text-apple-body-muted font-semibold tracking-[-0.224px] uppercase">{title}</p>
          <p className="text-[40px] font-semibold text-apple-on-dark tracking-tight leading-none mt-2 mb-1">{value}</p>
          {subtitle && <p className="text-[14px] text-apple-body-muted tracking-[-0.224px]">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-[11px] flex items-center justify-center flex-shrink-0 ${colors.bg}`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
      </div>
    </motion.div>
  );
}
