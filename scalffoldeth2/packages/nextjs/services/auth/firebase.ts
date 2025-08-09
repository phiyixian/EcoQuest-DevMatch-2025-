import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, type User } from "firebase/auth";

export type FirebaseAuthExports = {
  app: FirebaseApp | null;
  signInWithGoogle: () => Promise<User>;
  signOutUser: () => Promise<void>;
  onAuthChange: (cb: (user: User | null) => void) => () => void;
};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseAuth: FirebaseAuthExports = (() => {
  if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId || !firebaseConfig.appId) {
    return {
      app: null,
      signInWithGoogle: async () => {
        throw new Error("Firebase env vars not set. Provide NEXT_PUBLIC_FIREBASE_* to enable Google sign-in.");
      },
      signOutUser: async () => {},
      onAuthChange: () => () => {},
    };
  }

  const app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  return {
    app,
    signInWithGoogle: async () => {
      const res = await signInWithPopup(auth, provider);
      return res.user;
    },
    signOutUser: async () => {
      await signOut(auth);
    },
    onAuthChange: cb => onAuthStateChanged(auth, cb),
  };
})();

export const getCurrentUserEmail = (): string | undefined => {
  try {
    // If Firebase not configured, return undefined
    if (!firebaseAuth.app) return undefined;
    const auth = getAuth(firebaseAuth.app);
    return auth?.currentUser?.email ?? undefined;
  } catch {
    return undefined;
  }
};


