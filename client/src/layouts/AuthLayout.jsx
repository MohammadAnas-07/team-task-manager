import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-theme-bg text-theme-text font-sans">
      {/* Left side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 bg-white border-r border-theme-border relative overflow-hidden">
        {/* Subtle decorative background */}
        <div className="absolute inset-0 bg-gradient-to-br from-theme-primary/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-theme-primary rounded-[11px] flex items-center justify-center shadow-product">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <span className="text-[21px] font-semibold tracking-tight">Task Flow</span>
        </div>
        
        <div className="relative z-10 max-w-md">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-[40px] font-semibold leading-[1.1] tracking-tight mb-6"
          >
            Manage your team's work with elegance.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[17px] text-theme-text-secondary leading-[1.47] tracking-tight"
          >
            A powerful, streamlined workspace designed to keep your team aligned, focused, and shipping faster.
          </motion.p>
        </div>
      </div>
      
      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 relative">
        <div className="absolute top-6 left-6 lg:hidden flex items-center gap-2">
          <div className="w-8 h-8 bg-theme-primary rounded-[8px] flex items-center justify-center">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <span className="text-[17px] font-semibold tracking-tight">Task Flow</span>
        </div>
        
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
