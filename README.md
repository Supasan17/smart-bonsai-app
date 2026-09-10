# 🌱 Smart Bonsai

A real-time IoT bonsai care dashboard: an ESP32 board reads soil moisture,
temperature, humidity, and light, and controls an automatic watering
pump — all synced live to this web app through Firebase.

**Live app:** [https://smart-bonsai-app.vercel.app/](https://smart-bonsai-app.vercel.app/)

👉 **New here? Start with [`SETUP_GUIDE.md`](./SETUP_GUIDE.md)** — it walks
through wiring the ESP32 (including a pin diagram), uploading the
firmware, connecting Firebase, and deploying this app, step by step.

## Project structure

- `src/` — the React + TypeScript + Vite web app
- `esp32_firmware/SmartBonsai_ESP32/` — Arduino sketch that runs on the ESP32
- `esp32_firmware/RelayTest/` — standalone sketch for testing just the pump relay
- `firebase/database.rules.json` — Realtime Database security rules
- `.github/workflows/deploy.yml` — optional GitHub Pages deploy workflow

## Local development

```bash
npm install
npm run dev
```

## Data source: Live vs Demo

In the app's **Settings** tab, toggle **Data Source** between:
- **Live Data** — reads real sensor data from your ESP32 via Firebase
- **Demo Data** — simulated sample data, no hardware required

## Build 1

```bash
npm run build
```
