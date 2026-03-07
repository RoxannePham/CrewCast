import React, { createContext, useContext, useState, useMemo, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockWorkers, mockHosts, WorkerProfile, HostProfile } from '@/data/mockUsers';

type AuthUser = WorkerProfile | HostProfile | null;

export interface OnboardingProfile {
  roles: string[];
  skills: string[];
  bio: string;
  resumeUri: string | null;
  portfolioUrl: string;
  linkedinUrl: string;
  websiteUrl: string;
  experienceLevel: string;
  promptAnswers: Record<string, string>;
  school: string;
  major: string;
  organization: string;
  availability: string[];
  eventTypes: string[];
  orgRole: string;
  contactEmail: string;
  hostBio: string;
}

const EMPTY_PROFILE: OnboardingProfile = {
  roles: [],
  skills: [],
  bio: '',
  resumeUri: null,
  portfolioUrl: '',
  linkedinUrl: '',
  websiteUrl: '',
  experienceLevel: '',
  promptAnswers: {},
  school: '',
  major: '',
  organization: '',
  availability: [],
  eventTypes: [],
  orgRole: '',
  contactEmail: '',
  hostBio: '',
};

interface AuthContextValue {
  user: AuthUser;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  onboardingProfile: OnboardingProfile;
  profileSummary: string;
  isProfileComplete: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string, role: 'worker' | 'host', extra?: Partial<OnboardingProfile>) => Promise<void>;
  signOut: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  updateUser: (updates: Partial<WorkerProfile | HostProfile>) => void;
  updateOnboardingProfile: (data: Partial<OnboardingProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'crewcast_auth';
const ONBOARDING_KEY = 'crewcast_onboarding';
const PROFILE_KEY = 'crewcast_profile';

function generateProfileSummary(profile: OnboardingProfile): string {
  const parts: string[] = [];
  if (profile.roles.length > 0) {
    parts.push(`Experienced ${profile.roles.join(', ')}`);
  }
  if (profile.promptAnswers.workType) {
    parts.push(profile.promptAnswers.workType);
  }
  if (profile.promptAnswers.pastExperience) {
    parts.push(`Previously worked with ${profile.promptAnswers.pastExperience}`);
  }
  if (profile.skills.length > 0) {
    parts.push(`Skills: ${profile.skills.join(', ')}`);
  }
  if (profile.promptAnswers.tools) {
    parts.push(`Proficient in ${profile.promptAnswers.tools}`);
  }
  if (profile.experienceLevel) {
    parts.push(`Experience level: ${profile.experienceLevel}`);
  }
  if (profile.bio) {
    parts.push(profile.bio);
  }
  return parts.length > 0 ? parts.join('. ') + '.' : '';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [onboardingProfile, setOnboardingProfile] = useState<OnboardingProfile>(EMPTY_PROFILE);

  useEffect(() => {
    loadAuth();
  }, []);

  async function loadAuth() {
    try {
      const [storedAuth, storedOnboarding, storedProfile] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(ONBOARDING_KEY),
        AsyncStorage.getItem(PROFILE_KEY),
      ]);
      if (storedAuth) {
        setUser(JSON.parse(storedAuth));
      }
      if (storedOnboarding) {
        setHasCompletedOnboarding(true);
      }
      if (storedProfile) {
        setOnboardingProfile({ ...EMPTY_PROFILE, ...JSON.parse(storedProfile) });
      }
    } catch (e) {
      console.error('Failed to load auth', e);
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    const found = [...mockWorkers, ...mockHosts].find(u => u.email.toLowerCase() === email.toLowerCase());
    const authUser = found || mockWorkers[0];
    setUser(authUser);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    setHasCompletedOnboarding(true);
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
  }

  async function signUp(name: string, email: string, password: string, role: 'worker' | 'host', extra?: Partial<OnboardingProfile>) {
    const template = role === 'worker' ? mockWorkers[0] : mockHosts[0];
    const authUser = { ...template, name, email };
    setUser(authUser as AuthUser);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    if (extra) {
      const merged = { ...onboardingProfile, ...extra };
      setOnboardingProfile(merged);
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(merged));
    }
  }

  async function signOut() {
    setUser(null);
    setHasCompletedOnboarding(false);
    setOnboardingProfile(EMPTY_PROFILE);
    await AsyncStorage.multiRemove([STORAGE_KEY, ONBOARDING_KEY, PROFILE_KEY]);
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

  async function updateOnboardingProfile(data: Partial<OnboardingProfile>) {
    const merged = { ...onboardingProfile, ...data };
    setOnboardingProfile(merged);
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(merged));
  }

  const profileSummary = useMemo(() => generateProfileSummary(onboardingProfile), [onboardingProfile]);

  const isProfileComplete = useMemo(() => {
    if (!user) return false;
    if (user.type === 'worker') {
      return (onboardingProfile.roles.length > 0 || (user as WorkerProfile).roles.length > 0)
        && (!!onboardingProfile.bio || !!(user as WorkerProfile).bio);
    }
    return true;
  }, [user, onboardingProfile]);

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    hasCompletedOnboarding,
    onboardingProfile,
    profileSummary,
    isProfileComplete,
    signIn,
    signUp,
    signOut,
    completeOnboarding,
    updateUser,
    updateOnboardingProfile,
  }), [user, isLoading, hasCompletedOnboarding, onboardingProfile, profileSummary, isProfileComplete]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
