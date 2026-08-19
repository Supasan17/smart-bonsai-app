import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Home,
  LineChart,
  Camera,
  Bell,
  Cpu,
  Settings,
  User
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, notifications, t } = useApp();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const navItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: <Home className="w-5 h-5" /> },
    { id: 'history', label: t('nav.analytics'), icon: <LineChart className="w-5 h-5" /> },
    { id: 'gallery', label: t('nav.gallery'), icon: <Camera className="w-5 h-5" /> },
    {
      id: 'notifications',
      label: t('nav.alerts'),
      icon: <Bell className="w-5 h-5" />,
      badge: unreadCount
    },
    { id: 'device', label: t('nav.device'), icon: <Cpu className="w-5 h-5" /> },
    { id: 'settings', label: t('nav.settings'), icon: <Settings className="w-5 h-5" /> },
    { id: 'profile', label: t('nav.profile'), icon: <User className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-2 sm:bottom-3 left-1/2 transform -translate-x-1/2 z-40 w-[96%] sm:w-[95%] max-w-2xl px-1.5 sm:px-3 py-1.5 sm:py-2 rounded-3xl sm:rounded-full bg-white/80 dark:bg-[#0F231D]/90 backdrop-blur-2xl border border-white/40 dark:border-emerald-500/30 shadow-2xl overflow-x-auto scrollbar-none">
      <div className="flex items-center justify-between sm:justify-around min-w-max sm:min-w-0 gap-0.5 sm:gap-0">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center py-1 px-2 sm:px-3 rounded-full transition-all duration-300 flex-shrink-0 ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >

              {isActive && (
                <div className="absolute inset-0 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 -z-10 animate-fade-in" />
              )}

              <div className="relative">
                {item.icon}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 text-[9px] font-bold rounded-full bg-rose-500 text-white">
                    {item.badge}
                  </span>
                )}
              </div>

              <span className="text-[9px] sm:text-[10px] tracking-tight mt-0.5 font-medium whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
