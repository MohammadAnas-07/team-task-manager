import { useState } from 'react';
import { UserPlus, Trash2, Crown, User } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

export default function MemberList({ members, projectId, onMembersChange, isAdmin }) {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('MEMBER');
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');
  const [removingId, setRemovingId] = useState(null);

  const handleAddMember = async (e) => {
    e.preventDefault();
    setAddError('');
    setAddLoading(true);
    try {
      const { data } = await api.post(`/api/projects/${projectId}/members`, { email, role });
      toast.success('Member added successfully');
      onMembersChange([...members, data.member]);
      setEmail('');
      setRole('MEMBER');
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to add member';
      setAddError(message);
      toast.error(message);
    } finally {
      setAddLoading(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Remove this member from the project?')) return;
    setRemovingId(userId);
    try {
      await api.delete(`/api/projects/${projectId}/members/${userId}`);
      toast.success('Member removed');
      onMembersChange(members.filter((m) => m.user.id !== userId));
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to remove member';
      toast.error(message);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Member list */}
      <div className="space-y-2">
        {members.map((member) => (
          <motion.div
            layout
            key={member.id || member.user.id}
            className="flex items-center justify-between gap-3 p-3 bg-white rounded-[11px] border border-theme-border hover:border-theme-border-hover transition-colors duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[14px] font-semibold text-theme-text flex-shrink-0 border border-theme-border">
                {member.user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-[17px] font-semibold text-theme-text leading-snug tracking-[-0.374px]">{member.user.name}</p>
                <p className="text-[14px] text-theme-text-secondary tracking-[-0.224px]">{member.user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] text-[12px] font-medium leading-none ${
                member.role === 'ADMIN'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'bg-theme-secondary text-theme-text-secondary border border-transparent'
              }`}>
                {member.role === 'ADMIN' ? <Crown className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                {member.role}
              </span>
              {isAdmin && member.user.id !== user?.id && (
                <button
                  id={`remove-member-${member.user.id}`}
                  onClick={() => handleRemoveMember(member.user.id)}
                  disabled={removingId === member.user.id}
                  className="p-2 text-theme-text-secondary hover:text-red-400 hover:bg-red-500/10 rounded-[8px] transition-colors disabled:opacity-50"
                  aria-label={`Remove ${member.user.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add member form */}
      {isAdmin && (
        <div className="bg-white border border-theme-border rounded-[18px] p-5">
          <h4 className="text-[17px] font-semibold text-theme-text mb-4 flex items-center gap-2 tracking-[-0.374px]">
            <UserPlus className="w-5 h-5 text-theme-primary" />
            Add Member
          </h4>
          <form onSubmit={handleAddMember} className="space-y-4" id="add-member-form">
            <div className="flex gap-3">
              <input
                id="add-member-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@example.com"
                className="input-field flex-1"
                required
              />
              <select
                id="add-member-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="input-field w-32"
              >
                <option value="MEMBER">Member</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            {addError && (
              <p className="text-[14px] text-red-400 tracking-[-0.224px]">{addError}</p>
            )}
            <button
              id="add-member-submit"
              type="submit"
              disabled={addLoading}
              className="btn-primary w-full sm:w-auto"
            >
              {addLoading ? (
                <div className="w-4 h-4 border-[3px] border-gray-200 border-t-theme-text rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Add Member
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
