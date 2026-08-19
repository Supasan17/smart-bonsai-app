import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  Moon,
  Sun,
  Globe,
  Thermometer,
  Droplet,
  Bell,
  Database,
  User,
  Save,
  Sparkles
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, telemetry, t } = useApp();

  return (
    <div className="space-y-6 pb-24">

      <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#12231E]/80 backdrop-blur-xl border border-white/40 dark:border-emerald-500/20 shadow-xl">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white font-outfit flex items-center gap-2">
          <Settings className="w-6 h-6 text-emerald-500" /> {t('settings.title')}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {t('settings.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#12231E]/80 backdrop-blur-xl border border-white/40 dark:border-emerald-500/20 shadow-xl space-y-5">
          <h2 className="text-base font-bold text-slate-900 dark:text-white font-outfit flex items-center gap-2 border-b border-slate-200 dark:border-emerald-500/20 pb-3">
            <Sun className="w-5 h-5 text-amber-500" /> {t('settings.appearance')}
          </h2>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">{t('settings.themeMode')}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 block">{t('settings.themeSub')}</span>
            </div>

            <button
              onClick={() => updateSettings({ darkMode: !settings.darkMode })}
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-emerald-950/60 border border-slate-200 dark:border-emerald-500/30 text-slate-700 dark:text-slate-300 hover:text-amber-500 transition-colors"
            >
              {settings.darkMode ? <Moon className="w-5 h-5 text-emerald-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">{t('settings.tempUnit')}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 block">{t('settings.tempUnitSub')}</span>
            </div>

            <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-emerald-950/60 border border-slate-200 dark:border-emerald-500/30">
              <button
                onClick={() => updateSettings({ tempUnit: 'C' })}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  settings.tempUnit === 'C' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                }`}
              >
                °C
              </button>
              <button
                onClick={() => updateSettings({ tempUnit: 'F' })}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  settings.tempUnit === 'F' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                }`}
              >
                °F
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">{t('settings.language')}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 block">{t('settings.languageSub')}</span>
            </div>

            <select
              value={settings.language}
              onChange={(e) => updateSettings({ language: e.target.value as any })}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-emerald-950/60 border border-slate-200 dark:border-emerald-500/30 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-400"
            >
              <option value="en">English</option>
              <option value="si">සිංහල (Sinhala)</option>
            </select>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#12231E]/80 backdrop-blur-xl border border-white/40 dark:border-emerald-500/20 shadow-xl space-y-5">
          <h2 className="text-base font-bold text-slate-900 dark:text-white font-outfit flex items-center gap-2 border-b border-slate-200 dark:border-emerald-500/20 pb-3">
            <Droplet className="w-5 h-5 text-cyan-500" /> {t('settings.autoWaterTitle')}
          </h2>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Auto Water Start Threshold</span>
                <span className="font-mono text-cyan-500 font-bold">{settings.autoWaterMinMoisture}% Moisture</span>
              </div>
              <input
                type="range"
                min="15"
                max="50"
                value={settings.autoWaterMinMoisture}
                onChange={(e) => updateSettings({ autoWaterMinMoisture: parseInt(e.target.value) })}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Pump will automatically switch ON when soil moisture drops below this value.
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Target Moisture Stop Threshold</span>
                <span className="font-mono text-emerald-500 font-bold">{settings.autoWaterTargetMoisture}% Moisture</span>
              </div>
              <input
                type="range"
                min="55"
                max="90"
                value={settings.autoWaterTargetMoisture}
                onChange={(e) => updateSettings({ autoWaterTargetMoisture: parseInt(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Pump automatically switches OFF once target moisture is satisfied.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#12231E]/80 backdrop-blur-xl border border-white/40 dark:border-emerald-500/20 shadow-xl space-y-5 md:col-span-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white font-outfit flex items-center gap-2 border-b border-slate-200 dark:border-emerald-500/20 pb-3">
            <Database className="w-5 h-5 text-emerald-400" /> {t('settings.syncTitle')}
          </h2>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-100 dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-500/20">
            <div className="space-y-0.5">
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
                Data Source
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 block">
                {settings.simulatedMode
                  ? 'Demo Mode — showing fake sample data, no ESP32 needed.'
                  : telemetry.deviceConnected
                  ? 'Live Mode — connected to your ESP32 via Firebase.'
                  : 'Live Mode — waiting for the ESP32 to send data...'}
              </span>
            </div>
            <button
              onClick={() => updateSettings({ simulatedMode: !settings.simulatedMode })}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                settings.simulatedMode
                  ? 'bg-amber-500/20 text-amber-500 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/40'
              }`}
            >
              {settings.simulatedMode ? 'Demo Data' : 'Live Data'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Telemetry Sync Stream Interval
              </label>
              <select
                value={settings.syncIntervalSec}
                onChange={(e) => updateSettings({ syncIntervalSec: parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-emerald-950/60 border border-slate-200 dark:border-emerald-500/30 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-400"
              >
                <option value={1}>Realtime Stream (1 Second)</option>
                <option value={5}>Balanced (5 Seconds)</option>
                <option value={30}>Eco (30 Seconds)</option>
              </select>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
