import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { User, Settings, CreditCard, LogOut, ChevronDown } from 'lucide-react';
import ProfileModal from './ProfileModal';
import AccountSettingsModal from './AccountSettingsModal';

export default function ProfileDropdown() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch {
      toast.error('Logout failed');
    }
  };

  const handleAction = (action) => {
    setIsOpen(false);
    if (action === 'logout') {
      handleLogout();
    } else if (action === 'profile') {
      setIsProfileModalOpen(true);
    } else if (action === 'settings') {
      setIsSettingsModalOpen(true);
    } else {
      toast('Coming soon!', { icon: '🚧' });
    }
  };

  return (
    <>
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pl-2 pr-3 bg-white hover:bg-theme-secondary border border-transparent hover:border-theme-border rounded-[12px] transition-all focus:outline-none group"
      >
        {user?.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full border border-gray-200 object-cover" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-theme-primary flex items-center justify-center text-[13px] font-semibold text-white shadow-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="hidden sm:flex flex-col items-start">
          <span className="text-[14px] font-medium text-theme-text leading-tight">{user?.name}</span>
        </div>
        <ChevronDown className="w-4 h-4 text-theme-text-secondary group-hover:text-theme-text transition-colors" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 bg-white border border-theme-border shadow-product rounded-[16px] overflow-hidden z-50 origin-top-right"
          >
            <div className="px-4 py-3 border-b border-theme-border bg-theme-secondary/30">
              <p className="text-[14px] font-semibold text-theme-text">{user?.name}</p>
              <p className="text-[13px] text-theme-text-secondary truncate">{user?.email}</p>
            </div>

            <div className="py-2">
              <button onClick={() => handleAction('profile')} className="w-full px-4 py-2 text-left flex items-center gap-3 text-[14px] text-theme-text-secondary hover:bg-theme-secondary hover:text-theme-text transition-colors">
                <User className="w-4 h-4" /> My Profile
              </button>
              <button onClick={() => handleAction('settings')} className="w-full px-4 py-2 text-left flex items-center gap-3 text-[14px] text-theme-text-secondary hover:bg-theme-secondary hover:text-theme-text transition-colors">
                <Settings className="w-4 h-4" /> Account Settings
              </button>
              <button onClick={() => navigate('/subscription')} className="w-full px-4 py-2 text-left flex items-center gap-3 text-[14px] text-theme-text-secondary hover:bg-theme-secondary hover:text-theme-text transition-colors">
                <CreditCard className="w-4 h-4" /> Subscription
              </button>
            </div>
            
            <div className="border-t border-theme-border py-2">
              <button onClick={() => handleAction('logout')} className="w-full px-4 py-2 text-left flex items-center gap-3 text-[14px] text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        user={user} 
      />

      <AccountSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
    </>
  );
}
