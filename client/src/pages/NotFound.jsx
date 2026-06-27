import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-theme-bg flex items-center justify-center p-4">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
      >
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-white border border-theme-border rounded-[24px] flex items-center justify-center shadow-product relative overflow-hidden">
             <div className="absolute inset-0 bg-red-500/10" />
            <AlertTriangle className="w-10 h-10 text-red-500 relative z-10" />
          </div>
        </div>
        <h1 className="text-[80px] font-semibold text-theme-text mb-2 tracking-tight leading-none">404</h1>
        <h2 className="text-[24px] font-semibold text-theme-text mb-4 tracking-[-0.374px]">Page not found</h2>
        <p className="text-[17px] text-theme-text-secondary mb-10 max-w-sm mx-auto tracking-[-0.374px] leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/dashboard" className="btn-primary inline-flex justify-center">
          <Home className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </motion.div>
    </div>
  );
}
