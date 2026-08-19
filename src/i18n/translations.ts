export type LanguageCode = 'en' | 'si';

const dict = {
  nav: {
    dashboard: { en: 'Dashboard', si: 'උපකරණ පුවරුව' },
    analytics: { en: 'Analytics', si: 'විශ්ලේෂණ' },
    gallery: { en: 'Gallery', si: 'ගැලරිය' },
    alerts: { en: 'Alerts', si: 'ඇඟවීම්' },
    device: { en: 'Device', si: 'උපකරණය' },
    settings: { en: 'Settings', si: 'සැකසුම්' },
    profile: { en: 'Profile', si: 'පැතිකඩ' },
  },
  common: {
    signIn: { en: 'Sign In', si: 'පිවිසෙන්න' },
    signOut: { en: 'Sign Out', si: 'ඉවත් වන්න' },
    save: { en: 'Save', si: 'සුරකින්න' },
    cancel: { en: 'Cancel', si: 'අවලංගු කරන්න' },
    edit: { en: 'Edit', si: 'සංස්කරණය' },
  },
  header: {
    helloPrefix: { en: 'Hello,', si: 'ආයුබෝවන්,' },
    welcomeGuest: { en: 'Welcome Guest', si: 'ආගන්තුකයාට සාදරයෙන් පිළිගනිමු' },
    online: { en: 'ESP32 Online', si: 'ESP32 සබැඳිය' },
    offline: { en: 'Offline', si: 'විසන්ධි විය' },
    notifications: { en: 'Notifications', si: 'දැනුම්දීම්' },
    toggleTheme: { en: 'Toggle Theme', si: 'තේමාව මාරු කරන්න' },
    profileSettings: { en: 'Profile Settings', si: 'පැතිකඩ සැකසුම්' },
    signIn: { en: 'Sign In', si: 'පිවිසෙන්න' },
  },
  dashboard: {
    heroBadge: { en: 'ESP32 Realtime Node Connected', si: 'ESP32 තථ්‍ය කාල නෝඩය සම්බන්ධයි' },
    heroSubtitle: {
      en: 'Automated Micro-Irrigation & Micro-Climate Control Active. 24/7 Sensor Telemetry Online.',
      si: 'ස්වයංක්‍රීය ක්ෂුද්‍ර-වාරි මාර්ග සහ ක්ෂුද්‍ර දේශගුණ පාලනය සක්‍රියයි. දිගටම සංවේදක දත්ත සබැඳිතාව.',
    },
    gaugesTitle: { en: 'Live Sensor Telemetry Gauges', si: 'සජීවී සංවේදක මිනුම්' },
    updatedEvery: { en: 'Updated every 1s', si: 'සෑම තත්පර 1කට වරක් යාවත්කාලීන කෙරේ' },
    soilMoisture: { en: 'Soil Moisture', si: 'පස තෙතමනය' },
    temperature: { en: 'Temperature', si: 'උෂ්ණත්වය' },
    humidity: { en: 'Air Humidity', si: 'වායු ආර්ද්‍රතාව' },
    light: { en: 'Light Intensity', si: 'ආලෝක තීව්‍රතාව' },
    targetMoisture: { en: 'Target: 45% – 70%', si: 'ඉලක්කය: 45% – 70%' },
    optimalHumidity: { en: 'Optimal: 50% – 75%', si: 'ප්‍රශස්ත: 50% – 75%' },
    idealLight: { en: 'Ideal: Full Daylight', si: 'ප්‍රශස්ත: සම්පූර්ණ දිවා එළිය' },
  },
  waterPump: {
    title: { en: 'Water Pump Control System', si: 'ජල පොම්ප පාලන පද්ධතිය' },
    subtitle: { en: 'Submersible Micro-Pump • ESP32 GPIO Relay Node', si: 'ගිල්වුම් ක්ෂුද්‍ර පොම්පය • ESP32 GPIO රිලේ නෝඩය' },
    autoMode: { en: 'Auto Mode', si: 'ස්වයංක්‍රීය ප්‍රකාරය' },
    pumpActive: { en: 'PUMP IS ACTIVE', si: 'පොම්පය ක්‍රියාත්මකයි' },
    pumpOff: { en: 'PUMP IS OFF', si: 'පොම්පය ක්‍රියා විරහිතයි' },
    activeTimer: { en: 'Active Session Timer', si: 'ක්‍රියාකාරී සැසි ටයිමරය' },
    lastWatered: { en: 'Last Watered', si: 'අවසන් වතුර දැමූ අවස්ථාව' },
    todayVolume: { en: "Today's Total Volume", si: 'අද මුළු ජල පරිමාව' },
    quickWater: { en: 'Quick Water (10 Sec)', si: 'ඉක්මන් ජලය (තත්. 10)' },
  },
  plantHealth: {
    title: { en: 'AI Plant Health & Diagnostics', si: 'AI ශාක සෞඛ්‍ය සහ රෝග විනිශ්චය' },
    subtitle: { en: 'Realtime telemetry matrix • Neural wellness score', si: 'තථ්‍ය කාල දත්ත න්‍යාසය • ස්නායු සුවතා ලකුණු' },
    healthIndex: { en: 'Health Index', si: 'සෞඛ්‍ය දර්ශකය' },
    recommendations: { en: 'Smart Care Recommendations', si: 'ස්මාර්ට් රැකවරණ නිර්දේශ' },
    moisture: { en: 'Moisture', si: 'තෙතමනය' },
    temperature: { en: 'Temperature', si: 'උෂ්ණත්වය' },
    humidity: { en: 'Humidity', si: 'ආර්ද්‍රතාව' },
    light: { en: 'Light', si: 'ආලෝකය' },
  },
  device: {
    title: { en: 'ESP32 IoT Node Diagnostics', si: 'ESP32 IoT නෝඩ රෝග විනිශ්චය' },
    subtitle: { en: 'Hardware status, Wi-Fi telemetry, GPIO pin mapping & OTA firmware', si: 'දෘඪාංග තත්ත්වය, Wi-Fi දත්ත, GPIO පින් සිතියම්කරණය සහ OTA ස්ථිරාංග' },
    restart: { en: 'Restart Device', si: 'උපාංගය නැවත ආරම්භ කරන්න' },
    rebooting: { en: 'Rebooting ESP32...', si: 'ESP32 නැවත ආරම්භ වෙමින්...' },
    status: { en: 'ESP32 Status', si: 'ESP32 තත්ත්වය' },
    wifiSignal: { en: 'Wi-Fi Signal Strength', si: 'Wi-Fi සංඥා ශක්තිය' },
  },
  settings: {
    title: { en: 'Preferences & System Settings', si: 'මනාපයන් සහ පද්ධති සැකසුම්' },
    subtitle: { en: 'Configure app appearance, units, threshold triggers, and telemetry sync', si: 'යෙදුම් පෙනුම, ඒකක, සීමා අවුලුවන සහ දත්ත සමමුහුර්තකරණය වින්‍යාස කරන්න' },
    appearance: { en: 'Appearance & Localization', si: 'පෙනුම සහ භාෂාව' },
    themeMode: { en: 'Theme Mode', si: 'තේමා ප්‍රකාරය' },
    themeSub: { en: 'Toggle Light and Dark UI', si: 'ආලෝක සහ අඳුරු UI මාරු කරන්න' },
    tempUnit: { en: 'Temperature Unit', si: 'උෂ්ණත්ව ඒකකය' },
    tempUnitSub: { en: 'Choose Celsius (°C) or Fahrenheit (°F)', si: 'සෙල්සියස් (°C) හෝ ෆැරන්හයිට් (°F) තෝරන්න' },
    language: { en: 'Language', si: 'භාෂාව' },
    languageSub: { en: 'System display language', si: 'පද්ධති සංදර්ශන භාෂාව' },
    autoWaterTitle: { en: 'Automatic Water Triggers', si: 'ස්වයංක්‍රීය ජල ට්‍රිගර' },
    syncTitle: { en: 'Telemetry Sync Configuration', si: 'දත්ත සමමුහුර්ත වින්‍යාසය' },
  },
  profile: {
    title: { en: 'User Profile', si: 'පරිශීලක පැතිකඩ' },
    subtitle: { en: 'Manage your account credentials, connected IoT hardware, and preferences', si: 'ඔබගේ ගිණුම් තොරතුරු, සම්බන්ධිත උපාංග සහ මනාපයන් කළමනාකරණය කරන්න' },
    editProfile: { en: 'Edit Profile', si: 'පැතිකඩ සංස්කරණය' },
    connectedDevice: { en: 'Connected Device', si: 'සම්බන්ධිත උපාංගය' },
    primaryPlant: { en: 'Primary Plant', si: 'ප්‍රධාන ශාකය' },
    signOut: { en: 'Sign Out', si: 'ඉවත් වන්න' },
    signInTitle: { en: 'Sign In to Smart Bonsai', si: 'ස්මාර්ට් බොන්සායි වෙත පිවිසෙන්න' },
    signInSub: {
      en: 'Access remote ESP32 telemetry, auto-watering settings, and photo timeline journal.',
      si: 'දුරස්ථ ESP32 දත්ත, ස්වයංක්‍රීය ජලය දැමීමේ සැකසුම් සහ ඡායාරූප දිනපොතට ප්‍රවේශ වන්න.',
    },
    signInRegister: { en: 'Sign In / Register', si: 'පිවිසෙන්න / ලියාපදිංචි වන්න' },
  },
  history: {
    title: { en: 'Historical Telemetry Analytics', si: 'ඓතිහාසික දත්ත විශ්ලේෂණය' },
    subtitle: { en: 'Time-series data logged from ESP32 moisture & climate sensors', si: 'ESP32 තෙතමනය සහ දේශගුණ සංවේදකවලින් සටහන් කළ කාල-ශ්‍රේණි දත්ත' },
    day: { en: 'Day (24h)', si: 'දිනය (පැය 24)' },
    week: { en: 'Week', si: 'සතිය' },
    month: { en: 'Month', si: 'මාසය' },
    year: { en: 'Year', si: 'වර්ෂය' },
  },
  gallery: {
    title: { en: 'Bonsai Growth Gallery & Journal', si: 'බොන්සායි වර්ධන ගැලරිය සහ දිනපොත' },
    subtitle: {
      en: 'Capture photos, track aesthetic evolution, and log pruning/repotting events',
      si: 'ඡායාරූප ග්‍රහණය කරන්න, සෞන්දර්යාත්මක වර්ධනය නිරීක්ෂණය කරන්න, සහ සිදුවීම් සටහන් කරන්න',
    },
    addPhoto: { en: 'Add Photo Log', si: 'ඡායාරූප සටහනක් එකතු කරන්න' },
  },
  notifications: {
    title: { en: 'Notifications & Alerts', si: 'දැනුම්දීම් සහ ඇඟවීම්' },
    subtitle: { en: 'System events, warnings, and telemetry triggered alerts', si: 'පද්ධති සිදුවීම්, අනතුරු ඇඟවීම් සහ දත්ත මගින් අවුලවන ඇඟවීම්' },
  },
} as const;

type Dict = typeof dict;

export function translate(lang: LanguageCode, path: string): string {
  const parts = path.split('.');

  let node: any = dict;
  for (const part of parts) {
    node = node?.[part];
    if (node === undefined) return path;
  }
  if (node && typeof node === 'object' && (node.en || node.si)) {
    return node[lang] ?? node.en ?? path;
  }
  return path;
}

export type { Dict };
