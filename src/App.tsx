import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { DashboardView } from './views/DashboardView';
import { HistoryView } from './views/HistoryView';
import { GalleryView } from './views/GalleryView';
import { NotificationsView } from './views/NotificationsView';
import { DeviceView } from './views/DeviceView';
import { SettingsView } from './views/SettingsView';
import { ProfileView } from './views/ProfileView';

export const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'history':
        return <HistoryView />;
      case 'gallery':
        return <GalleryView />;
      case 'notifications':
        return <NotificationsView />;
      case 'device':
        return <DeviceView />;
      case 'settings':
        return <SettingsView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 selection:bg-emerald-500 selection:text-white relative transition-colors">

      <div className="hidden dark:block fixed inset-0 bg-gradient-to-br from-[#071510] via-[#0D1E19] to-[#08110D] pointer-events-none -z-20" />
      <div className="hidden dark:block fixed top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="hidden dark:block fixed bottom-0 left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <main className="max-w-6xl mx-auto px-4 pt-4">
        {renderTab()}
      </main>

      <Navbar />
    </div>
  );
};
