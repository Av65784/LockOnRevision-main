import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db, googleProvider, isFirebaseConfigured } from "../config/firebase.js";
import { ensureLocalUser, readLocalState, signOutLocalUser, subscribeLocalState } from "../services/localStore.js";

const AuthContext = createContext(null);

const defaultUserDoc = (user) => ({
  displayName: user.displayName || "LockOn Learner",
  email: user.email,
  photoURL: user.photoURL || "",
  energy: 100,
  streak: 0,
  dailyUsage: {
    aiRequests: 0,
    quizzesCompleted: 0,
    uploadsProcessed: 0,
    lastReset: serverTimestamp(),
  },
  goal: "Revise one lesson with active recall",
  focus: "Weakest topic first",
  plan: "Free",
  badges: [],
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
});

async function ensureUserDocument(user) {
  await setDoc(doc(db, "users", user.uid), defaultUserDoc(user), { merge: true });
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      const state = readLocalState();
      const localUserId = state.currentUserId;
      if (localUserId && state.users[localUserId]) {
        const profile = state.users[localUserId].profile;
        setUser({
          uid: localUserId,
          email: profile.email,
          displayName: profile.displayName,
          photoURL: profile.photoURL,
          isLocal: true,
        });
        setProfile(profile);
      }
      setLoading(false);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await ensureUserDocument(firebaseUser);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return undefined;
    if (!isFirebaseConfigured) {
      return subscribeLocalState((state) => {
        const localUser = state.users[user.uid];
        setProfile(localUser?.profile || null);
      });
    }

    return onSnapshot(doc(db, "users", user.uid), (snapshot) => {
      setProfile(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
    });
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      isFirebaseConfigured,
      async login(email, password) {
        if (!isFirebaseConfigured) {
          setUser(ensureLocalUser({ email, name: email.split("@")[0] }));
          return;
        }
        if (!auth) throw new Error("Firebase is not configured.");
        await signInWithEmailAndPassword(auth, email, password);
      },
      async register(name, email, password) {
        if (!isFirebaseConfigured) {
          setUser(ensureLocalUser({ email, name }));
          return;
        }
        if (!auth) throw new Error("Firebase is not configured.");
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName: name });
        await ensureUserDocument({ ...result.user, displayName: name });
      },
      async loginWithGoogle() {
        if (!isFirebaseConfigured) {
          setUser(ensureLocalUser({ email: "local.google@lockon.app", name: "Local Learner" }));
          return;
        }
        if (!auth) throw new Error("Firebase is not configured.");
        const result = await signInWithPopup(auth, googleProvider);
        await ensureUserDocument(result.user);
      },
      logout: () => {
        if (!isFirebaseConfigured) {
          signOutLocalUser();
          setUser(null);
          setProfile(null);
          return undefined;
        }
        return auth ? signOut(auth) : undefined;
      },
    }),
    [isFirebaseConfigured, loading, profile, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
