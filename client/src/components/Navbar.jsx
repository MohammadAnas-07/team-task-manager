import { useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const routeTitles = {
  '/': 'Dashboard',
  '/projects': 'Projects',
  '/projects/new': 'New Project',
};

function getTitle(pathname) {
  if (routeTitles[pathname]) return routeTitles[pathname];
  if (pathname.startsWith('/projects/') && pathname !== '/projects/new') return 'Project Details';
  return 'Team Task Manager';
}

export default function Navbar() {
  const location = useLocation();
  const { user } = useAuth();
  const title = getTitle(location.pathname);

  return (
    <header className="h-14 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-30">
      {/* Left spacer for mobile hamburger */}
      <div className="w-8 lg:hidden" />
      
      {/* Title */}
      <div className="flex-1">
        <h2 className="text-base font-semibold text-white">{title}</h2>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
          <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium text-slate-300">{user?.name}</span>
        </div>
      </div>
    </header>
  );
}
