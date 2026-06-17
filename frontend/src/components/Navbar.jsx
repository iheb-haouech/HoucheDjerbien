import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import { User, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import LOCAL_ASSETS from '../assets/images';

export default function Navbar() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { to: '/', label: "Accueil" },
    { to: '/rentals', label: "Locations" },
    { to: '/construction', label: "Construction" },
    { to: '/cleaning', label: "Nettoyage" },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/35 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <NavLink to="/" className="flex items-center gap-3">
          <img src={LOCAL_ASSETS.logo} alt="Houches Djerbien" className="h-11 w-auto rounded bg-white/80 object-contain" loading="lazy" />
          <div>
            <p className="font-display text-lg font-semibold leading-none text-primary-700">Houches Djerbien</p>
            <p className="text-xs font-medium text-navy-500">L'ame de Djerba</p>
          </div>
        </NavLink>

        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className="flex items-center gap-2 text-sm font-semibold text-navy-800 transition hover:text-primary-600"
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <LanguageSwitcher />

          {user ? (
            <>
              <span className="text-sm font-medium text-navy-800">{user.name || user.email}</span>

              <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-3 py-1 text-sm font-semibold text-white shadow-sm hover:bg-primary-700">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="text-sm font-semibold text-navy-800 hover:text-primary-600">
                Login
              </NavLink>
              <NavLink to="/signup" className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">
                Sign Up
              </NavLink>
            </>
          )}
        </div>

        <button
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-sand-300 bg-white/80 text-navy-800 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-b border-sand-200 p-4">
          <nav className="flex flex-col gap-2">
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className="px-4 py-2 text-sm font-medium text-navy-800 hover:bg-sand-100 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {label}
              </NavLink>
            ))}

            {!user ? (
              <>
                <NavLink
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-navy-800 hover:bg-sand-100 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </NavLink>
              </>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="px-4 py-2 text-sm font-medium text-left text-white bg-red-600 rounded-lg"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
