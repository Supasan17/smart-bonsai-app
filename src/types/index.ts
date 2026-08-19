export interface BonsaiTelemetry {
  temperature: number;
  humidity: number;
  soilMoisture: number;
  light: number;
  pump: boolean;
  autoMode: boolean;
  plantHealth: number;
  lastWatered: string;
  lastUpdated: string;
  deviceConnected: boolean;
  rssi: number;
  batteryLevel: number;

  soilFault?: boolean;
  lightFault?: boolean;
  dhtFault?: boolean;
}

export type HealthStatusLevel = 'Excellent' | 'Good' | 'Warning' | 'Critical';

export interface HealthAnalysis {
  score: number;
  status: HealthStatusLevel;
  badgeColor: string;
  recommendations: string[];
  factors: {
    moisture: { status: string; score: number };
    temperature: { status: string; score: number };
    humidity: { status: string; score: number };
    light: { status: string; score: number };
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  severity: 'info' | 'success' | 'warning' | 'critical';
  read: boolean;
  category: 'water' | 'device' | 'telemetry' | 'system';
}

export interface GalleryPhoto {
  id: string;
  url: string;
  date: string;
  title: string;
  notes: string;
  category: 'Pruning' | 'Repotting' | 'Fertilizer' | 'General' | 'Inspection';
  moistureAtTime?: number;
}

export interface UserProfile {
  name: string;
  email: string;
  photoUrl: string;
  plantName: string;
  plantSpecies: string;
  plantAgeYears: number;
  connectedDevice: string;
  phone?: string;
  location?: string;
}

export interface AppSettings {
  darkMode: boolean;
  language: 'en' | 'si';
  tempUnit: 'C' | 'F';
  autoWaterMinMoisture: number;
  autoWaterTargetMoisture: number;
  pushNotifications: boolean;
  soundAlerts: boolean;
  criticalAlerts: boolean;
  firebaseUrl: string;
  syncIntervalSec: number;
  simulatedMode: boolean;
}

export interface HistoryDataPoint {
  time: string;
  soilMoisture: number;
  temperature: number;
  humidity: number;
  light: number;
  pumpActive: number;
}
