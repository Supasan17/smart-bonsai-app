import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  Wifi,
  RotateCw,
  Activity,
  AlertTriangle
} from 'lucide-react';

export const DeviceView: React.FC = () => {
  const { telemetry, rebootDevice, isRebootingDevice, t } = useApp();
  const [isConfirmRebootOpen, setIsConfirmRebootOpen] = useState(false);

  const rssi = telemetry.rssi;
  let signalQuality = 'Excellent';
  let signalBars = 4;
  if (rssi < -75) { signalQuality = 'Fair'; signalBars = 2; }
  if (rssi < -85) { signalQuality = 'Poor'; signalBars = 1; }

  return (
    <div className="space-y-6 pb-24">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white/80 dark:bg-[#12231E]/80 backdrop-blur-xl border border-white/40 dark:border-emerald-500/20 shadow-xl">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white font-outfit flex items-center gap-2">
            <Cpu className="w-6 h-6 text-emerald-500" /> {t('device.title')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('device.subtitle')}
          </p>
        </div>

        <button
          onClick={() => setIsConfirmRebootOpen(true)}
          disabled={isRebootingDevice}
          className="px-4 py-2.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/10"
        >
          <RotateCw className={`w-4 h-4 ${isRebootingDevice ? 'animate-spin' : ''}`} />
          {isRebootingDevice ? t('device.rebooting') : t('device.restart')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#12231E]/80 backdrop-blur-xl border border-white/40 dark:border-emerald-500/20 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-outfit">{t('device.status')}</h3>
                <span className="text-[11px] font-semibold text-emerald-500">
                  {telemetry.deviceConnected ? 'Operational (Online)' : 'Offline / Rebooting'}
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              ESP32-S3-WROOM
            </span>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-emerald-500/20 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Uptime:</span>
              <span className="font-mono font-bold text-emerald-400">14 Days, 06 Hours</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Local IP Address:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">192.168.1.142</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>MAC Address:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">24:6F:28:AB:89:1C</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#12231E]/80 backdrop-blur-xl border border-white/40 dark:border-emerald-500/20 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Wifi className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-outfit">{t('device.wifiSignal')}</h3>
                <span className="text-[11px] font-semibold text-cyan-400">
                  {signalQuality} ({telemetry.rssi} dBm)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-end space-x-1.5 h-10 pt-2">
            {[1, 2, 3, 4].map((bar) => (
              <div
                key={bar}
                className={`w-full rounded-t-md transition-all ${
                  bar <= signalBars
                    ? 'bg-gradient-to-t from-cyan-600 to-emerald-400'
                    : 'bg-slate-300 dark:bg-emerald-950/60'
                }`}
                style={{ height: `${bar * 25}%` }}
              />
            ))}
          </div>
        </div>

      </div>

      <AnimatePresence>
        {isConfirmRebootOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-[#0F231D] border border-amber-500/30 shadow-2xl p-6 text-center space-y-4"
            >
              <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto animate-bounce" />
              <h3 className="text-base font-bold text-white font-outfit">
                Reboot ESP32 Node?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                This will send a soft-reset pulse to the micro-controller board. Telemetry will pause for ~4 seconds.
              </p>

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => setIsConfirmRebootOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsConfirmRebootOpen(false);
                    rebootDevice();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400"
                >
                  Confirm Reboot
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
