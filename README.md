# 🌱 Smart Bonsai

A real-time IoT bonsai care dashboard: an ESP32 board reads soil moisture,
temperature, humidity, and light, and controls an automatic watering pump —
all synced live to this web app through Firebase.

👉 **New here? Start with [`SETUP_GUIDE.md`](./SETUP_GUIDE.md)** — it walks
through wiring the ESP32, uploading the firmware, connecting Firebase, and
hosting this app on GitHub Pages, step by step. It also includes a pin
diagram guide and a link to the live web app.

🔗 **Live web app:** https://smart-bonsai-app.vercel.app/

## Project structure

- `src/` — the React + TypeScript + Vite web app
- `esp32_firmware/SmartBonsai_ESP32/` — Arduino sketch that runs on the ESP32
- `firebase/database.rules.json` — Realtime Database security rules
- `.github/workflows/deploy.yml` — auto-deploys `src/` to GitHub Pages on push

## Local development

```bash
npm install
npm run dev
```

## Data source: Live vs Demo

In the app's **Settings** tab, toggle **Data Source** between:
- **Live Data** — reads real sensor data from your ESP32 via Firebase
- **Demo Data** — simulated sample data, no hardware required

## Build

```bash
npm run build
```
