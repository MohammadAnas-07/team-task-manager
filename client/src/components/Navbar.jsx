import { useLocation } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';

const routeTitles = {
  '/dashboard': 'Dashboard',
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
      <div className="flex items-center gap-2">
        <NotificationDropdown />
        <div className="w-px h-6 bg-theme-border mx-1 hidden sm:block" />
        <ProfileDropdown />
      </div>
    </header>
  );
}
