// Manually-configured Firebase options for the Smart Bonsai project.
//
// This connects to the SAME Firebase project as the web app
// (src/services/firebase.ts) and the ESP32 firmware, so telemetry,
// control commands, and profile data are shared across all three.
//
// apiKey / databaseURL / projectId below are copied from
// src/services/firebase.ts and are already correct.
//
// appId and messagingSenderId are REQUIRED by Flutter's firebase_core
// but were never needed by the web app, so they aren't in this ZIP yet.
// Get them by registering a mobile app in the Firebase Console:
//   1. https://console.firebase.google.com -> your smart-bonsai-iot project
//   2. Project settings (gear icon) -> "Your apps" -> Add app
//      -> Android (or iOS)
//   3. Use any package name / bundle id you like, e.g. com.smartbonsai.app
//      (it does NOT need to match anything else in this project)
//   4. Firebase shows you a config snippet / google-services.json —
//      copy the "appId" (mobileSdkAppId) and "messagingSenderId"
//      (project_number) values into the placeholders below.
// You do NOT need to download/add google-services.json or
// GoogleService-Info.plist to the project — manual FirebaseOptions is
// enough for Realtime Database + Email/Password Auth.
import 'package:firebase_core/firebase_core.dart';

class DefaultFirebaseOptions {
  static const FirebaseOptions current = FirebaseOptions(
    apiKey: 'AIzaSyALO4eqcNEetDeAdFKcZvm1bUg0ajNyTg0',
    appId: 'REPLACE_WITH_APP_ID_FROM_FIREBASE_CONSOLE',
    messagingSenderId: 'REPLACE_WITH_SENDER_ID_FROM_FIREBASE_CONSOLE',
    projectId: 'smart-bonsai-iot-c7662',
    databaseURL:
        'https://smart-bonsai-iot-c7662-default-rtdb.asia-southeast1.firebasedatabase.app/',
  );
}
