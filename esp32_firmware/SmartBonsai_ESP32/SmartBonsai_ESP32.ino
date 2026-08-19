#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"
#include <DHT.h>

#define WIFI_SSID       "vivo Y27s"
#define WIFI_PASSWORD   "88888888"
#define API_KEY         "AIzaSyALO4eqcNEetDeAdFKcZvm1bUg0ajNyTg0"
#define DATABASE_URL    "https://smart-bonsai-iot-c7662-default-rtdb.asia-southeast1.firebasedatabase.app/"
#define USER_EMAIL      "device@smartbonsai.io"
#define USER_PASSWORD   "88888888"

#define TELEMETRY_PATH  "/bonsai/telemetry"
#define CONTROL_PATH    "/bonsai/control"

#define SOIL_PIN         34
#define LDR_PIN          35
#define DHT_PIN          27
#define DHT_TYPE         DHT22
#define RELAY_PIN        26

#define RELAY_ACTIVE_LOW true

#define ENABLE_BATTERY_MONITOR 0
#define BATTERY_PIN 33

#define SOIL_RAW_DRY   3000
#define SOIL_RAW_WET   1200

#define ADC_RAIL_MARGIN        5
#define ADC_OVERSAMPLE_COUNT   8

#define DHT_TEMP_MIN     -40.0
#define DHT_TEMP_MAX      80.0
#define DHT_HUMIDITY_MIN   0.0
#define DHT_HUMIDITY_MAX 100.0

#define MAX_CONSECUTIVE_FAILS 5

DHT dht(DHT_PIN, DHT_TYPE);

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;
bool firebaseReady = false;

unsigned long lastSendTime = 0;
const unsigned long SEND_INTERVAL_MS = 3000;
const unsigned long CONTROL_POLL_INTERVAL_MS = 2000;
unsigned long lastControlPoll = 0;

bool pumpOn = false;
bool autoMode = false;
float autoWaterMinMoisture = 30.0;
float autoWaterTargetMoisture = 70.0;

float lastGoodSoilMoisture = NAN;
int   soilFailCount = 0;
bool  soilFaulted = false;

float lastGoodLight = NAN;
int   lightFailCount = 0;
bool  lightFaulted = false;

float lastGoodTemperature = NAN;
float lastGoodHumidity = NAN;
int   dhtFailCount = 0;
bool  dhtFaulted = false;

void setup() {
  Serial.begin(115200);
  delay(300);
  Serial.println("\n=== Smart Bonsai ESP32 booting ===");

  pinMode(RELAY_PIN, OUTPUT);
  setPump(false);

  dht.begin();

  analogSetAttenuation(ADC_11db);

  connectWiFi();

  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;
  config.token_status_callback = tokenStatusCallback;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
  fbdo.setBSSLBufferSize(4096, 1024);
  firebaseReady = true;

  Serial.println("Setup complete. Waiting for Firebase to authenticate...");
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
  }

  if (Firebase.ready() && firebaseReady) {
    unsigned long now = millis();

    if (now - lastControlPoll > CONTROL_POLL_INTERVAL_MS) {
      lastControlPoll = now;
      pollControlNode();
    }

    if (now - lastSendTime > SEND_INTERVAL_MS) {
      lastSendTime = now;
      readSensorsAndPublish();
    }
  }
}

void connectWiFi() {
  if (WiFi.status() == WL_CONNECTED) return;

  Serial.print("Connecting to Wi-Fi: ");
  Serial.println(WIFI_SSID);
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  unsigned long start = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - start < 20000) {
    delay(300);
    Serial.print(".");
  }
  Serial.println();

  if (WiFi.status() == WL_CONNECTED) {
    Serial.print("Wi-Fi connected. IP address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("Wi-Fi connection failed - will keep retrying in the main loop.");
  }
}

void setPump(bool on) {
  pumpOn = on;
  bool signalLevel = RELAY_ACTIVE_LOW ? !on : on;
  digitalWrite(RELAY_PIN, signalLevel ? HIGH : LOW);
}

void pollControlNode() {
  if (Firebase.RTDB.getBool(&fbdo, CONTROL_PATH "/autoMode")) {
    bool newAutoMode = fbdo.boolData();
    if (newAutoMode != autoMode) {
      autoMode = newAutoMode;
      if (!autoMode && pumpOn) {
        setPump(false);
        Serial.println("Auto Mode turned OFF from app -> pump forced OFF");
      }
    }
  }

  if (Firebase.RTDB.getFloat(&fbdo, CONTROL_PATH "/autoWaterMinMoisture")) {
    autoWaterMinMoisture = fbdo.floatData();
  }

  if (Firebase.RTDB.getFloat(&fbdo, CONTROL_PATH "/autoWaterTargetMoisture")) {
    autoWaterTargetMoisture = fbdo.floatData();
  }

  if (!autoMode) {
    if (Firebase.RTDB.getBool(&fbdo, CONTROL_PATH "/pump")) {
      bool requested = fbdo.boolData();
      if (requested != pumpOn) setPump(requested);
    }
  }

  if (Firebase.RTDB.getBool(&fbdo, CONTROL_PATH "/reboot")) {
    if (fbdo.boolData()) {
      Serial.println("Reboot command received - restarting...");
      Firebase.RTDB.setBool(&fbdo, CONTROL_PATH "/reboot", false);
      setPump(false);
      delay(300);
      ESP.restart();
    }
  }
}

int oversampledAnalogRead(int pin) {
  long sum = 0;
  for (int i = 0; i < ADC_OVERSAMPLE_COUNT; i++) {
    sum += analogRead(pin);
    delayMicroseconds(200);
  }
  return sum / ADC_OVERSAMPLE_COUNT;
}

bool readSoilMoisture(int &rawOut, float &percentOut) {
  int raw = oversampledAnalogRead(SOIL_PIN);
  rawOut = raw;
  if (raw <= ADC_RAIL_MARGIN || raw >= (4095 - ADC_RAIL_MARGIN)) {
    return false;
  }
  float percent = mapFloat(raw, SOIL_RAW_DRY, SOIL_RAW_WET, 0, 100);
  percentOut = constrain(percent, 0, 100);
  return true;
}

bool readLight(int &rawOut, float &percentOut) {
  int raw = oversampledAnalogRead(LDR_PIN);
  rawOut = raw;
  if (raw <= ADC_RAIL_MARGIN || raw >= (4095 - ADC_RAIL_MARGIN)) {
    return false;
  }
  float percent = mapFloat(raw, 0, 4095, 0, 100);
  percentOut = constrain(percent, 0, 100);
  return true;
}

bool readDHT22(float &tempOut, float &humOut) {
  float t = dht.readTemperature();
  float h = dht.readHumidity();

  bool notNumber = isnan(t) || isnan(h);
  bool outOfRange = !notNumber && (
    t < DHT_TEMP_MIN || t > DHT_TEMP_MAX ||
    h < DHT_HUMIDITY_MIN || h > DHT_HUMIDITY_MAX
  );

  if (!notNumber && !outOfRange) {
    tempOut = t;
    humOut = h;
    return true;
  }
  return false;
}

void readSensorsAndPublish() {
  int soilRaw = -1;
  float soilMoisture;
  bool soilOk = readSoilMoisture(soilRaw, soilMoisture);
  if (soilOk) {
    lastGoodSoilMoisture = soilMoisture;
    soilFailCount = 0;
    soilFaulted = false;
  } else {
    soilFailCount++;
    if (isnan(lastGoodSoilMoisture)) {
      soilMoisture = 0;
      soilFaulted = true;
    } else {
      soilMoisture = lastGoodSoilMoisture;
      if (soilFailCount >= MAX_CONSECUTIVE_FAILS) soilFaulted = true;
    }
  }

  int ldrRaw = -1;
  float light;
  bool lightOk = readLight(ldrRaw, light);
  if (lightOk) {
    lastGoodLight = light;
    lightFailCount = 0;
    lightFaulted = false;
  } else {
    lightFailCount++;
    if (isnan(lastGoodLight)) {
      light = 0;
      lightFaulted = true;
    } else {
      light = lastGoodLight;
      if (lightFailCount >= MAX_CONSECUTIVE_FAILS) lightFaulted = true;
    }
  }

  float temperature, humidity;
  bool dhtOk = readDHT22(temperature, humidity);
  if (dhtOk) {
    lastGoodTemperature = temperature;
    lastGoodHumidity = humidity;
    dhtFailCount = 0;
    dhtFaulted = false;
  } else {
    dhtFailCount++;
    if (isnan(lastGoodTemperature) || isnan(lastGoodHumidity)) {
      temperature = 0;
      humidity = 0;
      dhtFaulted = true;
    } else {
      temperature = lastGoodTemperature;
      humidity = lastGoodHumidity;
      if (dhtFailCount >= MAX_CONSECUTIVE_FAILS) dhtFaulted = true;
    }
  }

  float batteryLevel = 100;
#if ENABLE_BATTERY_MONITOR
  int battRaw = analogRead(BATTERY_PIN);
  float voltage = (battRaw / 4095.0) * 3.3 * 2.0;
  batteryLevel = mapFloat(voltage, 3.3, 4.2, 0, 100);
  batteryLevel = constrain(batteryLevel, 0, 100);
#endif

  if (autoMode && !soilFaulted) {
    if (!pumpOn && soilMoisture < autoWaterMinMoisture) {
      setPump(true);
      Serial.println("AUTO: soil dry -> pump ON");
    } else if (pumpOn && soilMoisture >= autoWaterTargetMoisture) {
      setPump(false);
      Serial.println("AUTO: target moisture reached -> pump OFF");
    }
  } else if (autoMode && soilFaulted && pumpOn) {
    setPump(false);
    Serial.println("AUTO SAFETY: soil sensor faulted -> pump forced OFF");
  }

  FirebaseJson json;
  json.set("temperature", temperature);
  json.set("humidity", humidity);
  json.set("soilMoisture", soilMoisture);
  json.set("light", light);
  json.set("pump", pumpOn);
  json.set("rssi", WiFi.RSSI());
  json.set("batteryLevel", batteryLevel);
  json.set("soilFault", soilFaulted);
  json.set("lightFault", lightFaulted);
  json.set("dhtFault", dhtFaulted);

  Serial.println("---- Sensor readings ----");
  Serial.printf("  Soil   | raw=%4d | processed=%.1f%% | %s\n", soilRaw, soilMoisture,
    soilOk ? "LIVE" : (soilFaulted ? "FAULTED - using last good" : "retrying - using last good"));
  Serial.printf("  Light  | raw=%4d | processed=%.1f%% | %s\n", ldrRaw, light,
    lightOk ? "LIVE" : (lightFaulted ? "FAULTED - using last good" : "retrying - using last good"));
  Serial.printf("  DHT22  | temp=%.1fC | humidity=%.1f%% | %s\n",
    temperature, humidity,
    dhtOk ? "LIVE" : (dhtFaulted ? "FAULTED - using last good" : "retrying - using last good"));

  if (Firebase.RTDB.setJSON(&fbdo, TELEMETRY_PATH, &json)) {
    Serial.println("  -> Sent to Firebase OK");
  } else {
    Serial.print("  -> Firebase send FAILED: ");
    Serial.println(fbdo.errorReason());
  }
  Serial.println("--------------------------");
}

float mapFloat(float x, float inMin, float inMax, float outMin, float outMax) {
  if (inMax == inMin) return outMin;
  return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}
