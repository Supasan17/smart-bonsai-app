import React from 'react';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { CircularGauge } from '../components/CircularGauge';
import { WaterPumpCard } from '../components/WaterPumpCard';
import { PlantHealthCard } from '../components/PlantHealthCard';
import {
  Droplet,
  Thermometer,
  Wind,
  Sun,
  ShieldCheck,
  Zap,
  WifiOff
} from 'lucide-react';
import { toDisplayTemp, formatTemp, convertRange } from '../utils/temperature';

export const DashboardView: React.FC = () => {
  const { telemetry, settings, user, t } = useApp();
  const isOffline = !settings.simulatedMode && !telemetry.deviceConnected;

  const tempValue = toDisplayTemp(telemetry.temperature, settings.tempUnit);
  const tempUnitStr = `°${settings.tempUnit}`;
  const [tempNormalMin, tempNormalMax] = convertRange([18, 28], settings.tempUnit);
  const [tempWarnMin, tempWarnMax] = convertRange([12, 34], settings.tempUnit);

  return (
    <div className="space-y-6 pb-24">

      <Header />

      {isOffline && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-800/90 border border-slate-600/50 text-slate-200">
          <WifiOff className="w-5 h-5 text-amber-400 shrink-0" />
          <div className="text-sm">
            <span className="font-bold text-amber-400">ESP32 is offline.</span>{' '}
            The numbers below are the last reading received
            {telemetry.lastUpdated ? ` (${new Date(telemetry.lastUpdated).toLocaleTimeString()})` : ''} —
            not live data. Check the board's power and Wi-Fi.
          </div>
        </div>
      )}

      <div className="relative p-6 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white shadow-2xl overflow-hidden border border-emerald-500/30">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-25 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-400 via-transparent to-transparent" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 w-max mx-auto md:mx-0">
              <ShieldCheck className="w-3.5 h-3.5" /> {t('dashboard.heroBadge')}
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold font-outfit tracking-tight">
              {user?.plantName || 'Banyan Bonsai'}
            </h2>
            <p className="text-xs md:text-sm text-emerald-100/80 max-w-md">
              {t('dashboard.heroSubtitle')}
            </p>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-400 opacity-50 blur-lg group-hover:opacity-80 transition duration-500" />
            <img
              src="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=600&q=80"
              alt="Bonsai Plant"
              className="relative w-36 h-28 md:w-44 md:h-32 rounded-2xl object-cover shadow-2xl border border-white/20"
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white font-outfit flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-500" /> {t('dashboard.gaugesTitle')}
          </h2>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {t('dashboard.updatedEvery')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <CircularGauge
            label={t('dashboard.soilMoisture')}
            value={telemetry.soilMoisture}
            unit="%"
            icon={<Droplet className="w-5 h-5 text-cyan-500" />}
            normalRange={[35, 75]}
            warningRange={[20, 85]}
            subText={telemetry.soilFault ? 'Sensor fault — showing last good reading' : t('dashboard.targetMoisture')}
            offline={isOffline || Boolean(telemetry.soilFault)}
          />

          <CircularGauge
            label={t('dashboard.temperature')}
            value={Number(tempValue.toFixed(1))}
            unit={tempUnitStr}
            icon={<Thermometer className="w-5 h-5 text-amber-500" />}
            normalRange={[tempNormalMin, tempNormalMax]}
            warningRange={[tempWarnMin, tempWarnMax]}
            subText={telemetry.dhtFault ? 'Sensor fault — showing last good reading' : `Optimal: ${formatTemp(18, settings.tempUnit, 0)} – ${formatTemp(28, settings.tempUnit, 0)}`}
            offline={isOffline || Boolean(telemetry.dhtFault)}
          />

          <CircularGauge
            label={t('dashboard.humidity')}
            value={telemetry.humidity}
            unit="%"
            icon={<Wind className="w-5 h-5 text-blue-400" />}
            normalRange={[50, 75]}
            warningRange={[30, 85]}
            subText={telemetry.dhtFault ? 'Sensor fault — showing last good reading' : t('dashboard.optimalHumidity')}
            offline={isOffline || Boolean(telemetry.dhtFault)}
          />

          <CircularGauge
            label={t('dashboard.light')}
            value={telemetry.light}
            unit="%"
            icon={<Sun className="w-5 h-5 text-yellow-400" />}
            normalRange={[50, 85]}
            warningRange={[25, 95]}
            subText={telemetry.lightFault ? 'Sensor fault — showing last good reading' : t('dashboard.idealLight')}
            offline={isOffline || Boolean(telemetry.lightFault)}
          />

        </div>
      </div>

      <WaterPumpCard />

      <PlantHealthCard />
    </div>
  );
};
