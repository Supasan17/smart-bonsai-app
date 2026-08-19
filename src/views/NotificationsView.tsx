import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import {
  Bell,
  Check,
  Trash2,
  AlertTriangle,
  Info,
  CheckCircle2,
  AlertCircle,
  Filter
} from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationAsRead, clearAllNotifications, t } = useApp();
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const filtered = notifications.filter((n) => {
    if (filterSeverity === 'all') return true;
    return n.severity === filterSeverity;
  });

  const severityIcons = {
    info: <Info className="w-4 h-4 text-blue-400" />,
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-400" />,
    critical: <AlertCircle className="w-4 h-4 text-rose-500" />,
  };

  const severityColors = {
    info: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
    success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    warning: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    critical: 'border-rose-500/40 bg-rose-500/10 text-rose-300',
  };

  return (
    <div className="space-y-6 pb-24">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white/80 dark:bg-[#12231E]/80 backdrop-blur-xl border border-white/40 dark:border-emerald-500/20 shadow-xl">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white font-outfit flex items-center gap-2">
            <Bell className="w-6 h-6 text-emerald-500" /> {t('notifications.title')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('notifications.subtitle')}
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={clearAllNotifications}
            className="px-4 py-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <Trash2 className="w-4 h-4" /> Clear All Logs
          </button>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Filter className="w-4 h-4 text-slate-400" />
        {['all', 'info', 'success', 'warning', 'critical'].map((sev) => (
          <button
            key={sev}
            onClick={() => setFilterSeverity(sev)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
              filterSeverity === sev
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white/80 dark:bg-[#12231E]/60 border border-slate-200 dark:border-emerald-500/20 text-slate-600 dark:text-slate-400'
            }`}
          >
            {sev}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white/80 dark:bg-[#12231E]/80 border border-slate-200 dark:border-emerald-500/20">
            <Bell className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-40" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 font-outfit">
              No Notifications Found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Your bonsai monitoring system is operating normally with no active warnings.
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className={`p-4 rounded-2xl border backdrop-blur-xl shadow-md flex items-start justify-between gap-4 transition-all ${
                severityColors[item.severity]
              } ${!item.read ? 'ring-1 ring-emerald-500' : 'opacity-80'}`}
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-xl bg-black/20 mt-0.5">
                  {severityIcons[item.severity]}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-bold font-outfit text-slate-900 dark:text-white">
                      {item.title}
                    </h4>
                    {!item.read && (
                      <span className="px-2 py-0.2 text-[9px] font-extrabold uppercase rounded-full bg-emerald-500 text-white">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">
                    {item.message}
                  </p>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block mt-1">
                    {item.timestamp}
                  </span>
                </div>
              </div>

              {!item.read && (
                <button
                  onClick={() => markNotificationAsRead(item.id)}
                  className="p-1.5 rounded-xl bg-black/20 hover:bg-black/40 text-slate-300 hover:text-white transition-colors"
                  title="Mark Read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          ))
        )}
      </div>

    </div>
  );
};
