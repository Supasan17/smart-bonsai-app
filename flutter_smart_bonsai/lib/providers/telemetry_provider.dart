import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/bonsai_telemetry.dart';

class TelemetryNotifier extends StateNotifier<BonsaiTelemetry> {
  Timer? _timer;

  TelemetryNotifier()
      : super(BonsaiTelemetry(
          temperature: 24.2,
          humidity: 62.0,
          soilMoisture: 28.5,
          light: 68.0,
          pump: false,
          autoMode: false,
          plantHealth: 92,
          lastWatered: 'Today, 08:30 AM',
          lastUpdated: DateTime.now().toIso8601String(),
        )) {
    _startSimulatedStream();
  }

  void _startSimulatedStream() {
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      double newMoisture = state.soilMoisture;
      bool newPump = state.pump;

      if (newPump) {
        newMoisture = (newMoisture + 1.8).clamp(0.0, 100.0);

        if (state.autoMode && newMoisture >= 70.0) {
          newPump = false;
        }
      } else {
        newMoisture = (newMoisture - 0.04).clamp(10.0, 100.0);

        if (state.autoMode && newMoisture < 30.0) {
          newPump = true;
        }
      }

      state = state.copyWith(
        soilMoisture: double.parse(newMoisture.toStringAsFixed(1)),
        pump: newPump,
        lastUpdated: DateTime.now().toIso8601String(),
      );
    });
  }

  void togglePump([bool? value]) {
    if (state.autoMode) return;
    final next = value ?? !state.pump;
    state = state.copyWith(
      pump: next,
      lastWatered: next ? 'Just now' : state.lastWatered,
    );
  }

  void toggleAutoMode([bool? value]) {
    state = state.copyWith(autoMode: value ?? !state.autoMode);
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }
}

final telemetryProvider =
    StateNotifierProvider<TelemetryNotifier, BonsaiTelemetry>((ref) {
  return TelemetryNotifier();
});
