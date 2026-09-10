// Matches the fields the ESP32 actually writes to bonsai/telemetry
// (see esp32_firmware/SmartBonsai_ESP32/SmartBonsai_ESP32.ino, the
// json.set(...) calls) — same shape the website reads.
class BonsaiTelemetry {
  final double temperature;
  final double humidity;
  final double soilMoisture;
  final double light;
  final bool pump;
  final bool autoMode;
  final int rssi;
  final int batteryLevel;
  final bool soilFault;
  final bool lightFault;
  final bool dhtFault;
  final bool deviceConnected;
  final DateTime lastUpdated;

  BonsaiTelemetry({
    required this.temperature,
    required this.humidity,
    required this.soilMoisture,
    required this.light,
    required this.pump,
    required this.autoMode,
    required this.rssi,
    required this.batteryLevel,
    required this.soilFault,
    required this.lightFault,
    required this.dhtFault,
    required this.deviceConnected,
    required this.lastUpdated,
  });

  factory BonsaiTelemetry.initial() => BonsaiTelemetry(
        temperature: 0,
        humidity: 0,
        soilMoisture: 0,
        light: 0,
        pump: false,
        autoMode: false,
        rssi: 0,
        batteryLevel: 0,
        soilFault: false,
        lightFault: false,
        dhtFault: false,
        deviceConnected: false,
        lastUpdated: DateTime.fromMillisecondsSinceEpoch(0),
      );

  factory BonsaiTelemetry.fromMap(
    Map<String, dynamic> map, {
    required BonsaiTelemetry previous,
  }) {
    double asDouble(dynamic v, double fallback) {
      if (v == null) return fallback;
      if (v is num) return v.toDouble();
      return double.tryParse(v.toString()) ?? fallback;
    }

    int asInt(dynamic v, int fallback) {
      if (v == null) return fallback;
      if (v is num) return v.toInt();
      return int.tryParse(v.toString()) ?? fallback;
    }

    return BonsaiTelemetry(
      temperature: asDouble(map['temperature'], previous.temperature),
      humidity: asDouble(map['humidity'], previous.humidity),
      soilMoisture: asDouble(map['soilMoisture'], previous.soilMoisture),
      light: asDouble(map['light'], previous.light),
      pump: map['pump'] is bool ? map['pump'] as bool : previous.pump,
      autoMode:
          map['autoMode'] is bool ? map['autoMode'] as bool : previous.autoMode,
      rssi: asInt(map['rssi'], previous.rssi),
      batteryLevel: asInt(map['batteryLevel'], previous.batteryLevel),
      soilFault: map['soilFault'] == true,
      lightFault: map['lightFault'] == true,
      dhtFault: map['dhtFault'] == true,
      deviceConnected: true,
      lastUpdated: DateTime.now(),
    );
  }

  BonsaiTelemetry copyWith({
    bool? pump,
    bool? autoMode,
    bool? deviceConnected,
  }) {
    return BonsaiTelemetry(
      temperature: temperature,
      humidity: humidity,
      soilMoisture: soilMoisture,
      light: light,
      pump: pump ?? this.pump,
      autoMode: autoMode ?? this.autoMode,
      rssi: rssi,
      batteryLevel: batteryLevel,
      soilFault: soilFault,
      lightFault: lightFault,
      dhtFault: dhtFault,
      deviceConnected: deviceConnected ?? this.deviceConnected,
      lastUpdated: lastUpdated,
    );
  }
}
