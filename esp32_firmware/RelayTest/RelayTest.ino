#define RELAY_PIN 26
#define RELAY_ACTIVE_LOW true

bool pumpOn = false;

void setPump(bool on) {
  pumpOn = on;
  bool signalLevel = RELAY_ACTIVE_LOW ? !on : on;
  digitalWrite(RELAY_PIN, signalLevel ? HIGH : LOW);
  Serial.printf("Pump %s | GPIO26 driven %s\n", on ? "ON" : "OFF", signalLevel ? "HIGH" : "LOW");
}

void setup() {
  Serial.begin(115200);
  delay(300);
  pinMode(RELAY_PIN, OUTPUT);
  setPump(false);
  Serial.println("=== Relay Test ===");
  Serial.println("Toggling the pump relay every 3 seconds.");
  Serial.println("Watch for the relay's click and its onboard LED.");
}

void loop() {
  setPump(true);
  delay(3000);
  setPump(false);
  delay(3000);
}
