import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Trash2, CheckCircle2, Clock, Inbox, CheckSquare, Users } from 'lucide-react';
import api from '../api/axios';

const iconMap = {
  TASK_ASSIGNED: CheckSquare,
  TASK_UPDATED: Clock,
  PROJECT_INVITATION: Users,
  DEADLINE: Clock,
  GENERAL: Inbox
};

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const { data } = await api.get('/api/notifications');
        setNotifications(data.notifications || []);
        setUnreadCount(data.notifications.filter(n => !n.isRead).length);
      } catch (err) {
        console.error('Failed to load notifications');
      }
    };
    fetchNotifs();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]); // Refetch when opened/closed

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/api/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put('/api/notifications/mark-all-read');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-theme-text-secondary hover:text-theme-text transition-colors rounded-full hover:bg-theme-secondary/80 focus:outline-none"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 bg-white border border-theme-border shadow-product rounded-[16px] overflow-hidden z-50 origin-top-right"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-theme-border bg-theme-secondary/30">
              <h3 className="font-semibold text-[15px] text-theme-text tracking-[-0.374px]">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllRead}
                  className="text-[12px] text-theme-primary font-medium hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-theme-text-secondary flex flex-col items-center">
                  <CheckCircle2 className="w-8 h-8 mb-2 opacity-20" />
                  <p className="text-[14px]">You're all caught up!</p>
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-theme-border">
                  {notifications.map(n => {
                    const Icon = iconMap[n.type] || Inbox;
                    return (
                      <div 
                        key={n.id} 
                        className={`p-4 hover:bg-theme-secondary/50 transition-colors flex gap-3 ${!n.isRead ? 'bg-blue-50/30' : ''}`}
                        onClick={() => !n.isRead && handleMarkAsRead(n.id)}
                      >
                        <div className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${!n.isRead ? 'bg-theme-primary text-white' : 'bg-theme-secondary text-theme-text-secondary'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 cursor-pointer">
                          <p className={`text-[14px] ${!n.isRead ? 'font-medium text-theme-text' : 'text-theme-text-secondary'}`}>
                            {n.message}
                          </p>
                          <span className="text-[11px] text-gray-400 mt-1 block">
                            {new Date(n.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {!n.isRead && (
                          <div className="w-2 h-2 bg-theme-primary rounded-full mt-2 flex-shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
