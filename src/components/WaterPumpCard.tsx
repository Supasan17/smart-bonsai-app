import React from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Droplet,
  Power,
  Bot,
  Timer,
  History,
  Clock,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const WaterPumpCard: React.FC = () => {
  const {
    telemetry,
    settings,
    togglePump,
    toggleAutoMode,
    triggerManualWater,
    pumpActiveSeconds,
    totalWateredDurationToday,
    t
  } = useApp();

  const isPumpActive = telemetry.pump;
  const isAutoMode = telemetry.autoMode;

  return (
    <div className="relative p-6 rounded-3xl bg-white/80 dark:bg-[#12231E]/80 backdrop-blur-xl border border-white/40 dark:border-emerald-500/20 shadow-2xl overflow-hidden mb-6">

      <AnimatePresence>
        {isPumpActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
          >

            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/15 to-emerald-500/10 animate-pulse" />

            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2.5 h-2.5 rounded-full bg-cyan-400/50 blur-[1px]"
                initial={{
                  x: `${(i * 8.5) % 100}%`,
                  y: '100%',
                  scale: Math.random() * 0.8 + 0.4
                }}
                animate={{
                  y: '-20%',
                  x: `${((i * 8.5) % 100) + (Math.sin(i) * 15)}%`
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: i * 0.2
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-2xl border transition-colors ${
              isPumpActive
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400 animate-bounce'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
            }`}>
              <Droplet className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white font-outfit flex items-center gap-2">
                {t('waterPump.title')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('waterPump.subtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-start space-x-3 px-4 py-2 rounded-2xl bg-slate-100 dark:bg-emerald-950/60 border border-slate-200 dark:border-emerald-500/30">
            <div className="flex items-center space-x-2">
              <Bot className={`w-4 h-4 ${isAutoMode ? 'text-emerald-500 animate-pulse' : 'text-slate-400'}`} />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t('waterPump.autoMode')}
              </span>
            </div>

            <button
              onClick={() => toggleAutoMode()}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isAutoMode ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isAutoMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-6">

          <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-100/80 dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-500/20 shadow-inner">
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => togglePump()}
              disabled={isAutoMode}
              className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
                isAutoMode
                  ? 'bg-slate-200 dark:bg-emerald-950 text-slate-400 border border-slate-300 dark:border-emerald-500/30 cursor-not-allowed opacity-60'
                  : isPumpActive
                  ? 'bg-gradient-to-tr from-cyan-500 to-emerald-400 text-white shadow-glow-emerald ring-4 ring-cyan-400/40'
                  : 'bg-slate-200 dark:bg-emerald-950 text-slate-400 border border-slate-300 dark:border-emerald-500/30 hover:border-emerald-500/50'
              }`}
            >
              <Power className="w-10 h-10" />
              {isPumpActive && (
                <span className="absolute inset-0 rounded-full border-2 border-cyan-300 animate-ping opacity-50" />
              )}
            </motion.button>

            <span className="mt-3 text-sm font-extrabold uppercase tracking-wider font-outfit text-slate-800 dark:text-slate-200">
              {isPumpActive ? t('waterPump.pumpActive') : t('waterPump.pumpOff')}
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-emerald-950/30 border border-slate-200 dark:border-emerald-500/20 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Timer className="w-4 h-4 text-cyan-500" /> {t('waterPump.activeTimer')}
              </span>
              <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                {pumpActiveSeconds}s
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-emerald-950/30 border border-slate-200 dark:border-emerald-500/20 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <History className="w-4 h-4 text-emerald-500" /> {t('waterPump.lastWatered')}
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-200">
                {telemetry.lastWatered}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-emerald-950/30 border border-slate-200 dark:border-emerald-500/20 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-500" /> {t('waterPump.todayVolume')}
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-200">
                {totalWateredDurationToday} sec (~{(totalWateredDurationToday * 0.045).toFixed(2)} L)
              </span>
            </div>
          </div>

          <div className="flex flex-col space-y-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => triggerManualWater(10)}
              disabled={isPumpActive || isAutoMode}
              className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${
                isPumpActive || isAutoMode
                  ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-600/30'
              }`}
            >
              <Sparkles className="w-4 h-4" /> {t('waterPump.quickWater')}
            </motion.button>
          </div>

        </div>

        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center space-x-2 text-xs font-medium text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span>
            {isAutoMode
              ? `Auto-watering is active. System will start the pump automatically if soil moisture drops below ${settings.autoWaterMinMoisture}%, and stop once it reaches ${settings.autoWaterTargetMoisture}%.`
              : 'Auto-watering is disabled. Manual override control enabled.'}
          </span>
        </div>

      </div>
    </div>
  );
};
