import { motion } from 'framer-motion';

export default function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction,
  iconClass = "text-gray-400 bg-gray-50",
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white border border-dashed border-theme-border-hover rounded-[24px] p-16 text-center mt-8 shadow-sm flex flex-col items-center justify-center max-w-2xl mx-auto"
    >
      <div className={`w-16 h-16 rounded-[16px] flex items-center justify-center mb-6 ${iconClass}`}>
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-theme-text font-semibold text-[21px] tracking-tight mb-2">
        {title}
      </h3>
      <p className="text-theme-text-secondary text-[16px] mb-8 tracking-[-0.374px] max-w-md leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-[#111111] hover:bg-black text-white px-6 py-2.5 rounded-[12px] font-medium transition-all shadow-md active:scale-95 flex items-center gap-2"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}
