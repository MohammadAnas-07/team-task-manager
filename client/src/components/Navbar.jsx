import { useLocation } from 'react-router-dom';
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
    <header className="h-[52px] bg-white/80 backdrop-blur-[20px] border-b border-theme-border flex items-center px-4 lg:px-8 gap-4 absolute top-0 w-full z-30">
      {/* Left spacer for mobile hamburger */}
      <div className="w-8 lg:hidden" />
      
      {/* Title */}
      <div className="flex-1">
        <h2 className="text-[17px] font-semibold text-theme-text tracking-[-0.374px]">{title}</h2>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 text-[14px] text-theme-text-secondary">
          <div className="w-7 h-7 rounded-full bg-theme-secondary flex items-center justify-center text-[12px] font-semibold text-theme-text border border-theme-border-hover">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="font-normal text-theme-text">{user?.name}</span>
        </div>
      </div>
    </header>
  );
}
