import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';
import {
  LineChart,
  Calendar,
  Droplet,
  Thermometer,
  Wind,
  Sun,
  Zap,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

import { toDisplayTemp } from '../utils/temperature';

export const HistoryView: React.FC = () => {
  const { historyData, historyFilter, setHistoryFilter, settings, t } = useApp();
  const [activeMetric, setActiveMetric] = useState<'soilMoisture' | 'temperature' | 'humidity' | 'light' | 'pumpActive'>('soilMoisture');

  const filterOptions: Array<{ id: 'day' | 'week' | 'month' | 'year'; label: string }> = [
    { id: 'day', label: t('history.day') },
    { id: 'week', label: t('history.week') },
    { id: 'month', label: t('history.month') },
    { id: 'year', label: t('history.year') },
  ];

  const displayData = historyData.map((d) => ({
    ...d,
    temperature: toDisplayTemp(d.temperature, settings.tempUnit),
  }));

  const metricConfigs = {
    soilMoisture: {
      name: 'Soil Moisture',
      unit: '%',
      color: '#06B6D4',
      icon: <Droplet className="w-4 h-4 text-cyan-500" />
    },
    temperature: {
      name: 'Temperature',
      unit: `°${settings.tempUnit}`,
      color: '#F59E0B',
      icon: <Thermometer className="w-4 h-4 text-amber-500" />
    },
    humidity: {
      name: 'Humidity',
      unit: '%',
      color: '#3B82F6',
      icon: <Wind className="w-4 h-4 text-blue-500" />
    },
    light: {
      name: 'Light Intensity',
      unit: '%',
      color: '#EAB308',
      icon: <Sun className="w-4 h-4 text-yellow-500" />
    },
    pumpActive: {
      name: 'Pump Runtime',
      unit: 'Cycles',
      color: '#10B981',
      icon: <Zap className="w-4 h-4 text-emerald-500" />
    }
  };

  const currentMetric = metricConfigs[activeMetric];

  const values = displayData.map((d) => d[activeMetric]);
  const avgVal = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  const minVal = Math.min(...values).toFixed(1);
  const maxVal = Math.max(...values).toFixed(1);

  return (
    <div className="space-y-6 pb-24">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white/80 dark:bg-[#12231E]/80 backdrop-blur-xl border border-white/40 dark:border-emerald-500/20 shadow-xl">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white font-outfit flex items-center gap-2">
            <LineChart className="w-6 h-6 text-emerald-500" /> {t('history.title')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('history.subtitle')}
          </p>
        </div>

        <div className="flex items-center space-x-1 p-1.5 rounded-2xl bg-slate-100 dark:bg-emerald-950/60 border border-slate-200 dark:border-emerald-500/30">
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setHistoryFilter(opt.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                historyFilter === opt.id
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {(Object.keys(metricConfigs) as Array<keyof typeof metricConfigs>).map((key) => {
          const cfg = metricConfigs[key];
          const isSel = activeMetric === key;
          return (
            <button
              key={key}
              onClick={() => setActiveMetric(key)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isSel
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-lg scale-105'
                  : 'bg-white/80 dark:bg-[#12231E]/60 border-slate-200 dark:border-emerald-500/20 text-slate-600 dark:text-slate-400 hover:border-emerald-500/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                {cfg.icon}
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {cfg.unit}
                </span>
              </div>
              <div className="text-xs font-bold font-outfit text-slate-900 dark:text-white">
                {cfg.name}
              </div>
            </button>
          );
        })}
      </div>

      <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#12231E]/80 backdrop-blur-xl border border-white/40 dark:border-emerald-500/20 shadow-2xl">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit">
              {currentMetric.name} Trend ({historyFilter.toUpperCase()})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Average: <span className="font-bold text-emerald-500">{avgVal} {currentMetric.unit}</span>
            </p>
          </div>

          <div className="flex items-center space-x-4 text-xs font-medium">
            <span className="flex items-center text-emerald-500">
              <ArrowUpRight className="w-4 h-4 mr-0.5" /> Max {maxVal}
            </span>
            <span className="flex items-center text-amber-500">
              <ArrowDownRight className="w-4 h-4 mr-0.5" /> Min {minVal}
            </span>
          </div>
        </div>

        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            {activeMetric === 'pumpActive' ? (
              <BarChart data={displayData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F231D',
                    borderColor: '#10B981',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="pumpActive" fill="#10B981" radius={[6, 6, 0, 0]} />
              </BarChart>
            ) : (
              <AreaChart data={displayData}>
                <defs>
                  <linearGradient id="metricGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={currentMetric.color} stopOpacity={0.5} />
                    <stop offset="95%" stopColor={currentMetric.color} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F231D',
                    borderColor: currentMetric.color,
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={activeMetric}
                  stroke={currentMetric.color}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#metricGrad)"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
