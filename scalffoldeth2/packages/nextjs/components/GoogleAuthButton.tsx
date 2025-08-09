"use client";

import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { firebaseAuth } from "~~/services/auth/firebase";

export const GoogleAuthButton = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!firebaseAuth.app) return;
    return firebaseAuth.onAuthChange(u => {
      setUser(u);
      try {
        if (u?.email) {
          localStorage.setItem("ecoquest_user_email", u.email);
        }
      } catch {}
    });
  }, []);

  if (!firebaseAuth.app) {
    return null; // Google sign-in not configured; hide button
  }

  return user ? (
    <div className="ml-2 flex items-center gap-2">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-base-200 rounded-full">
        {user.photoURL ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.photoURL} alt="avatar" className="w-5 h-5 rounded-full" />
        ) : (
          <div className="w-5 h-5 rounded-full bg-green-500" />
        )}
        <span className="text-sm max-w-[10rem] truncate" title={user.email || user.displayName || "Signed in"}>
          {user.email || user.displayName || "Signed in"}
        </span>
      </div>
      <button
        onClick={() => firebaseAuth.signOutUser()}
        className="btn btn-sm"
        aria-label="Sign out of Google"
      >
        Sign out
      </button>
    </div>
  ) : (
    <button
      onClick={() => firebaseAuth.signInWithGoogle().catch(() => {/* noop, handled by firebaseAuth */})}
      className="btn btn-sm ml-2"
      aria-label="Continue with Google"
    >
      Continue with Google
    </button>
  );
};

export default GoogleAuthButton;


