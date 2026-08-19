import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  BonsaiTelemetry,
  HealthAnalysis,
  NotificationItem,
  GalleryPhoto,
  UserProfile,
  AppSettings,
  HistoryDataPoint
} from '../types';
import { calculatePlantHealth } from '../services/healthCalculator';
import { translate, LanguageCode } from '../i18n/translations';
import { ensureSignedIn, subscribeTelemetry, sendControlCommand } from '../services/firebase';

interface AppContextType {
  telemetry: BonsaiTelemetry;
  health: HealthAnalysis;
  settings: AppSettings;
  user: UserProfile | null;
  notifications: NotificationItem[];
  photos: GalleryPhoto[];
  historyData: HistoryDataPoint[];
  historyFilter: 'day' | 'week' | 'month' | 'year';
  pumpActiveSeconds: number;
  totalWateredDurationToday: number;
  activeTab: string;
  isAuthModalOpen: boolean;
  isRebootingDevice: boolean;
  t: (path: string) => string;

  togglePump: (state?: boolean) => void;
  toggleAutoMode: (state?: boolean) => void;
  triggerManualWater: (durationSec?: number) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  setHistoryFilter: (filter: 'day' | 'week' | 'month' | 'year') => void;
  setActiveTab: (tab: string) => void;
  addGalleryPhoto: (photo: Omit<GalleryPhoto, 'id'>) => void;
  deleteGalleryPhoto: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  rebootDevice: () => void;
  login: (email: string) => void;
  register: (data: { email: string; name?: string; phone?: string; location?: string; plantName?: string; plantSpecies?: string }) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  logout: () => void;
  setIsAuthModalOpen: (open: boolean) => void;
}

const initialSettings: AppSettings = {
  darkMode: true,
  language: 'en',
  tempUnit: 'C',
  autoWaterMinMoisture: 30,
  autoWaterTargetMoisture: 70,
  pushNotifications: true,
  soundAlerts: true,
  criticalAlerts: true,
  firebaseUrl: 'https://smart-bonsai-iot-c7662-default-rtdb.asia-southeast1.firebasedatabase.app/bonsai',
  syncIntervalSec: 1,

  simulatedMode: false,
};

const initialTelemetry: BonsaiTelemetry = {
  temperature: 24.2,
  humidity: 62.0,
  soilMoisture: 28.5,
  light: 68.0,
  pump: false,
  autoMode: false,
  plantHealth: 92,
  lastWatered: 'Today, 08:30 AM',
  lastUpdated: new Date().toISOString(),
  deviceConnected: true,
  rssi: -58,
  batteryLevel: 94,
};

const initialUser: UserProfile = {
  name: 'Arachchi',
  email: 'curator@smartbonsai.io',
  photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  plantName: 'Banyan Bonsai',
  plantSpecies: 'Ficus benghalensis',
  plantAgeYears: 14,
  connectedDevice: 'ESP32-Bonsai-Node-01',
};

const initialNotifications: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Soil Moisture Warning',
    message: 'Soil moisture dropped to 28.5%. Automatic watering threshold triggered.',
    timestamp: '2 mins ago',
    severity: 'warning',
    read: false,
    category: 'water'
  },
  {
    id: 'n2',
    title: 'System Synced',
    message: 'ESP32 Node successfully synchronized telemetry with Firebase.',
    timestamp: '15 mins ago',
    severity: 'info',
    read: true,
    category: 'device'
  },
  {
    id: 'n3',
    title: 'Watering Completed',
    message: 'Automatic pump completed a 12-second watering cycle.',
    timestamp: '3 hours ago',
    severity: 'success',
    read: true,
    category: 'water'
  }
];

const initialPhotos: GalleryPhoto[] = [
  {
    id: 'p1',
    url: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=800&q=80',
    date: '2026-07-20',
    title: 'Summer Canopy Pruning',
    notes: 'Trimmed excess outer foliage shoots to allow sunlight penetration into inner branches.',
    category: 'Pruning',
    moistureAtTime: 58
  },
  {
    id: 'p2',
    url: 'https://images.unsplash.com/photo-1599598425947-0206455429d5?auto=format&fit=crop&w=800&q=80',
    date: '2026-06-15',
    title: 'Akadama Soil Mix Repotting',
    notes: 'Repotted into unglazed Japanese Tokoname ceramic pot with 70% Akadama + 30% Pumice mix.',
    category: 'Repotting',
    moistureAtTime: 65
  },
  {
    id: 'p3',
    url: 'https://images.unsplash.com/photo-1509937528035-ad76254b0356?auto=format&fit=crop&w=800&q=80',
    date: '2026-05-01',
    title: 'Organic Bio-Gold Fertilizer',
    notes: 'Applied organic slow-release solid fertilizer cakes along rim.',
    category: 'Fertilizer',
    moistureAtTime: 62
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [telemetry, setTelemetry] = useState<BonsaiTelemetry>(initialTelemetry);
  const [settings, setSettings] = useState<AppSettings>(initialSettings);
  const [user, setUser] = useState<UserProfile | null>(initialUser);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [photos, setPhotos] = useState<GalleryPhoto[]>(initialPhotos);
  const [historyFilter, setHistoryFilter] = useState<'day' | 'week' | 'month' | 'year'>('day');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isRebootingDevice, setIsRebootingDevice] = useState<boolean>(false);

  const [pumpActiveSeconds, setPumpActiveSeconds] = useState<number>(0);
  const [totalWateredDurationToday, setTotalWateredDurationToday] = useState<number>(48);

  const health = calculatePlantHealth(telemetry, settings.tempUnit);

  const t = (path: string) => translate(settings.language as LanguageCode, path);

  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  useEffect(() => {
    if (settings.simulatedMode) return;

    let unsubscribe: (() => void) | undefined;
    let staleTimer: ReturnType<typeof setInterval> | undefined;
    let cancelled = false;

    ensureSignedIn()
      .then(() => {
        if (cancelled) return;
        unsubscribe = subscribeTelemetry(
          (data) => {
            setTelemetry((prev) => ({
              ...prev,
              temperature: Number(data.temperature ?? prev.temperature),
              humidity: Number(data.humidity ?? prev.humidity),
              soilMoisture: Number(data.soilMoisture ?? prev.soilMoisture),
              light: Number(data.light ?? prev.light),
              pump: Boolean(data.pump ?? prev.pump),
              rssi: Number(data.rssi ?? prev.rssi),
              batteryLevel: Number(data.batteryLevel ?? prev.batteryLevel),
              soilFault: Boolean(data.soilFault ?? false),
              lightFault: Boolean(data.lightFault ?? false),
              dhtFault: Boolean(data.dhtFault ?? false),
              deviceConnected: true,
              lastUpdated: new Date().toISOString(),
            }));
          },
          () => {

            setTelemetry((prev) => ({ ...prev, deviceConnected: false }));
          }
        );

        staleTimer = setInterval(() => {
          setTelemetry((prev) => {
            const secondsSinceUpdate =
              (Date.now() - new Date(prev.lastUpdated).getTime()) / 1000;
            if (secondsSinceUpdate > 15 && prev.deviceConnected) {
              return { ...prev, deviceConnected: false };
            }
            return prev;
          });
        }, 5000);
      })
      .catch((err) => {
        console.error('Firebase sign-in failed:', err);
        setTelemetry((prev) => ({ ...prev, deviceConnected: false }));
      });

    return () => {
      cancelled = true;
      if (unsubscribe) unsubscribe();
      if (staleTimer) clearInterval(staleTimer);
    };
  }, [settings.simulatedMode]);

  useEffect(() => {
    if (settings.simulatedMode) return;
    sendControlCommand({
      autoMode: telemetry.autoMode,
      autoWaterMinMoisture: settings.autoWaterMinMoisture,
      autoWaterTargetMoisture: settings.autoWaterTargetMoisture,
    }).catch((err) => console.error('Failed to sync auto-watering settings:', err));
  }, [settings.simulatedMode, telemetry.autoMode, settings.autoWaterMinMoisture, settings.autoWaterTargetMoisture]);

  useEffect(() => {
    if (!settings.simulatedMode) return;
    const timer = setInterval(() => {
      setTelemetry((prev) => {
        let newMoisture = prev.soilMoisture;
        let newTemp = prev.temperature;
        let newHumidity = prev.humidity;
        let newLight = prev.light;
        let newPump = prev.pump;

        if (newPump) {
          newMoisture = Math.min(100, newMoisture + 1.8);
          setPumpActiveSeconds((sec) => sec + 1);
          setTotalWateredDurationToday((tot) => tot + 1);

          if (prev.autoMode && newMoisture >= settings.autoWaterTargetMoisture) {
            newPump = false;
            triggerNotification('Pump Auto Stopped', `Target soil moisture (${settings.autoWaterTargetMoisture}%) reached.`, 'success');
          }
        } else {

          newMoisture = Math.max(10, newMoisture - 0.04);

          newTemp = Number((prev.temperature + (Math.random() * 0.2 - 0.1)).toFixed(1));
          if (newTemp < 15) newTemp = 15;
          if (newTemp > 38) newTemp = 38;

          newHumidity = Number((prev.humidity + (Math.random() * 0.4 - 0.2)).toFixed(1));
          if (newHumidity < 20) newHumidity = 20;
          if (newHumidity > 95) newHumidity = 95;

          newLight = Number((prev.light + (Math.random() * 0.6 - 0.3)).toFixed(1));
          if (newLight < 10) newLight = 10;
          if (newLight > 100) newLight = 100;

          if (prev.autoMode && newMoisture < settings.autoWaterMinMoisture) {
            newPump = true;
            setPumpActiveSeconds(0);
            triggerNotification('Pump Auto Activated', `Soil moisture (${newMoisture.toFixed(1)}%) dropped below ${settings.autoWaterMinMoisture}% threshold.`, 'warning');
          }
        }

        const calculatedHealth = calculatePlantHealth({
          ...prev,
          soilMoisture: newMoisture,
          temperature: newTemp,
          humidity: newHumidity,
          light: newLight,
          pump: newPump
        });

        return {
          ...prev,
          soilMoisture: Number(newMoisture.toFixed(1)),
          temperature: newTemp,
          humidity: newHumidity,
          light: newLight,
          pump: newPump,
          plantHealth: calculatedHealth.score,
          lastUpdated: new Date().toISOString(),
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [settings.simulatedMode, settings.autoWaterMinMoisture, settings.autoWaterTargetMoisture]);

  const triggerNotification = (title: string, message: string, severity: 'info' | 'success' | 'warning' | 'critical') => {
    const newNotif: NotificationItem = {
      id: Date.now().toString(),
      title,
      message,
      timestamp: 'Just now',
      severity,
      read: false,
      category: 'water'
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const togglePump = (state?: boolean) => {
    setTelemetry((prev) => {
      if (prev.autoMode) {
        triggerNotification('Manual Control Blocked', 'Turn off Auto Mode to control the pump manually.', 'warning');
        return prev;
      }
      const nextState = state !== undefined ? state : !prev.pump;
      if (nextState) {
        setPumpActiveSeconds(0);
        triggerNotification('Water Pump Activated', 'Pump manually started by user.', 'info');
      } else {
        triggerNotification('Water Pump Stopped', `Pump stopped after ${pumpActiveSeconds}s.`, 'success');
      }
      if (!settings.simulatedMode) {

        sendControlCommand({ pump: nextState }).catch((err) =>
          console.error('Failed to send pump command:', err)
        );
      }
      return {
        ...prev,
        pump: nextState,
        lastWatered: nextState ? 'Just now' : prev.lastWatered
      };
    });
  };

  const toggleAutoMode = (state?: boolean) => {
    setTelemetry((prev) => {
      const nextState = state !== undefined ? state : !prev.autoMode;
      triggerNotification('Auto Mode Changed', `Automatic watering is now ${nextState ? 'ENABLED' : 'DISABLED'}.`, 'info');
      return { ...prev, autoMode: nextState };
    });
  };

  const triggerManualWater = (durationSec = 10) => {
    togglePump(true);
    setTimeout(() => {
      togglePump(false);
    }, durationSec * 1000);
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const addGalleryPhoto = (photo: Omit<GalleryPhoto, 'id'>) => {
    const newPhotoItem: GalleryPhoto = {
      ...photo,
      id: Date.now().toString(),
      moistureAtTime: telemetry.soilMoisture
    };
    setPhotos((prev) => [newPhotoItem, ...prev]);
  };

  const deleteGalleryPhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const rebootDevice = () => {
    setIsRebootingDevice(true);
    setTelemetry((prev) => ({ ...prev, deviceConnected: false }));
    triggerNotification('ESP32 Rebooting', 'Remote restart command sent to ESP32 board.', 'warning');

    if (!settings.simulatedMode) {
      sendControlCommand({ reboot: true }).catch((err) =>
        console.error('Failed to send reboot command:', err)
      );
    }

    setTimeout(() => {
      setIsRebootingDevice(false);
      setTelemetry((prev) => ({ ...prev, deviceConnected: true }));
      triggerNotification('ESP32 Online', 'ESP32 board rebooted and reconnected to Wi-Fi.', 'success');
    }, 4000);
  };

  const login = (email: string) => {
    setUser({
      ...initialUser,
      email,
      name: email.split('@')[0].toUpperCase() || 'Bonsai Master'
    });
    setIsAuthModalOpen(false);
  };

  const register = (data: { email: string; name?: string; phone?: string; location?: string; plantName?: string; plantSpecies?: string }) => {
    setUser({
      ...initialUser,
      email: data.email,
      name: data.name?.trim() || data.email.split('@')[0].toUpperCase() || 'Bonsai Master',
      phone: data.phone?.trim() || undefined,
      location: data.location?.trim() || undefined,
      plantName: data.plantName?.trim() || initialUser.plantName,
      plantSpecies: data.plantSpecies?.trim() || initialUser.plantSpecies,
    });
    setIsAuthModalOpen(false);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  };

  const logout = () => {
    setUser(null);
  };

  const generateHistoryData = (): HistoryDataPoint[] => {
    const points: HistoryDataPoint[] = [];
    const count = historyFilter === 'day' ? 24 : historyFilter === 'week' ? 7 : historyFilter === 'month' ? 30 : 12;

    for (let i = 0; i < count; i++) {
      let label = `${i}:00`;
      if (historyFilter === 'week') label = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i % 7];
      if (historyFilter === 'month') label = `Day ${i + 1}`;
      if (historyFilter === 'year') label = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i % 12];

      const baseMoisture = 55 + Math.sin(i * 0.5) * 20;
      const baseTemp = 22 + Math.cos(i * 0.4) * 5;
      const baseHumidity = 60 + Math.sin(i * 0.3) * 12;
      const baseLight = 40 + Math.sin(i * 0.8) * 35;

      points.push({
        time: label,
        soilMoisture: Number(Math.max(15, Math.min(95, baseMoisture)).toFixed(1)),
        temperature: Number(Math.max(10, Math.min(40, baseTemp)).toFixed(1)),
        humidity: Number(Math.max(30, Math.min(90, baseHumidity)).toFixed(1)),
        light: Number(Math.max(0, Math.min(100, baseLight)).toFixed(1)),
        pumpActive: i % 6 === 0 ? 1 : 0
      });
    }
    return points;
  };

  const historyData = generateHistoryData();

  return (
    <AppContext.Provider
      value={{
        telemetry,
        health,
        settings,
        user,
        notifications,
        photos,
        historyData,
        historyFilter,
        pumpActiveSeconds,
        totalWateredDurationToday,
        activeTab,
        isAuthModalOpen,
        isRebootingDevice,
        t,
        togglePump,
        toggleAutoMode,
        triggerManualWater,
        updateSettings,
        setHistoryFilter,
        setActiveTab,
        addGalleryPhoto,
        deleteGalleryPhoto,
        markNotificationAsRead,
        clearAllNotifications,
        rebootDevice,
        login,
        register,
        updateProfile,
        logout,
        setIsAuthModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
