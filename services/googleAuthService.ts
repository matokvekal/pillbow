// Google Authentication Service — Firebase Auth implementation

import { signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { UserProfile } from '../types';

export interface GoogleUserInfo {
    id: string;
    name: string;
    email: string;
    photoURL: string;
}

/**
 * Check if user is authenticated with Google
 */
export const isGoogleAuthenticated = (): boolean => {
    return !!auth.currentUser;
};

/**
 * Get current Google user profile
 */
export const getStoredGoogleUser = (): GoogleUserInfo | null => {
    const user = auth.currentUser;
    if (!user) return null;
    return {
        id: user.uid,
        name: user.displayName || "Google User",
        email: user.email || "",
        photoURL: user.photoURL || "",
    };
};

/**
 * Sign in with Google via Firebase popup
 */
export const signInWithGoogle = async (): Promise<GoogleUserInfo | null> => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        return {
            id: user.uid,
            name: user.displayName || "Google User",
            email: user.email || "",
            photoURL: user.photoURL || "",
        };
    } catch (error: any) {
        // User closed popup or other error
        if (error.code === "auth/popup-closed-by-user") {
            return null;
        }
        console.error("Google sign-in error:", error);
        throw error;
    }
};

/**
 * Sign out from Google via Firebase
 */
export const signOutGoogle = async (): Promise<void> => {
    await signOut(auth);
};

/**
 * Listen for auth state changes
 */
export const onAuthChanged = (callback: (user: GoogleUserInfo | null) => void): (() => void) => {
    return onAuthStateChanged(auth, (firebaseUser: User | null) => {
        if (firebaseUser) {
            callback({
                id: firebaseUser.uid,
                name: firebaseUser.displayName || "Google User",
                email: firebaseUser.email || "",
                photoURL: firebaseUser.photoURL || "",
            });
        } else {
            callback(null);
        }
    });
};

/**
 * Convert GoogleUserInfo to UserProfile
 */
export const googleUserToProfile = (googleUser: GoogleUserInfo): Partial<UserProfile> => {
    return {
        id: `google_${googleUser.id}`,
        name: googleUser.name,
        email: googleUser.email,
        photoURL: googleUser.photoURL,
        avatar: googleUser.photoURL,
        isGoogleUser: true,
        googleId: googleUser.id,
        relationship: 'self',
        color: 'blue',
        createdAt: new Date().toISOString(),
    };
};
