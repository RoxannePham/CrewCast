import React, { createContext, useContext, useState, useMemo, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockWorkers, mockHosts, WorkerProfile, HostProfile } from '@/data/mockUsers';

type AuthUser = WorkerProfile | HostProfile | null;

interface AuthContextValue {
  user: AuthUser;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string, role: 'worker' | 'host') => Promise<void>;
  signOut: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  updateUser: (updates: Partial<WorkerProfile | HostProfile>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'crewcast_auth';
const ONBOARDING_KEY = 'crewcast_onboarding';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    loadAuth();
  }, []);

  async function loadAuth() {
    try {
      const [storedAuth, storedOnboarding] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(ONBOARDING_KEY),
      ]);
      if (storedAuth) {
        setUser(JSON.parse(storedAuth));
      }
      if (storedOnboarding) {
        setHasCompletedOnboarding(true);
      }
    } catch (e) {
      console.error('Failed to load auth', e);
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    // Find user in mock data or use first worker as demo
    const found = [...mockWorkers, ...mockHosts].find(u => u.email.toLowerCase() === email.toLowerCase());
    const authUser = found || mockWorkers[0]; // Default to Alex Kim for demo
    setUser(authUser);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    setHasCompletedOnboarding(true);
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
  }

  async function signUp(name: string, email: string, password: string, role: 'worker' | 'host') {
    // Use existing mock users mapped by role
    const authUser = role === 'worker' ? mockWorkers[0] : mockHosts[0];
    setUser({ ...authUser, name, email });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ ...authUser, name, email }));
  }

  async function signOut() {
    setUser(null);
    setHasCompletedOnboarding(false);
    await AsyncStorage.multiRemove([STORAGE_KEY, ONBOARDING_KEY]);
  }

  async function completeOnboarding() {
    setHasCompletedOnboarding(true);
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
  }

  function updateUser(updates: Partial<WorkerProfile | HostProfile>) {
    if (user) {
      const updated = { ...user, ...updates };
      setUser(updated as AuthUser);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  }

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    hasCompletedOnboarding,
    signIn,
    signUp,
    signOut,
    completeOnboarding,
    updateUser,
  }), [user, isLoading, hasCompletedOnboarding]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
