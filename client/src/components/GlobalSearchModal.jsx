import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FolderKanban, CheckSquare, User, Loader2 } from 'lucide-react';
import api from '../api/axios';

export default function GlobalSearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ projects: [], tasks: [], members: [] });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    } else {
      setQuery('');
      setResults({ projects: [], tasks: [], members: [] });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults({ projects: [], tasks: [], members: [] });
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/api/search?q=${encodeURIComponent(query)}`);
        setResults(data);
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  if (!isOpen) return null;

  const navigateTo = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  const hasResults = results.projects.length > 0 || results.tasks.length > 0 || results.members.length > 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={() => setIsOpen(false)}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-[600px] bg-white rounded-[16px] shadow-2xl relative z-10 overflow-hidden flex flex-col"
      >
        <div className="flex items-center px-4 py-3 border-b border-theme-border">
          <Search className="w-5 h-5 text-theme-text-secondary mr-3" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 text-[16px] outline-none placeholder:text-theme-text-secondary text-theme-text"
            placeholder="Search projects, tasks, or team members..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {loading && <Loader2 className="w-5 h-5 text-theme-primary animate-spin" />}
          <div className="hidden sm:flex items-center gap-1 bg-theme-secondary px-2 py-1 rounded-[6px] ml-3 text-[11px] text-theme-text-secondary font-medium">
            ESC to close
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2 custom-scrollbar">
          {query.length >= 2 && !loading && !hasResults && (
            <div className="py-12 text-center text-theme-text-secondary">
              <p className="text-[14px]">No results found for "{query}"</p>
            </div>
          )}

          {query.length < 2 && (
            <div className="py-8 text-center text-theme-text-secondary opacity-60">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p className="text-[14px]">Type at least 2 characters to search</p>
            </div>
          )}

          {results.projects.length > 0 && (
            <div className="mb-4">
              <div className="px-3 py-2 text-[11px] font-semibold text-theme-text-secondary uppercase tracking-wider">
                Projects
              </div>
              {results.projects.map(p => (
                <button
                  key={p.id}
                  onClick={() => navigateTo(`/projects/${p.id}`)}
                  className="w-full text-left px-3 py-2 flex items-center gap-3 rounded-[8px] hover:bg-theme-secondary group transition-colors focus:bg-theme-secondary focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-[8px] bg-blue-50 text-blue-600 flex items-center justify-center">
                    <FolderKanban className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-medium text-theme-text group-hover:text-blue-600 transition-colors">{p.name}</h4>
                    {p.description && <p className="text-[12px] text-theme-text-secondary truncate">{p.description}</p>}
                  </div>
                </button>
              ))}
            </div>
          )}

          {results.tasks.length > 0 && (
            <div className="mb-4">
              <div className="px-3 py-2 text-[11px] font-semibold text-theme-text-secondary uppercase tracking-wider">
                Tasks
              </div>
              {results.tasks.map(t => (
                <button
                  key={t.id}
                  onClick={() => navigateTo(`/projects/${t.projectId}`)}
                  className="w-full text-left px-3 py-2 flex items-center gap-3 rounded-[8px] hover:bg-theme-secondary group transition-colors focus:bg-theme-secondary focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-[8px] bg-green-50 text-green-600 flex items-center justify-center">
                    <CheckSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-medium text-theme-text group-hover:text-green-600 transition-colors">{t.title}</h4>
                    <p className="text-[12px] text-theme-text-secondary truncate">In {t.project?.name}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {results.members.length > 0 && (
            <div className="mb-2">
              <div className="px-3 py-2 text-[11px] font-semibold text-theme-text-secondary uppercase tracking-wider">
                Team Members
              </div>
              {results.members.map(m => (
                <div
                  key={m.id}
                  className="w-full text-left px-3 py-2 flex items-center gap-3 rounded-[8px] hover:bg-theme-secondary group transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-semibold text-[12px]">
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-[14px] font-medium text-theme-text">{m.name}</h4>
                    <p className="text-[12px] text-theme-text-secondary">{m.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
