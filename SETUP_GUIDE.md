# 🌱 Smart Bonsai — Complete Setup Guide

This guide takes you from "the app shows fake numbers" to "the app shows
real numbers from my own ESP32 sensors, hosted online, working end to end."

Follow the parts **in order**. Each step tells you exactly what to click,
type, or plug in. You don't need to understand everything — just follow
along, and it will work.

🔗 **Live web app:** [https://smart-bonsai-app.vercel.app/](https://smart-bonsai-app.vercel.app/)
— you can open this right now to see the dashboard UI, even before your
ESP32 is wired up (it will show demo data until you switch it to Live Data
in Part 7).

---

## 📦 What's in this ZIP file

```
smart_bonsai_app/
│
├── src/                         ← the website app (React)
│   └── services/firebase.ts     ← connects the app to your Firebase database
│
├── esp32_firmware/
│   └── SmartBonsai_ESP32/
│       └── SmartBonsai_ESP32.ino   ← the code that goes ON the ESP32 board
│
├── firebase/
│   └── database.rules.json      ← security rules for your database
│
├── .github/workflows/deploy.yml ← makes GitHub host your app automatically
├── vite.config.ts               ← configured for GitHub Pages
└── SETUP_GUIDE.md               ← this file
```

## 🧰 What you need before starting

**Hardware**
- 1x ESP32 38-pin DevKit board (ESP32-WROOM-32)
- 1x Capacitive soil moisture sensor (analog output)
- 1x DHT22 temperature & humidity sensor
- 1x LDR (light-dependent resistor) + 1x 10kΩ resistor (for a light sensor)
- 1x 1-channel 5V relay module
- 1x 5V mini submersible water pump
- Jumper wires + a breadboard
- A USB cable to connect the ESP32 to your computer
- A 5V power source for the pump (a USB power bank/adapter works well)

**Software (all free)**
- A computer with internet access
- [Arduino IDE](https://www.arduino.cc/en/software) (free download)
- A free [GitHub](https://github.com) account
- Your Firebase project (already created — details below)

---

## Part 1 — Check your Firebase project

You already have a Firebase project set up with these details:

| Setting | Value |
|---|---|
| Project ID | `smart-bonsai-iot-c7662` |
| Database URL | `https://smart-bonsai-iot-c7662-default-rtdb.asia-southeast1.firebasedatabase.app/` |
| Device account email | `device@smartbonsai.io` |
| Device account password | `88888888` |

These are already filled into both the app code (`src/services/firebase.ts`)
and the ESP32 code (`SmartBonsai_ESP32.ino`) — you don't need to type them
again. But let's double check everything is switched on correctly:

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
   and open your **smart-bonsai-iot** project.
2. In the left sidebar, click **Build → Realtime Database**.
   - If you see "Get Started", click it, choose **asia-southeast1** as the
     location, and start in **locked mode**.
3. Click the **Rules** tab at the top of the Realtime Database page.
4. Delete everything there and paste in the contents of
   `firebase/database.rules.json` from this ZIP:

   ```json
   {
     "rules": {
       "bonsai": {
         ".read": "auth != null",
         ".write": "auth != null"
       },
       ".read": false,
       ".write": false
     }
   }
   ```
5. Click **Publish**.
6. In the left sidebar, click **Build → Authentication**.
   - If you see "Get Started", click it.
   - Click the **Sign-in method** tab, click **Email/Password**, toggle it
     **Enabled**, and click **Save**.
   - Click the **Users** tab, then **Add user**.
     - Email: `device@smartbonsai.io`
     - Password: `88888888`
     - Click **Add user**.

   This creates the shared "device account" that both the ESP32 and the
   web app sign in with, so they're both allowed to read/write the database.

That's it for Firebase — the database itself will fill up with real data
automatically once the ESP32 starts running in Part 4.

---

## Part 2 — Pin diagram: how to wire your ESP32

⚠️ **Always unplug/power off everything before wiring or re-wiring.**

### Quick pin map (what goes where)

| GPIO pin | Used for | Direction |
|---|---|---|
| **GPIO 34** | Soil moisture sensor (AOUT) | Analog input |
| **GPIO 35** | LDR light sensor | Analog input |
| **GPIO 27** | DHT22 temperature & humidity sensor | Digital I/O |
| **GPIO 26** | Relay module (controls the water pump) | Digital output |
| **GPIO 33** | Optional battery voltage monitor (disabled by default, only needed if you power the board from a battery) | Analog input |

**Why these pins:** GPIO 34, 35, and 33 are **ADC1** pins — they're the
correct choice for analog sensors on an ESP32 because they keep working
reliably even while Wi-Fi is active. (The alternative, ADC2 pins, can
misbehave when Wi-Fi is on, so they're avoided here for any sensor
reading.) GPIO 27 and 26 are ordinary digital pins used for on/off signals
(the DHT22 data line and the relay trigger), so they don't have that
restriction. Every pin above is unique — nothing is double-wired to the
same GPIO, and this map has been rechecked against the firmware.

### Full pin connection table

| Component | Component Pin | Connect to ESP32 Pin (GPIO) |
|---|---|---|
| Soil moisture sensor | VCC | 3.3V |
| Soil moisture sensor | GND | GND |
| Soil moisture sensor | AOUT (analog out) | **GPIO 34** |
| DHT22 sensor | VCC (+) | 3.3V |
| DHT22 sensor | GND (−) | GND |
| DHT22 sensor | DATA (out/S) | **GPIO 27** |
| LDR light sensor | One leg | 3.3V |
| LDR light sensor | Other leg | **GPIO 35** *and* to one leg of the 10kΩ resistor |
| 10kΩ resistor | Other leg | GND |
| Relay module | VCC | **5V (VIN pin)** — not 3.3V |
| Relay module | GND | GND |
| Relay module | IN (signal) | **GPIO 26** |
| Relay module | COM | Positive (+) wire from 5V power source |
| Relay module | NO ("normally open") | Positive (+) wire going to the pump |
| Water pump | Negative (−) wire | Direct to GND of the 5V power source |

### A simple picture of the layout

```
                         ESP32 DevKit (top view, USB port at bottom)
                        ┌───────────────────────────────┐
        Soil sensor ───▶│ GPIO34                         │
        LDR + 10kΩ   ───▶│ GPIO35                         │
        DHT22 data   ───▶│ GPIO27                         │
        Relay IN     ───▶│ GPIO26                         │
   (optional) Battery───▶│ GPIO33                         │
                        │                                 │
        3.3V  ─────────▶│ 3V3            5V / VIN ◀───────┼── Relay VCC
        GND   ─────────▶│ GND            GND      ◀───────┼── all sensor & relay GNDs
                        └───────────────────────────────┘

  Relay module:  COM ── (+) from 5V pump power source
                 NO  ── (+) to water pump
                 Pump (−) ── GND of the 5V pump power source
```

**Notes for beginners:**
- The **LDR + 10kΩ resistor** together form a "voltage divider" — this is
  normal and required for reading light with an analog pin.
- The pump does **not** plug into the ESP32 directly — it's powered by a
  separate 5V source, and the relay just acts as an electronic switch that
  turns that power on and off.
- Every GND pin (ESP32, sensors, relay, pump power source) must be
  connected together — this is called a "common ground."
- If your pump turns ON immediately when the ESP32 boots (before you want
  it to), open the `.ino` file and change `RELAY_ACTIVE_LOW` from `true` to
  `false`, then re-upload — this fixes it.
- There is no water tank/reservoir level sensor in this build — the system
  only measures soil moisture, temperature, humidity, and light, and waters
  based on soil moisture.

### Where to see/change this pin map later

If you ever rewire a sensor to a different pin, open
`esp32_firmware/SmartBonsai_ESP32/SmartBonsai_ESP32.ino` in the Arduino IDE
and look near the top of the file — the pin numbers are defined once, right
after the Wi-Fi/Firebase credentials:

```cpp
#define SOIL_PIN         34
#define LDR_PIN          35
#define DHT_PIN          27
#define DHT_TYPE         DHT22
#define RELAY_PIN        26
#define BATTERY_PIN      33
```

Change the number, re-upload, and re-wire to match — nothing else in the
code needs to change for a simple pin swap.

---

## Part 3 — Install the Arduino IDE and required libraries

1. Download and install the [Arduino IDE](https://www.arduino.cc/en/software)
   (choose the version for your operating system).
2. Open the Arduino IDE.
3. **Add ESP32 board support:**
   - Go to **File → Preferences** (Windows) or **Arduino → Settings** (Mac).
   - In "Additional Boards Manager URLs", paste:
     `https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json`
   - Click **OK**.
   - Go to **Tools → Board → Boards Manager**, search for `esp32`, and
     install **"esp32 by Espressif Systems"**.
4. **Install libraries:**
   - Go to **Sketch → Include Library → Manage Libraries**.
   - Search for and install each of these (click **Install**, and if asked
     to install dependencies, click **Install All**):
     - `Firebase ESP Client` (by **Mobizt**)
     - `DHT sensor library` (by **Adafruit**)
     - `Adafruit Unified Sensor` (by **Adafruit**)

---

## Part 4 — Upload the code to the ESP32

1. In the Arduino IDE, go to **File → Open**, and open:
   `esp32_firmware/SmartBonsai_ESP32/SmartBonsai_ESP32.ino`
   from this ZIP folder.
2. Connect the ESP32 to your computer with the USB cable.
3. Go to **Tools → Board** and select **"ESP32 Dev Module"**.
4. Go to **Tools → Port** and select the port that appeared when you
   plugged in the board (e.g. `COM5` on Windows, or `/dev/cu.usbserial-...`
   on Mac).
   - If no port appears, install the **CP2102** or **CH340** USB driver for
     your board (search your board's exact name + "driver").
5. Click the **Upload** button (the right-pointing arrow, top-left).
   - If it fails with a "Connecting..." timeout, hold down the **BOOT**
     button on the ESP32 while it uploads, and release once you see
     "Writing at...".
6. Once it says "Done uploading", open **Tools → Serial Monitor**, and set
   the baud rate (bottom-right dropdown) to **115200**.
7. You should see something like:
   ```
   Connecting to Wi-Fi: vivo Y27s
   ....
   Wi-Fi connected. IP address: 192.168.x.x
   Setup complete. Waiting for Firebase to authenticate...
   ---- Sensor readings ----
     Soil   | raw=1842 | processed=62.3% | LIVE
     Light  | raw= 980 | processed=76.1% | LIVE
     DHT22  | temp=24.5C | humidity=61.0% | LIVE
     -> Sent to Firebase OK
   --------------------------
   ```
   If you see a block like that repeating every ~3 seconds with `LIVE`
   next to each sensor, **your ESP32 is working and sending real data to
   Firebase!** 🎉
   - If a sensor isn't wired up yet or is disconnected, its line will say
     `retrying - using last good` (still settling) or
     `FAULTED - using last good` (been failing for a while) instead of
     `LIVE` — that's expected until you wire that sensor in.

> **Important:** The Wi-Fi network name/password in the code
> (`"vivo Y27s"` / `"88888888"`) must be a **2.4GHz** Wi-Fi network — ESP32
> boards cannot connect to 5GHz Wi-Fi. If your phone hotspot offers a
> "5GHz" option, turn it off.

---

## Part 5 — Calibrate your soil sensor (important!)

Every sensor batch reads slightly different raw numbers, so let's tune
the code to your exact sensor using the Serial Monitor from Part 4.

1. With the Serial Monitor open, watch the `Soil | raw=... |` number on
   the line each cycle prints.
   - Leave the soil sensor **dry, in open air** → note the `raw=` number
     shown. This becomes `SOIL_RAW_DRY`.
   - Dip the sensor tip in a **cup of water** → note the `raw=` number
     shown. This becomes `SOIL_RAW_WET`.
2. Open the `.ino` file, find this section near the top, and update the
   two numbers with what you measured:
   ```cpp
   #define SOIL_RAW_DRY   3000
   #define SOIL_RAW_WET   1200
   ```
3. Re-upload the sketch.

---

## Part 6 — Host the web app on GitHub Pages

1. Create a free account at [github.com](https://github.com) if you don't
   already have one.
2. Go to [github.com/new](https://github.com/new) and create a new
   repository:
   - Repository name: `smart-bonsai-app` (exactly this, lowercase — or if
     you use a different name, see the note below)
   - Keep it **Public**
   - Do **not** tick "Add a README" (we already have the files)
   - Click **Create repository**
3. On your computer, open a terminal / command prompt **inside the
   `smart_bonsai_app` folder** from this ZIP, and run these commands one
   at a time:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Smart Bonsai app with ESP32 integration"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/smart-bonsai-app.git
   git push -u origin main
   ```
   Replace `YOUR-USERNAME` with your actual GitHub username. When prompted
   for a password, use a
   [Personal Access Token](https://github.com/settings/tokens) instead of
   your GitHub password (GitHub no longer accepts plain passwords over
   the command line).
4. On GitHub, open your new repository in the browser, go to
   **Settings → Pages**.
5. Under **"Build and deployment" → Source**, choose **"GitHub Actions"**.
6. Go to the **Actions** tab of your repository — you'll see a workflow
   called "Deploy Smart Bonsai App to GitHub Pages" running. Wait for it
   to finish (green checkmark, usually 1-2 minutes).
7. Go back to **Settings → Pages** — you'll now see your live URL, e.g.:
   `https://YOUR-USERNAME.github.io/smart-bonsai-app/`
8. Open that link — your app is now live for anyone to visit!

> Already have it hosted? The current live build of this app is at
> [https://smart-bonsai-app.vercel.app/](https://smart-bonsai-app.vercel.app/)
> — you can use that URL directly instead of deploying your own copy, or
> deploy your own alongside it.

> **If your repository name is NOT `smart-bonsai-app`:** open
> `vite.config.ts` in this project, and change the line
> `base: '/smart-bonsai-app/'` to `base: '/YOUR-REPO-NAME/'` — then commit
> and push again before deploying.

From now on, any time you push new changes to the `main` branch on
GitHub, the site rebuilds and updates automatically within a minute or two.

---

## Part 7 — Turn on Live Mode in the app

1. Open your live app URL from Part 6, or
   [https://smart-bonsai-app.vercel.app/](https://smart-bonsai-app.vercel.app/),
   or run it locally with `npm run dev`.
2. Go to the **Settings** tab.
3. Under **"Data Source"**, make sure the button says **"Live Data"**
   (not "Demo Data"). If it says "Demo Data", tap it once to switch.
4. Go back to the **Dashboard** tab — within a few seconds you should see
   real numbers coming from your ESP32 (soil moisture, temperature,
   humidity, light).

---

## Part 8 — Understand Auto Mode (automatic watering)

The **Water Pump Control System** card on the Dashboard has an **Auto
Mode** toggle. This is off by default on both the app and the ESP32, so
the pump never runs on its own until you turn it on.

- **Auto Mode OFF (default):** you control the pump yourself with the
  ON/OFF button or "Quick Water". The ESP32 will never start the pump on
  its own while this is off.
- **Auto Mode ON:** you set two thresholds in **Settings → Automatic
  Water Triggers** — a "start" moisture % and a "target" moisture %. Once
  soil moisture drops below the start threshold, the ESP32 turns the pump
  on by itself; once it reaches the target threshold, the ESP32 turns it
  off by itself. This runs on the ESP32 itself, so it keeps working even
  if your phone/browser is closed.
- Turning Auto Mode ON or OFF in the app is sent to the ESP32
  automatically (usually within a couple of seconds) — you don't need to
  re-upload any code to change this.
- While Auto Mode is ON, the manual ON/OFF button and "Quick Water" are
  disabled in the app, since the ESP32 is the one deciding when to water.
  Turn Auto Mode off first if you want to water manually.

---

## Part 9 — Test everything end to end ✅

Go through this checklist:

- [ ] ESP32 Serial Monitor shows a `---- Sensor readings ----` block
      repeating every few seconds, with no Wi-Fi disconnect messages.
- [ ] In Firebase Console → Realtime Database → Data tab, you can see a
      `bonsai/telemetry` node with live-updating numbers.
- [ ] In the web app (Live Data mode), the Dashboard numbers match what's
      in Firebase and change over time as conditions change.
- [ ] Blow gently on the DHT22 or touch it — humidity/temperature should
      shift within a few seconds.
- [ ] Cover the LDR with your hand — the light reading should drop.
- [ ] Touch the soil sensor with a wet finger — soil moisture should rise.
- [ ] With **Auto Mode OFF** (the default), use the pump ON/OFF button —
      you should hear/see the relay click and the pump run.
- [ ] Turn **Auto Mode ON** and set a start threshold above your current
      soil moisture — the pump should start automatically, and stop once
      soil is wet enough again.
- [ ] Turn **Auto Mode back OFF** while the pump is auto-running — the
      pump should stop immediately.
- [ ] Tap **Reboot Device** in the app's Device tab — the ESP32 should
      restart (Serial Monitor will show it reconnecting to Wi-Fi).

If every box is checked, your Smart Bonsai system is fully working! 🌳💧

---

## 🔧 Troubleshooting

| Problem | Likely fix |
|---|---|
| ESP32 won't connect to Wi-Fi | Make sure the Wi-Fi is 2.4GHz, and the SSID/password in the `.ino` file are typed exactly right (case-sensitive). |
| Serial Monitor shows garbage text | Set the baud rate dropdown (bottom-right) to **115200**. |
| Upload fails / "Connecting..." timeout | Hold the **BOOT** button on the ESP32 while uploading. Also try a different USB cable/port. |
| `Firebase send FAILED` in Serial Monitor | Double-check Email/Password auth is enabled and the `device@smartbonsai.io` user exists in Firebase Authentication (Part 1, step 6). Also re-check the database rules were published. |
| App shows "ESP32 is offline" forever | Confirm the app is in **Live Data** mode (Part 7) and the ESP32 Serial Monitor is actively printing sensor-reading blocks. |
| Soil readings always 0% or 100% | Recalibrate using Part 5 — your raw sensor numbers are outside the `SOIL_RAW_DRY`/`SOIL_RAW_WET` range currently set in the code. |
| A sensor line always says `FAULTED - using last good` | Double-check that sensor's wiring against the pin table in Part 2 — this means it's been unreadable for several cycles in a row. |
| Pump runs backwards (ON when it should be OFF) | Flip `RELAY_ACTIVE_LOW` between `true`/`false` in the `.ino` file and re-upload. |
| Auto Mode toggle in the app doesn't seem to affect the pump | Give it a couple of seconds — the ESP32 polls for control changes every 2 seconds. Also confirm the ESP32 is online (Part 9 checklist). |
| GitHub Pages shows a blank white page | Check that `base` in `vite.config.ts` exactly matches your repo name, then push again. |
| `git push` asks for a password and rejects it | Use a GitHub **Personal Access Token** instead of your account password ([create one here](https://github.com/settings/tokens), tick the "repo" scope). |

---

## 🗂️ Where things live (reference)

| Data | Firebase path |
|---|---|
| Sensor readings from the ESP32 | `bonsai/telemetry` |
| Commands from the app to the ESP32 (auto mode, thresholds, manual pump, reboot) | `bonsai/control` |

🔗 **Live web app:** [https://smart-bonsai-app.vercel.app/](https://smart-bonsai-app.vercel.app/)

That's everything — enjoy your fully connected Smart Bonsai! 🌱

---

## Note on the `flutter_smart_bonsai/` folder

This ZIP also contains a `flutter_smart_bonsai/` folder (a separate mobile
app). This guide and the Firebase wiring above only cover the **web app**
(the `src/` folder) — the Flutter app still uses its own simulated demo
data and is not wired to Firebase.
