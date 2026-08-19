import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Wifi,
  WifiOff,
  Sun,
  Moon,
  Bell,
  User,
  Sparkles,
  TreePine
} from 'lucide-react';
import { format } from 'date-fns';

export const Header: React.FC = () => {
  const {
    user,
    telemetry,
    settings,
    updateSettings,
    notifications,
    setActiveTab,
    setIsAuthModalOpen,
    t
  } = useApp();

  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="relative w-full mb-6 pt-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 rounded-3xl bg-white/70 dark:bg-[#12231E]/70 backdrop-blur-xl border border-white/40 dark:border-emerald-500/20 shadow-xl">

        <div className="flex items-center space-x-4">
          <div className="relative group cursor-pointer" onClick={() => setActiveTab('profile')}>
            <img
              src={user?.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
              alt={user?.name || 'User'}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/50 shadow-md group-hover:scale-105 transition-transform"
            />
            <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 text-white rounded-full ring-2 ring-[#12231E]">
              <TreePine className="w-3.5 h-3.5" />
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-outfit truncate max-w-[60vw] sm:max-w-none">
                {user ? `${t('header.helloPrefix')} ${user.name}` : t('header.welcomeGuest')}
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> {user?.plantName || 'Banyan Bonsai'}
              </span>
            </div>
            <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              {format(currentTime, 'EEEE, MMM dd, yyyy')} • <span className="font-mono text-emerald-600 dark:text-emerald-400">{format(currentTime, 'hh:mm:ss a')}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2 sm:gap-3 self-end md:self-auto">

          <div className={`px-2.5 sm:px-3 py-1.5 rounded-2xl flex items-center space-x-2 text-xs font-semibold border backdrop-blur-md transition-colors ${
            telemetry.deviceConnected
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
              : 'bg-rose-500/10 text-rose-500 border-rose-500/30'
          }`}>
            <span className="relative flex h-2.5 w-2.5">
              {telemetry.deviceConnected && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${telemetry.deviceConnected ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
            </span>
            {telemetry.deviceConnected ? (
              <span className="flex items-center gap-1 whitespace-nowrap">
                <Wifi className="w-3.5 h-3.5" /> {t('header.online')}
              </span>
            ) : (
              <span className="flex items-center gap-1 whitespace-nowrap">
                <WifiOff className="w-3.5 h-3.5" /> {t('header.offline')}
              </span>
            )}
          </div>

          <button
            onClick={() => setActiveTab('notifications')}
            className="relative p-2.5 rounded-2xl bg-slate-100 dark:bg-emerald-950/60 border border-slate-200 dark:border-emerald-500/30 text-slate-700 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors shadow-sm"
            title={t('header.notifications')}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => updateSettings({ darkMode: !settings.darkMode })}
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-emerald-950/60 border border-slate-200 dark:border-emerald-500/30 text-slate-700 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors shadow-sm"
            title={t('header.toggleTheme')}
          >
            {settings.darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {!user ? (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-1"
            >
              <User className="w-4 h-4" /> {t('header.signIn')}
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('profile')}
              className="hidden sm:flex p-2.5 rounded-2xl bg-slate-100 dark:bg-emerald-950/60 border border-slate-200 dark:border-emerald-500/30 text-slate-700 dark:text-slate-300 hover:text-emerald-500 transition-colors shadow-sm"
              title={t('header.profileSettings')}
            >
              <User className="w-5 h-5" />
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
