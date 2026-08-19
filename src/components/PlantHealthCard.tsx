import React from 'react';
import { useApp } from '../context/AppContext';
import {
  HeartPulse,
  Sparkles,
  CheckCircle2,
  Thermometer,
  Droplets,
  Sun,
  Wind
} from 'lucide-react';
import { formatTemp } from '../utils/temperature';

export const PlantHealthCard: React.FC = () => {
  const { health, telemetry, settings, t } = useApp();

  return (
    <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#12231E]/80 backdrop-blur-xl border border-white/40 dark:border-emerald-500/20 shadow-xl mb-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500">
            <HeartPulse className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white font-outfit">
              {t('plantHealth.title')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('plantHealth.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">

        <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-50 dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-500/20 text-center">
          <div className="relative flex items-center justify-center my-2">
            <svg className="w-36 h-36 transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="56"
                className="stroke-slate-200 dark:stroke-emerald-950"
                strokeWidth="12"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="56"
                stroke={health.badgeColor}
                strokeWidth="12"
                strokeDasharray={351.8}
                strokeDashoffset={351.8 - (health.score / 100) * 351.8}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-outfit">
                {health.score}%
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                {t('plantHealth.healthIndex')}
              </span>
            </div>
          </div>

          <span
            className="px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-md mt-2"
            style={{ backgroundColor: health.badgeColor }}
          >
            {health.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-emerald-950/30 border border-slate-200 dark:border-emerald-500/20">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-cyan-500" /> {t('plantHealth.moisture')}
              </span>
              <span className="font-bold text-slate-900 dark:text-white">{telemetry.soilMoisture}%</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-500">
              {health.factors.moisture.status}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-emerald-950/30 border border-slate-200 dark:border-emerald-500/20">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-amber-500" /> {t('plantHealth.temperature')}
              </span>
              <span className="font-bold text-slate-900 dark:text-white">{formatTemp(telemetry.temperature, settings.tempUnit)}</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-500">
              {health.factors.temperature.status}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-emerald-950/30 border border-slate-200 dark:border-emerald-500/20">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-blue-400" /> {t('plantHealth.humidity')}
              </span>
              <span className="font-bold text-slate-900 dark:text-white">{telemetry.humidity}%</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-500">
              {health.factors.humidity.status}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-emerald-950/30 border border-slate-200 dark:border-emerald-500/20">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-yellow-400" /> {t('plantHealth.light')}
              </span>
              <span className="font-bold text-slate-900 dark:text-white">{telemetry.light}%</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-500">
              {health.factors.light.status}
            </span>
          </div>

        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-emerald-950/30 border border-slate-200 dark:border-emerald-500/20">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> {t('plantHealth.recommendations')}
          </h3>

          <div className="space-y-2">
            {health.recommendations.map((rec, i) => (
              <div key={i} className="flex items-start space-x-2 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
