import { create } from 'zustand';
import { UserProfile, AppData } from '../types';
import { loadAppData, saveAppData } from '../services/dataService';

interface UserStore {
    currentUserId: string;
    users: UserProfile[];

    // Actions
    switchUser: (userId: string) => void;
    addUser: (name: string, relationship: UserProfile['relationship'], avatar: string) => void;
    removeUser: (userId: string) => void;
    init: () => void;

    // Google Auth Actions
    syncGoogleUser: (googleProfile: any) => void;
    clearGoogleUser: () => void;

    // Computed (call as function)
    getCurrentUser: () => UserProfile | undefined;
}

const DEFAULT_USER_ID = 'user_default';

// Default user for fallback
const DEFAULT_USER: UserProfile = {
    id: DEFAULT_USER_ID,
    name: 'Me',
    relationship: 'self',
    avatar: '👤',
    color: 'blue',
    createdAt: new Date().toISOString()
};

// Helper to get initial users list
const getInitialUsers = (): UserProfile[] => {
    const stored = localStorage.getItem('pillbow_users');
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            return [DEFAULT_USER];
        }
    }
    return [DEFAULT_USER];
};

export const useUserStore = create<UserStore>((set, get) => ({
    currentUserId: DEFAULT_USER_ID,
    users: [DEFAULT_USER],

    getCurrentUser: () => {
        const { users, currentUserId } = get();
        return users.find(u => u.id === currentUserId) || users[0];
    },

    init: () => {
        const users = getInitialUsers();
        // Check if we have a stored current user ID
        const storedCurrentId = localStorage.getItem('pillbow_current_user_id');
        const currentUserId = storedCurrentId && users.find(u => u.id === storedCurrentId)
            ? storedCurrentId
            : users[0].id;

        // Ensure data exists for current user
        // If it's the very first time, existing localStorage data (APP_DATA_KEY) belongs to DEFAULT_USER_ID
        if (localStorage.getItem('pillbow_app_data') && !localStorage.getItem(`pillbow_data_${DEFAULT_USER_ID}`)) {
            localStorage.setItem(`pillbow_data_${DEFAULT_USER_ID}`, localStorage.getItem('pillbow_app_data') || '');
        }

        console.log('User store initialized:', { users, currentUserId });
        set({ users, currentUserId });
    },

    switchUser: (userId: string) => {
        const { currentUserId } = get();
        if (userId === currentUserId) return;

        // 1. Save current user's data from generic 'pillbow_app_data' to specific 'pillbow_data_USERID'
        const currentData = localStorage.getItem('pillbow_app_data');
        if (currentData) {
            localStorage.setItem(`pillbow_data_${currentUserId}`, currentData);
        }

        // 2. Load new user's specific data
        const newUserData = localStorage.getItem(`pillbow_data_${userId}`);

        // 3. Put it into the generic 'pillbow_app_data' key so the rest of the app reads it
        // If no data exists for new user, create empty structure
        if (newUserData) {
            localStorage.setItem('pillbow_app_data', newUserData);
        } else {
            const emptyData: AppData = {
                medications: [],
                dayLogs: [],
                settings: { reminderEnabled: true, soundEnabled: true },
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem('pillbow_app_data', JSON.stringify(emptyData));
        }

        // 4. Update state and persist selection
        localStorage.setItem('pillbow_current_user_id', userId);
        set({ currentUserId: userId });

        // 5. Force reload to ensure all components re-read dataService
        // This is the safest way to ensure no stale data exists in other components
        window.location.reload();
    },

    addUser: (name: string, relationship: UserProfile['relationship'], avatar: string) => {
        const newUser: UserProfile = {
            id: `user_${Date.now()}`,
            name,
            relationship,
            avatar,
            color: 'blue', // Default color
            createdAt: new Date().toISOString()
        };

        set(state => {
            const updatedUsers = [...state.users, newUser];
            localStorage.setItem('pillbow_users', JSON.stringify(updatedUsers));
            return { users: updatedUsers };
        });

        // Initialize empty data for new user
        const emptyData: AppData = {
            medications: [],
            dayLogs: [],
            settings: { reminderEnabled: true, soundEnabled: true },
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem(`pillbow_data_${newUser.id}`, JSON.stringify(emptyData));
    },

    removeUser: (userId: string) => {
        set(state => {
            const updatedUsers = state.users.filter(u => u.id !== userId);
            localStorage.setItem('pillbow_users', JSON.stringify(updatedUsers));

            // If we deleted the current user, switch to default
            if (state.currentUserId === userId) {
                localStorage.setItem('pillbow_current_user_id', DEFAULT_USER_ID);
                // We need to reload to switch back to default user's data
                setTimeout(() => window.location.reload(), 100);
                return { users: updatedUsers, currentUserId: DEFAULT_USER_ID };
            }

            return { users: updatedUsers };
        });

        // Clean up data
        localStorage.removeItem(`pillbow_data_${userId}`);
    },

    syncGoogleUser: (googleProfile: any) => {
        set(state => {
            const { users, currentUserId } = state;
            const updatedUsers = users.map(user => {
                if (user.id === currentUserId) {
                    return {
                        ...user,
                        name: googleProfile.name,
                        email: googleProfile.email,
                        photoURL: googleProfile.photoURL,
                        avatar: googleProfile.photoURL, // Overwrite avatar with Google photo
                        isGoogleUser: true,
                        googleId: googleProfile.id
                    };
                }
                return user;
            });
            localStorage.setItem('pillbow_users', JSON.stringify(updatedUsers));
            return { users: updatedUsers };
        });
    },

    clearGoogleUser: () => {
        set(state => {
            const { users, currentUserId } = state;
            const updatedUsers = users.map(user => {
                if (user.id === currentUserId) {
                    const { email, photoURL, isGoogleUser, googleId, ...rest } = user;
                    return {
                        ...rest,
                        avatar: '👤' // Reset to default avatar
                    };
                }
                return user;
            });
            localStorage.setItem('pillbow_users', JSON.stringify(updatedUsers));
            return { users: updatedUsers };
        });
    }
}));
