import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/bonsai_telemetry.dart';
import '../services/firebase_service.dart';

class TelemetryNotifier extends StateNotifier<BonsaiTelemetry> {
  TelemetryNotifier() : super(BonsaiTelemetry.initial()) {
    _connect();
  }

  StreamSubscription? _telemetrySub;
  Timer? _staleWatchdog;

  Future<void> _connect() async {
    try {
      await FirebaseService.instance.ensureSignedIn();
    } catch (e) {
      // Sign-in failed (bad credentials, no network, Auth not enabled
      // yet, etc.) — keep showing "offline" instead of crashing.
      state = state.copyWith(deviceConnected: false);
    }

    _telemetrySub = FirebaseService.instance.telemetryStream().listen(
      (data) {
        if (data.isEmpty) return;
        state = BonsaiTelemetry.fromMap(data, previous: state);
      },
      onError: (_) => state = state.copyWith(deviceConnected: false),
    );

    // The ESP32 writes to Firebase roughly every ~3s (see SETUP_GUIDE.md).
    // If nothing has arrived in 15s, treat the device as offline — same
    // threshold the website uses (src/context/AppContext.tsx).
    _staleWatchdog = Timer.periodic(const Duration(seconds: 5), (_) {
      final secondsSinceUpdate =
          DateTime.now().difference(state.lastUpdated).inSeconds;
      if (secondsSinceUpdate > 15 && state.deviceConnected) {
        state = state.copyWith(deviceConnected: false);
      }
    });
  }

  /// Sends a manual pump on/off command. Optimistically updates local
  /// state; the ESP32's next telemetry write confirms (or corrects) it,
  /// and any other device watching bonsai/telemetry updates too.
  void togglePump([bool? value]) {
    final next = value ?? !state.pump;
    state = state.copyWith(pump: next);
    FirebaseService.instance.sendControlCommand({'pump': next}).catchError(
      (Object err) {
        // Revert the optimistic update if the write failed.
        state = state.copyWith(pump: !next);
      },
    );
  }

  void toggleAutoMode([bool? value]) {
    final next = value ?? !state.autoMode;
    state = state.copyWith(autoMode: next);
    FirebaseService.instance
        .sendControlCommand({'autoMode': next}).catchError((Object err) {
      state = state.copyWith(autoMode: !next);
    });
  }

  void rebootDevice() {
    FirebaseService.instance.sendControlCommand({'reboot': true});
  }

  @override
  void dispose() {
    _telemetrySub?.cancel();
    _staleWatchdog?.cancel();
    super.dispose();
  }
}

final telemetryProvider =
    StateNotifierProvider<TelemetryNotifier, BonsaiTelemetry>((ref) {
  return TelemetryNotifier();
});
