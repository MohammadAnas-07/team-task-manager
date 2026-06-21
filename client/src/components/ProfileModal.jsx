import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { X, Mail, CheckCircle2, FolderKanban, Activity, Calendar } from 'lucide-react';
import { Github } from 'lucide-react'; // use Github icon
import { format } from 'date-fns';

const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

export default function ProfileModal({ isOpen, onClose, user }) {
  if (!user) return null;

  const joinedDate = user.createdAt ? format(new Date(user.createdAt), 'MMMM d, yyyy') : 'Unknown';
  
  const ProviderBadge = () => {
    switch(user.provider) {
      case 'google':
        return (
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full text-[13px] font-medium text-gray-700">
            <GoogleIcon />
            Google Account
          </div>
        );
      case 'github':
        return (
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full text-[13px] font-medium text-gray-700">
            <Github className="w-4 h-4" />
            GitHub Account
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full text-[13px] font-medium text-gray-700">
            <Mail className="w-4 h-4 text-theme-text-secondary" />
            Email Account
          </div>
        );
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-[24px] shadow-2xl w-full max-w-[500px] relative z-10 flex flex-col max-h-[90vh] overflow-y-auto"
          >
            {/* Header / Cover */}
            <div className="h-32 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-theme-border relative">
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 bg-white/50 hover:bg-white rounded-full flex items-center justify-center transition-colors shadow-sm"
              >
                <X className="w-4 h-4 text-theme-text" />
              </button>
            </div>

            <div className="px-8 pb-8 pt-0 relative flex-1">
              {/* Avatar Profile */}
              <div className="flex flex-col items-center -mt-16 mb-6">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-white object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-theme-primary flex items-center justify-center text-[40px] font-semibold text-white">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                
                <h2 className="text-[24px] font-bold text-theme-text mt-4 tracking-tight">{user.name}</h2>
                <p className="text-[15px] text-theme-text-secondary">{user.email}</p>
                
                <div className="mt-4">
                  <ProviderBadge />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-[16px] p-5 border border-gray-100 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <FolderKanban className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-theme-text-secondary">Projects Joined</p>
                    <p className="text-[20px] font-bold text-theme-text">{user._count?.memberships || 0}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-[16px] p-5 border border-gray-100 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-theme-text-secondary">Tasks Assigned</p>
                    <p className="text-[20px] font-bold text-theme-text">{user._count?.assignedTasks || 0}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-[16px] p-5 border border-gray-100 flex items-start gap-4 col-span-2">
                  <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-theme-text-secondary">Member Since</p>
                    <p className="text-[16px] font-semibold text-theme-text">{joinedDate}</p>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
