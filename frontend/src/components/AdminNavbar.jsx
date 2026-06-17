import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut } from 'lucide-react';

export default function AdminNavbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const title = location.pathname.split('/').filter(Boolean).pop() || 'dashboard';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sticky top-0 z-20 flex items-center justify-between border-b border-sand-200 bg-white/82 px-6 py-4 shadow-sm backdrop-blur-xl">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary-600">Houches Djerbien</p>
        <h1 className="font-display text-2xl font-bold capitalize text-navy-900">{title.replace('-', ' ')}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden rounded-full bg-sand-50 px-4 py-2 text-sm font-semibold text-navy-700 md:block">Super Admin</div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
