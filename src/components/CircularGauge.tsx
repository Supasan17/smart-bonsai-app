import React from 'react';
import { motion } from 'framer-motion';

interface CircularGaugeProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  unit: string;
  icon: React.ReactNode;
  normalRange: [number, number];
  warningRange?: [number, number];
  subText?: string;
  colorOverride?: string;
  offline?: boolean;
}

export const CircularGauge: React.FC<CircularGaugeProps> = ({
  label,
  value,
  min = 0,
  max = 100,
  unit,
  icon,
  normalRange,
  warningRange,
  subText,
  colorOverride,
  offline = false
}) => {

  let statusColor = '#10B981';
  let statusLabel = 'Normal';
  let glowClass = 'shadow-glow-emerald';

  if (offline) {
    statusColor = '#64748B';
    statusLabel = 'Offline';
    glowClass = '';
  } else if (colorOverride) {
    statusColor = colorOverride;
  } else {
    if (value < normalRange[0]) {
      if (warningRange && value < warningRange[0]) {
        statusColor = '#EF4444';
        statusLabel = 'Critical Low';
        glowClass = 'shadow-glow-danger';
      } else {
        statusColor = '#F59E0B';
        statusLabel = 'Warning Low';
        glowClass = 'shadow-glow-warning';
      }
    } else if (value > normalRange[1]) {
      if (warningRange && value > warningRange[1]) {
        statusColor = '#EF4444';
        statusLabel = 'Critical High';
        glowClass = 'shadow-glow-danger';
      } else {
        statusColor = '#F59E0B';
        statusLabel = 'Warning High';
        glowClass = 'shadow-glow-warning';
      }
    }
  }

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`relative p-5 rounded-3xl bg-white/80 dark:bg-[#12231E]/80 backdrop-blur-xl border border-white/40 dark:border-emerald-500/20 shadow-xl ${glowClass} overflow-hidden group ${offline ? 'grayscale opacity-60' : ''}`}
    >

      <div
        className="absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl opacity-20 pointer-events-none transition-all duration-500 group-hover:opacity-40"
        style={{ backgroundColor: statusColor }}
      />

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div
            className="p-2 rounded-2xl bg-slate-100 dark:bg-emerald-950/60 border border-slate-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
          >
            {icon}
          </div>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {label}
          </span>
        </div>

        <span
          className="px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full border text-white shadow-sm"
          style={{
            backgroundColor: `${statusColor}25`,
            borderColor: `${statusColor}60`,
            color: statusColor === '#10B981' ? '#34D399' : statusColor
          }}
        >
          {statusLabel}
        </span>
      </div>

      <div className="relative flex items-center justify-center my-3">

        <svg className="w-32 h-32 transform -rotate-90">

          <circle
            cx="64"
            cy="64"
            r={radius}
            className="stroke-slate-200 dark:stroke-emerald-950/80"
            strokeWidth="10"
            fill="transparent"
          />

          <motion.circle
            cx="64"
            cy="64"
            r={radius}
            stroke={statusColor}
            strokeWidth="10"
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <motion.span
            className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-outfit"
            key={value}
            initial={{ scale: 0.9, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {offline ? '--' : value.toFixed(1)}
          </motion.span>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {unit}
          </span>
        </div>
      </div>

      {subText && (
        <div className="text-center text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
          {subText}
        </div>
      )}
    </motion.div>
  );
};
