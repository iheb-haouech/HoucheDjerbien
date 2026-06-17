import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Building, Wrench, Sparkles } from 'lucide-react';

export default function BottomNavigation() {
  const navItems = [
    { to: "/", icon: Home, label: "Accueil" },
    { to: "/rentals", icon: Building, label: "Locations" },
    { to: "/cleaning", icon: Sparkles, label: "Nettoyage" },
    { to: "/construction", icon: Wrench, label: "Construction" }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 shadow-2xl border-t border-gray-200 safe-area-inset-bottom">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center px-4 py-2 rounded-2xl transition-all duration-300 min-w-[60px] ${
                    isActive
                      ? 'text-primary-600 bg-primary-50 shadow-lg'
                      : 'text-gray-600 hover:text-primary-500 hover:bg-gray-50'
                  }`
                }
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}