# 🌱 Smart Bonsai — Complete Setup Guide

This guide takes you from "the app shows fake numbers" to "the app shows
real numbers from my own ESP32 sensors, hosted online, working end to end."

Follow the parts **in order**. Each step tells you exactly what to click,
type, or plug in. You don't need to understand everything — just follow
along, and it will work.

**Live app:** [https://smart-bonsai-app.vercel.app/](https://smart-bonsai-app.vercel.app/)

---

## 📦 What's in this ZIP file

```
smart_bonsai_app/
│
├── src/                          ← the website app (React)
│   └── services/firebase.ts      ← connects the app to your Firebase database
│
├── esp32_firmware/
│   ├── SmartBonsai_ESP32/
│   │   └── SmartBonsai_ESP32.ino ← the code that goes ON the ESP32 board
│   └── RelayTest/
│       └── RelayTest.ino         ← standalone sketch to test just the pump relay
│
├── firebase/
│   └── database.rules.json       ← security rules for your database
│
├── .github/workflows/deploy.yml  ← optional GitHub Pages deploy workflow
├── vite.config.ts
└── SETUP_GUIDE.md                ← this file
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

## Part 2 — Pin diagram: how to wire the ESP32

⚠️ **Always unplug/power off everything before wiring or re-wiring.**

### ESP32 DevKit pin diagram

```
                         ┌─────────────────────┐
                    3.3V │ 3V3               D23│
                     EN  │ EN                D22│
              (unused)   │ VP (36)         TX0/1│ (unused)
              (unused)   │ VN (39)         RX0/3│ (unused)
              (unused)   │ D34  ◄──────────┐D21│
      Soil AOUT ────────►│ D35  ◄──────┐   │D19│
              (unused)   │ D32              │D18│
              (unused)   │ D33              │D5 │
              (unused)   │ D25              │TX2/17│
              (unused)   │ D26  ◄───────────┼───┼──► Relay IN
              (unused)   │ D27  ◄───────┐   │D16│
              (unused)   │ D14          │   │D4 │
              (unused)   │ D12          │   │D2 │
              (unused)   │ D13          │   │D15│
                     GND │ GND          │   │GND│
                     VIN │ VIN          │   │3V3│
                         └──────────────┼───┼───┘
                                        │   │
                                DHT22 DATA  LDR (with 10kΩ
                                            pull-down to GND)
```

*(This is a simplified schematic, not to scale — always check your specific
board's silkscreen labels, since some 38-pin boards number pins slightly
differently.)*

### Pin connection table

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

### Where pins are set in the code

Every GPIO number above is defined once, near the top of
`esp32_firmware/SmartBonsai_ESP32/SmartBonsai_ESP32.ino`:

```cpp
#define SOIL_PIN         34
#define LDR_PIN          35
#define DHT_PIN          27
#define RELAY_PIN        26
```

If you wire a sensor to a different GPIO than the table above, change the
matching `#define` here and re-upload — nothing else in the code needs to
change.

**Notes for beginners:**
- The **LDR + 10kΩ resistor** together form a "voltage divider" — this is
  normal and required for reading light with an analog pin.
- The pump does **not** plug into the ESP32 directly — it's powered by a
  separate 5V source, and the relay just acts as an electronic switch that
  turns that power on and off.
- Every GND pin (ESP32, sensors, relay, pump power source) must be
  connected together — this is called a "common ground."
- GPIO 34 and 35 are **input-only** pins — perfect for the analog sensors,
  but never wire an actuator (like a relay) to them.
- If your pump turns ON immediately when the ESP32 boots (before you want
  it to), open the `.ino` file and change `RELAY_ACTIVE_LOW` from `true` to
  `false`, then re-upload — this fixes it.

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
7. You should see a block like this repeating every ~3 seconds:
   ```
   ---- Sensor readings ----
     Soil   | raw=2150 | processed=42.3% | LIVE
     Light  | raw=1800 | processed=70.1% | LIVE
     DHT22  | temp=24.5C | humidity=61.0% | LIVE
     -> Sent to Firebase OK
   --------------------------
   ```
   If you see that every ~3 seconds, **your ESP32 is working and sending
   real data to Firebase!** 🎉

> **Important:** The Wi-Fi network name/password in the code
> (`"vivo Y27s"` / `"88888888"`) must be a **2.4GHz** Wi-Fi network — ESP32
> boards cannot connect to 5GHz Wi-Fi. If your phone hotspot offers a
> "5GHz" option, turn it off.

---

## Part 5 — Calibrate your sensors (important!)

Every sensor batch reads slightly different raw numbers, so let's tune
the code to your exact sensors using the Serial Monitor from Part 4.

1. With the Serial Monitor still open, watch the `raw=` numbers printed
   for the soil sensor every cycle.
   - Leave the soil sensor **dry, in open air** → note the number shown.
     This becomes `SOIL_RAW_DRY`.
   - Dip the sensor tip in a **cup of water** → note the number shown.
     This becomes `SOIL_RAW_WET`.
2. Open the `.ino` file, find this section near the top, and update the
   two numbers with what you measured:
   ```cpp
   #define SOIL_RAW_DRY   3000
   #define SOIL_RAW_WET   1200
   ```
3. Re-upload the sketch.

---

## Part 6 — Deploy the web app

The app is already live at
[https://smart-bonsai-app.vercel.app/](https://smart-bonsai-app.vercel.app/),
deployed with [Vercel](https://vercel.com). If you want to deploy your own
copy from this ZIP:

1. Push this project to a new GitHub repository (create one at
   [github.com/new](https://github.com/new), then from inside this
   project's folder run):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com), sign in with GitHub, and click
   **Add New → Project**.
3. Select your repository and click **Import**. Vercel auto-detects the
   Vite + React setup — leave the default build settings and click
   **Deploy**.
4. After a minute, Vercel gives you a live URL like
   `https://your-project-name.vercel.app/` — open it and your app is live.

From now on, any time you push new changes to the `main` branch on
GitHub, Vercel rebuilds and updates the live site automatically.

*(A GitHub Pages workflow is also included at
`.github/workflows/deploy.yml` if you'd rather host there instead — but
Vercel needs no extra configuration for this project.)*

---

## Part 7 — Turn on Live Mode in the app

1. Open the live app (or run it locally with `npm run dev`).
2. Go to the **Settings** tab.
3. Under **"Data Source"**, make sure the button says **"Live Data"**
   (not "Demo Data"). If it says "Demo Data", tap it once to switch.
4. Go back to the **Dashboard** tab — within a few seconds you should see
   real numbers coming from your ESP32 (soil moisture, temperature,
   humidity, light).

---

## Part 8 — Test everything end to end ✅

Go through this checklist:

- [ ] ESP32 Serial Monitor shows the sensor-readings block repeating every
      few seconds, with no Wi-Fi disconnect messages.
- [ ] In Firebase Console → Realtime Database → Data tab, you can see a
      `bonsai/telemetry` node with live-updating numbers.
- [ ] In the web app (Live Data mode), the Dashboard numbers match what's
      in Firebase and change over time as conditions change.
- [ ] Blow gently on the DHT22 or touch it — humidity/temperature should
      shift within a few seconds.
- [ ] Cover the LDR with your hand — the light reading should drop.
- [ ] Touch the soil sensor with a wet finger — soil moisture should rise.
- [ ] In the app, go to **Device** tab and make sure **Auto Mode is OFF**
      (it's off by default), then use the pump ON/OFF button — you should
      hear/see the relay click and the pump run.
- [ ] Turn Auto Mode **ON** — dry soil (below your set threshold) should
      make the pump start automatically, and stop once soil is wet enough
      again.
- [ ] Tap **Reboot Device** in the app's Device tab — the ESP32 should
      restart (Serial Monitor will show it reconnecting to Wi-Fi).

If every box is checked, your Smart Bonsai system is fully working! 🌳💧

---

## 🔌 Checking the pump relay signal (if the pump doesn't respond)

If the app shows the pump toggling but the physical pump never turns on,
work through these checks in order:

1. **Watch the Serial Monitor while you press the pump button in the app.**
   With Auto Mode off, toggling the pump in the app now prints
   `Manual pump command received from app: ON` (or `OFF`) to Serial. If you
   don't see this line at all, the app's command isn't reaching the ESP32 —
   double check Firebase Authentication and the database rules from Part 1,
   and confirm the ESP32 is connected to Wi-Fi.
2. **Listen and look at the relay board itself.** Most relay modules click
   audibly and light an onboard LED when energized. If you see/hear that
   but the pump still doesn't run, the problem is downstream of the relay
   (pump wiring or pump power supply), not the ESP32 signal.
3. **If the relay never clicks at all, isolate it from everything else.**
   Upload `esp32_firmware/RelayTest/RelayTest.ino` — a tiny standalone
   sketch that does nothing but toggle GPIO 26 every 3 seconds, with no
   Wi-Fi, Firebase, or sensors involved. If the relay still doesn't click
   with this sketch running, the issue is 100% in the GPIO 26 ↔ relay IN
   wiring or the relay module itself, not your app or Firebase setup.
4. **Check the logic level.** ESP32 GPIO pins output **3.3V**, but many
   cheap "5V relay modules" expect a stronger signal to reliably switch.
   Some modules work fine at 3.3V (opto-isolated, low-trigger-current
   boards); others are unreliable or don't trigger at all. If Step 3 shows
   the ESP32 is toggling the pin but the relay still won't click, try a
   relay module explicitly marked "3.3V/low-level trigger compatible", or
   drive it through a simple NPN transistor stage instead of straight from
   the GPIO pin.
5. **Check `RELAY_ACTIVE_LOW`.** If the relay clicks but the pump runs
   backwards (ON when the app says OFF, or vice versa), open the `.ino`
   file and flip `RELAY_ACTIVE_LOW` between `true` and `false`, then
   re-upload.
6. **Check common ground.** If the relay module has its own power supply
   separate from the ESP32 (common for the pump-side 5V), its GND must
   still be wired back to the ESP32's GND — without a shared ground, the
   GPIO signal has no reliable reference voltage and triggering becomes
   erratic or stops working entirely.
7. **Check the relay's power pin.** Confirm relay VCC is wired to the
   ESP32's **5V/VIN** pin, not 3.3V — many relay coils won't reliably pull
   in on 3.3V even if the logic side technically responds.

---

## 🔧 Troubleshooting

| Problem | Likely fix |
|---|---|
| ESP32 won't connect to Wi-Fi | Make sure the Wi-Fi is 2.4GHz, and the SSID/password in the `.ino` file are typed exactly right (case-sensitive). |
| Serial Monitor shows garbage text | Set the baud rate dropdown (bottom-right) to **115200**. |
| Upload fails / "Connecting..." timeout | Hold the **BOOT** button on the ESP32 while uploading. Also try a different USB cable/port. |
| `Firebase send FAILED` in Serial Monitor | Double-check Email/Password auth is enabled and the `device@smartbonsai.io` user exists in Firebase Authentication (Part 1, step 6). Also re-check the database rules were published. |
| App shows the device as offline forever, no data | Confirm the app is in **Live Data** mode (Part 7) and the ESP32 Serial Monitor is actively printing the sensor-readings block. Each sensor now publishes independently and flags itself as faulted rather than blocking all data, so partial data should still appear even if one sensor is miswired. |
| Soil/light readings always 0% or 100% | Recalibrate using Part 5 — your raw sensor numbers are outside the DRY/WET range currently set in the code. |
| Pump relay doesn't respond | Work through the **Checking the pump relay signal** section above. |
| Pump runs backwards (ON when it should be OFF) | Flip `RELAY_ACTIVE_LOW` between `true`/`false` in the `.ino` file and re-upload. |
| Deployed app shows a blank white page | Confirm `base: '/'` in `vite.config.ts` if deploying to Vercel (domain root). If deploying to GitHub Pages instead, change it to `'/YOUR-REPO-NAME/'`. |
| `git push` asks for a password and rejects it | Use a GitHub **Personal Access Token** instead of your account password ([create one here](https://github.com/settings/tokens), tick the "repo" scope). |

---

## 🗂️ Where things live (reference)

| Data | Firebase path |
|---|---|
| Sensor readings from the ESP32 | `bonsai/telemetry` |
| Commands from the app to the ESP32 | `bonsai/control` |
| User/plant profile | `bonsai/profile` |

That's everything — enjoy your fully connected Smart Bonsai! 🌱

---

## Note on the `flutter_smart_bonsai/` folder

This ZIP also contains a `flutter_smart_bonsai/` folder (a separate mobile
app). This guide and the Firebase wiring above only cover the **web app**
(the `src/` folder) — the Flutter app still uses its own dummy data and
was not changed. Let me know if you'd like that connected to Firebase too.
