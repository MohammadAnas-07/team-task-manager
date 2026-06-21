import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { Mail, Lock, User, Eye, EyeOff, Layers, Github } from 'lucide-react';
import { motion } from 'framer-motion';
import { baseURL } from '../api/axios';

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
    <div className="min-h-screen bg-theme-bg flex items-center justify-center p-4">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-theme-primary/10 via-transparent to-transparent pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[400px]"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-theme-primary rounded-[14px] mb-6 shadow-product">
            <Layers className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-[28px] font-semibold text-theme-text tracking-tight leading-tight">Create an account</h1>
          <p className="text-[17px] text-theme-text-secondary mt-2 tracking-[-0.374px]">Join your team today</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-theme-border rounded-[24px] p-8 shadow-product">
          <form onSubmit={handleSubmit} className="space-y-6" id="signup-form">
            <div>
              <label htmlFor="signup-name" className="label">Full name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-theme-text-secondary transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[12px] text-gray-400 mt-2 tracking-[-0.12px]">At least 8 characters</p>
            </div>

            <button
              id="signup-submit-btn"
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 text-[17px] mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-[3px] border-gray-200 border-t-theme-text rounded-full animate-spin" />
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 tracking-[-0.224px]">OR</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <a
                href={`${baseURL}/api/auth/google`}
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-theme-border rounded-[12px] shadow-sm bg-white text-[15px] font-medium text-theme-text hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </a>
              <a
                href={`${baseURL}/api/auth/github`}
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-theme-border rounded-[12px] shadow-sm bg-white text-[15px] font-medium text-theme-text hover:bg-gray-50 transition-colors"
              >
                <Github className="w-5 h-5" />
                Continue with GitHub
              </a>
            </div>
          </div>

          <p className="text-center text-[14px] text-theme-text-secondary mt-8 tracking-[-0.224px]">
            Already have an account?{' '}
            <Link to="/login" className="text-theme-primary hover:text-theme-primary font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
