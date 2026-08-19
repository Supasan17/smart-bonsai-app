import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  Auth,
} from 'firebase/auth';
import {
  getDatabase,
  ref,
  onValue,
  update,
  Database,
  DataSnapshot,
} from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyALO4eqcNEetDeAdFKcZvm1bUg0ajNyTg0',
  databaseURL:
    'https://smart-bonsai-iot-c7662-default-rtdb.asia-southeast1.firebasedatabase.app/',
  projectId: 'smart-bonsai-iot-c7662',
};

const DEVICE_EMAIL = 'device@smartbonsai.io';
const DEVICE_PASSWORD = '88888888';

export const TELEMETRY_PATH = 'bonsai/telemetry';
export const CONTROL_PATH = 'bonsai/control';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Database | null = null;
let signInPromise: Promise<void> | null = null;

function init(): { auth: Auth; db: Database } {
  if (!app) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getDatabase(app);
  }
  return { auth: auth!, db: db! };
}

export function ensureSignedIn(): Promise<void> {
  const { auth } = init();
  if (!signInPromise) {
    signInPromise = signInWithEmailAndPassword(auth, DEVICE_EMAIL, DEVICE_PASSWORD)
      .then(() => undefined)
      .catch((err) => {
        signInPromise = null;
        throw err;
      });
  }
  return signInPromise;
}

export function subscribeTelemetry(
  onData: (data: Record<string, any>) => void,
  onError?: (err: Error) => void
): () => void {
  const { db } = init();
  const telemetryRef = ref(db, TELEMETRY_PATH);

  const unsubscribe = onValue(
    telemetryRef,
    (snapshot: DataSnapshot) => {
      const val = snapshot.val();
      if (val) onData(val);
    },
    (error) => {
      console.error('Firebase telemetry subscription error:', error);
      onError?.(error as unknown as Error);
    }
  );

  return unsubscribe;
}

export async function sendControlCommand(
  partial: Record<string, any>
): Promise<void> {
  const { db } = init();
  await ensureSignedIn();
  await update(ref(db, CONTROL_PATH), partial);
}
