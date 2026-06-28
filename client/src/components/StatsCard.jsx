import { motion } from 'framer-motion';

export default function StatsCard({ title, value, icon: Icon, color = 'blue', subtitle }) {
  const colorMap = {
    blue: {
      bg: 'bg-[#0066CC]/10',
      icon: 'text-[#0066CC]',
    },
    green: {
      bg: 'bg-[#34C759]/10',
      icon: 'text-[#34C759]',
    },
    amber: {
      bg: 'bg-[#FF9500]/10',
      icon: 'text-[#FF9500]',
    },
    red: {
      bg: 'bg-[#FF3B30]/10',
      icon: 'text-[#FF3B30]',
    },
    purple: {
      bg: 'bg-[#AF52DE]/10',
      icon: 'text-[#AF52DE]',
    },
  };

  const colors = colorMap[color] || colorMap.blue;

  return (
    <motion.div 
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="bg-[#FFFFFF] border border-[#E8E8ED] rounded-[24px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-[14px] text-[#6E6E73] font-medium">{title}</p>
          <p className="text-[44px] font-semibold text-[#1D1D1F] tracking-tight leading-none mt-2 mb-1">{value}</p>
          {subtitle && <p className="text-[14px] text-[#6E6E73]">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${colors.bg}`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
      </div>
    </motion.div>
  );
}
