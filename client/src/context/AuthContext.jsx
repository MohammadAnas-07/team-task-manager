import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount (restore session from cookie)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await api.get('/api/auth/me');
        setUser(data.user);

        // Check for OAuth success param
        const urlParams = new URLSearchParams(window.location.search);
        const loginSuccess = urlParams.get('login_success');
        if (loginSuccess) {
          const providerName = loginSuccess.charAt(0).toUpperCase() + loginSuccess.slice(1);
          toast.success(`Successfully logged in with ${providerName}`);
          
          // Remove query param without refreshing
          const newUrl = window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    setUser(data.user);
    return data.user;
  };

  const signup = async (name, email, password) => {
    const { data } = await api.post('/api/auth/signup', { name, email, password });
    setUser(data.user);
    return data.user;
  };

  const updateProfile = async (dataPayload) => {
    const { data } = await api.put('/api/auth/profile', dataPayload);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    await api.post('/api/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
