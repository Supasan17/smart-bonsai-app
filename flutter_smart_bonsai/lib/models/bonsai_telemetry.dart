class BonsaiTelemetry {
  final double temperature;
  final double humidity;
  final double soilMoisture;
  final double light;
  final bool pump;
  final bool autoMode;
  final int plantHealth;
  final String lastWatered;
  final String lastUpdated;

  BonsaiTelemetry({
    required this.temperature,
    required this.humidity,
    required this.soilMoisture,
    required this.light,
    required this.pump,
    required this.autoMode,
    required this.plantHealth,
    required this.lastWatered,
    required this.lastUpdated,
  });

  factory BonsaiTelemetry.fromMap(Map<String, dynamic> map) {
    return BonsaiTelemetry(
      temperature: (map['temperature'] ?? 24.0).toDouble(),
      humidity: (map['humidity'] ?? 60.0).toDouble(),
      soilMoisture: (map['soilMoisture'] ?? 45.0).toDouble(),
      light: (map['light'] ?? 70.0).toDouble(),
      pump: map['pump'] ?? false,
      autoMode: map['autoMode'] ?? false,
      plantHealth: map['plantHealth'] ?? 90,
      lastWatered: map['lastWatered'] ?? 'Today, 08:30 AM',
      lastUpdated: map['lastUpdated'] ?? DateTime.now().toIso8601String(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'temperature': temperature,
      'humidity': humidity,
      'soilMoisture': soilMoisture,
      'light': light,
      'pump': pump,
      'autoMode': autoMode,
      'plantHealth': plantHealth,
      'lastWatered': lastWatered,
      'lastUpdated': lastUpdated,
    };
  }

  BonsaiTelemetry copyWith({
    double? temperature,
    double? humidity,
    double? soilMoisture,
    double? light,
    bool? pump,
    bool? autoMode,
    int? plantHealth,
    String? lastWatered,
    String? lastUpdated,
  }) {
    return BonsaiTelemetry(
      temperature: temperature ?? this.temperature,
      humidity: humidity ?? this.humidity,
      soilMoisture: soilMoisture ?? this.soilMoisture,
      light: light ?? this.light,
      pump: pump ?? this.pump,
      autoMode: autoMode ?? this.autoMode,
      plantHealth: plantHealth ?? this.plantHealth,
      lastWatered: lastWatered ?? this.lastWatered,
      lastUpdated: lastUpdated ?? this.lastUpdated,
    );
  }
}
