import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/user_profile.dart';
import '../services/firebase_service.dart';

class ProfileNotifier extends StateNotifier<UserProfile> {
  ProfileNotifier() : super(UserProfile.initial()) {
    _connect();
  }

  StreamSubscription? _sub;

  Future<void> _connect() async {
    try {
      await FirebaseService.instance.ensureSignedIn();
    } catch (_) {
      return;
    }
    _sub = FirebaseService.instance.profileStream().listen((data) {
      if (data.isEmpty) return;
      state = UserProfile.fromMap(data, state);
    });
  }

  /// Saves a partial edit (e.g. from the Profile screen) and pushes it
  /// to Firebase so the website (and any other device) picks it up live.
  void update({
    String? name,
    String? email,
    String? plantName,
    String? plantSpecies,
    int? plantAgeYears,
    String? phone,
    String? location,
  }) {
    state = state.copyWith(
      name: name,
      email: email,
      plantName: plantName,
      plantSpecies: plantSpecies,
      plantAgeYears: plantAgeYears,
      phone: phone,
      location: location,
    );
    FirebaseService.instance.saveProfile(state.toMap());
  }

  @override
  void dispose() {
    _sub?.cancel();
    super.dispose();
  }
}

final profileProvider = StateNotifierProvider<ProfileNotifier, UserProfile>((ref) {
  return ProfileNotifier();
});
