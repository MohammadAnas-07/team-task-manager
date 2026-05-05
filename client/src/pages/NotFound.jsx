import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-amber-400" />
          </div>
        </div>
        <h1 className="text-6xl font-black text-white mb-3">404</h1>
        <h2 className="text-xl font-semibold text-slate-300 mb-2">Page not found</h2>
        <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary inline-flex">
          <Home className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
