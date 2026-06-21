import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { X, User, Mail, Shield, Save } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export default function AccountSettingsModal({ isOpen, onClose }) {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize form when modal opens or user changes
  useEffect(() => {
    if (isOpen && user) {
      setName(user.name || '');
    }
  }, [isOpen, user]);

  if (!user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    if (name === user.name) {
      onClose();
      return;
    }

    setLoading(true);
    try {
      await updateProfile({ name });
      toast.success('Profile updated successfully');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
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
            className="bg-white rounded-[24px] shadow-2xl w-full max-w-[500px] relative z-10 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-[18px] font-semibold text-gray-900 tracking-tight">Account Settings</h2>
              <button 
                onClick={onClose}
                className="w-8 h-8 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Full Name Field */}
                <div>
                  <label className="block text-[14px] font-medium text-gray-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-[12px] text-[15px] focus:outline-none focus:ring-2 focus:ring-theme-primary/20 focus:border-theme-primary transition-all"
                      placeholder="Your full name"
                      required
                      minLength={2}
                    />
                  </div>
                </div>

                {/* Email Field (Disabled) */}
                <div>
                  <label className="block text-[14px] font-medium text-gray-700 mb-1.5 flex items-center justify-between">
                    Email Address
                    <span className="text-[12px] font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Non-editable</span>
                  </label>
                  <div className="relative opacity-60 cursor-not-allowed">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-[12px] text-[15px] cursor-not-allowed text-gray-500"
                    />
                  </div>
                  <p className="text-[13px] text-gray-500 mt-2 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    Email addresses are managed by your authentication provider ({user.provider === 'email' ? 'Email/Password' : user.provider}).
                  </p>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 text-[14px] font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-[12px] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || name === user.name}
                    className="flex items-center gap-2 px-5 py-2.5 bg-theme-primary text-white text-[14px] font-medium rounded-[12px] hover:bg-theme-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
