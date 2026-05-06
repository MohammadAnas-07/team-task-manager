import { useState } from 'react';
import { UserPlus, Trash2, Crown, User } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

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
    <div className="space-y-4">
      {/* Member list */}
      <div className="space-y-2">
        {members.map((member) => (
          <div
            key={member.id || member.user.id}
            className="flex items-center justify-between gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                {member.user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{member.user.name}</p>
                <p className="text-xs text-slate-500">{member.user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                member.role === 'ADMIN'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'bg-slate-700/50 text-slate-400 border border-slate-600'
              }`}>
                {member.role === 'ADMIN' ? <Crown className="w-3 h-3" /> : <User className="w-3 h-3" />}
                {member.role}
              </span>
              {isAdmin && member.user.id !== user?.id && (
                <button
                  id={`remove-member-${member.user.id}`}
                  onClick={() => handleRemoveMember(member.user.id)}
                  disabled={removingId === member.user.id}
                  className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/30 rounded transition-colors disabled:opacity-50"
                  aria-label={`Remove ${member.user.name}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add member form */}
      {isAdmin && (
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-blue-400" />
            Add Member
          </h4>
          <form onSubmit={handleAddMember} className="space-y-3" id="add-member-form">
            <div className="flex gap-2">
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
              <p className="text-xs text-red-400">{addError}</p>
            )}
            <button
              id="add-member-submit"
              type="submit"
              disabled={addLoading}
              className="btn-primary"
            >
              {addLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
