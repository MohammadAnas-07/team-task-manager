import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FolderKanban, CheckSquare, Sparkles, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FloatingActionMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const actions = [
    { label: 'Create Project', icon: FolderKanban, path: '/projects/new', color: 'text-blue-600 bg-blue-50' },
    { label: 'Create Task', icon: CheckSquare, path: '/my-tasks', color: 'text-green-600 bg-green-50' },
    { label: 'AI Assistant', icon: Sparkles, path: '/ai-meeting-assistant', color: 'text-purple-600 bg-purple-50' }
  ];

  const handleAction = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <div className="fixed bottom-8 right-8 z-40" ref={menuRef}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-16 right-0 mb-4 bg-white border border-theme-border shadow-2xl rounded-[16px] p-2 flex flex-col gap-1 w-48 origin-bottom-right"
          >
            {actions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleAction(action.path)}
                className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-[10px] hover:bg-theme-secondary transition-colors group"
              >
                <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center ${action.color}`}>
                  <action.icon className="w-4 h-4" />
                </div>
                <span className="text-[14px] font-medium text-theme-text">{action.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full bg-[#111111] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 focus:outline-none`}
      >
        <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }}>
          <Plus className="w-7 h-7" />
        </motion.div>
      </button>
    </div>
  );
}
