// Mirrors src/services/firebase.ts so the mobile app talks to the exact
// same Realtime Database paths as the website and the ESP32:
//   bonsai/telemetry  <- ESP32 writes, both apps read
//   bonsai/control    <- both apps write commands, ESP32 reads
//   bonsai/profile    <- both apps read/write, kept in sync
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_database/firebase_database.dart';

const String telemetryPath = 'bonsai/telemetry';
const String controlPath = 'bonsai/control';
const String profilePath = 'bonsai/profile';

// Same shared "device account" the ESP32 and web app use (see
// SETUP_GUIDE.md Part 1). Both apps sign in as this user so the
// database rules (auth != null) allow read/write.
const String _deviceEmail = 'device@smartbonsai.io';
const String _devicePassword = '88888888';

class FirebaseService {
  FirebaseService._();
  static final FirebaseService instance = FirebaseService._();

  FirebaseDatabase get _db => FirebaseDatabase.instance;
  FirebaseAuth get _auth => FirebaseAuth.instance;

  Future<void>? _signInFuture;

  /// Signs in as the shared device account. Safe to call repeatedly;
  /// only signs in once and reuses the in-flight/completed attempt.
  Future<void> ensureSignedIn() {
    if (_auth.currentUser != null) return Future.value();
    _signInFuture ??= _auth
        .signInWithEmailAndPassword(
          email: _deviceEmail,
          password: _devicePassword,
        )
        .then((_) => null)
        .catchError((Object err) {
      _signInFuture = null;
      throw err;
    });
    return _signInFuture!;
  }

  /// Live stream of `bonsai/telemetry` (sensor readings + reported
  /// pump/autoMode state from the ESP32).
  Stream<Map<String, dynamic>> telemetryStream() {
    return _db.ref(telemetryPath).onValue.map((event) {
      final raw = event.snapshot.value;
      if (raw is Map) {
        return raw.map((k, v) => MapEntry(k.toString(), v));
      }
      return <String, dynamic>{};
    });
  }

  /// Live stream of `bonsai/profile`.
  Stream<Map<String, dynamic>> profileStream() {
    return _db.ref(profilePath).onValue.map((event) {
      final raw = event.snapshot.value;
      if (raw is Map) {
        return raw.map((k, v) => MapEntry(k.toString(), v));
      }
      return <String, dynamic>{};
    });
  }

  /// Sends a partial update to `bonsai/control` (e.g. {'pump': true},
  /// {'autoMode': false}, {'reboot': true}). The ESP32 polls this node.
  Future<void> sendControlCommand(Map<String, dynamic> partial) async {
    await ensureSignedIn();
    await _db.ref(controlPath).update(partial);
  }

  /// Saves partial profile fields to `bonsai/profile`, synced live to
  /// the website and any other device viewing it.
  Future<void> saveProfile(Map<String, dynamic> partial) async {
    await ensureSignedIn();
    await _db.ref(profilePath).update(partial);
  }
}
