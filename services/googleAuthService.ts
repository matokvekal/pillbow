// Google Authentication Service
// Uses localStorage to simulate auth state (for demo purposes)
// In production, this would integrate with Google Identity Services

import { UserProfile } from '../types';

const GOOGLE_USER_KEY = 'pillbow_google_user';

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
    const stored = localStorage.getItem(GOOGLE_USER_KEY);
    return !!stored;
};

/**
 * Get stored Google user profile
 */
export const getStoredGoogleUser = (): GoogleUserInfo | null => {
    const stored = localStorage.getItem(GOOGLE_USER_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            return null;
        }
    }
    return null;
};

/**
 * Sign in with Google
 * Note: This is a placeholder. Real implementation requires:
 * 1. Google Cloud Console setup with OAuth credentials
 * 2. Adding the GSI script to index.html
 * 3. Initializing google.accounts.id.initialize()
 * 
 * For now, we'll show how the UI should work.
 */
export const signInWithGoogle = async (): Promise<GoogleUserInfo | null> => {
    // Check if Google Identity Services is loaded
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
        return new Promise((resolve) => {
            (window as any).google.accounts.id.prompt((notification: any) => {
                if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                    console.log('Google sign-in prompt not shown');
                    resolve(null);
                }
            });
            // The actual user info will come from the callback set in initGoogleAuth
        });
    } else {
        // GSI not loaded - show alert for now
        console.warn('Google Identity Services not loaded. Please add the GSI script to index.html');
        alert('Google Sign-In requires setup. Please configure Google Cloud Console and add the GSI script.');
        return null;
    }
};

/**
 * Sign out from Google
 */
export const signOutGoogle = (): void => {
    localStorage.removeItem(GOOGLE_USER_KEY);

    // Revoke Google session if GSI is available
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
        (window as any).google.accounts.id.disableAutoSelect();
    }
};

/**
 * Save Google user to localStorage
 */
export const saveGoogleUser = (user: GoogleUserInfo): void => {
    localStorage.setItem(GOOGLE_USER_KEY, JSON.stringify(user));
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
        avatar: googleUser.photoURL, // Use photo as avatar
        isGoogleUser: true,
        googleId: googleUser.id,
        relationship: 'self',
        color: 'blue',
        createdAt: new Date().toISOString(),
    };
};

/**
 * Initialize Google Identity Services
 * Call this in App.tsx or index.tsx on load
 */
export const initGoogleAuth = (clientId: string, onSignIn: (user: GoogleUserInfo) => void): void => {
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
        (window as any).google.accounts.id.initialize({
            client_id: clientId,
            callback: (response: any) => {
                // Decode the JWT credential
                const payload = JSON.parse(atob(response.credential.split('.')[1]));
                const user: GoogleUserInfo = {
                    id: payload.sub,
                    name: payload.name,
                    email: payload.email,
                    photoURL: payload.picture,
                };
                saveGoogleUser(user);
                onSignIn(user);
            },
        });
    }
};
