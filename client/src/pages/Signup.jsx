import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { Mail, Lock, User, Eye, EyeOff, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      await signup(name, email, password);
      toast.success('Account created! Welcome aboard!');
      navigate('/');
    } catch (err) {
      const message = err.response?.data?.error || 'Signup failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-apple-surface-black flex items-center justify-center p-4">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-apple-primary/10 via-transparent to-transparent pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[400px]"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-apple-primary rounded-[14px] mb-6 shadow-product">
            <Layers className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-[28px] font-semibold text-apple-on-dark tracking-tight leading-tight">Create an account</h1>
          <p className="text-[17px] text-apple-body-muted mt-2 tracking-[-0.374px]">Join your team today</p>
        </div>

        {/* Card */}
        <div className="bg-apple-surface-tile-1 border border-apple-surface-tile-2 rounded-[24px] p-8 shadow-product">
          <form onSubmit={handleSubmit} className="space-y-6" id="signup-form">
            <div>
              <label htmlFor="signup-name" className="label">Full name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-apple-ink-muted-48" />
                <input
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="input-field pl-10"
                  required
                  autoFocus
                  minLength={2}
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-email" className="label">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-apple-ink-muted-48" />
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-password" className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-apple-ink-muted-48" />
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="input-field pl-10 pr-10"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-apple-ink-muted-48 hover:text-apple-body-muted transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[12px] text-apple-ink-muted-48 mt-2 tracking-[-0.12px]">At least 8 characters</p>
            </div>

            <button
              id="signup-submit-btn"
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 text-[17px] mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-[3px] border-apple-on-primary/30 border-t-apple-on-primary rounded-full animate-spin" />
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-[14px] text-apple-body-muted mt-8 tracking-[-0.224px]">
            Already have an account?{' '}
            <Link to="/login" className="text-apple-primary hover:text-apple-primary-on-dark font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
