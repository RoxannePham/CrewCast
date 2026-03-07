import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { mockWorkers, mockHosts, WorkerProfile, HostProfile } from '@/data/mockUsers';
import { mockEvents, MockEvent, EventRole } from '@/data/mockEvents';
import { mockApplications, Application, ApplicationStatus } from '@/data/mockApplications';
import { useAuth } from '@/context/AuthContext';

export type { WorkerProfile, HostProfile };
export type { MockEvent, EventRole };
export type { Application, ApplicationStatus };
export type Event = MockEvent;
export type GigRole = EventRole & { event: MockEvent };

export type ApplyResult = {
  success: boolean;
  reason: 'applied' | 'already_applied' | 'not_authenticated' | 'incomplete_profile' | 'host_user';
  applicationId?: string;
};

interface AppContextValue {
  events: MockEvent[];
  workers: WorkerProfile[];
  hosts: HostProfile[];
  applications: Application[];
  location: string;
  setLocation: (loc: string) => void;
  appliedRoles: Set<string>;
  bookedWorkers: Set<string>;
  applyToRole: (roleId: string, eventId: string) => ApplyResult;
  bookWorker: (workerId: string) => void;
  getEventApplications: (eventId: string) => Application[];
  getRoleApplications: (roleId: string) => Application[];
  updateApplicationStatus: (appId: string, status: ApplicationStatus) => void;
  getAllGigRoles: () => (EventRole & { event: MockEvent })[];
  getWorkerById: (id: string) => WorkerProfile | undefined;
  getEventById: (id: string) => MockEvent | undefined;
  getApplicationsByWorker: (workerId: string) => Application[];
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, hasCompletedOnboarding, isProfileComplete, onboardingProfile, profileSummary } = useAuth();
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [appliedRoles, setAppliedRoles] = useState<Set<string>>(new Set(['r1', 'r4']));
  const [bookedWorkers, setBookedWorkers] = useState<Set<string>>(new Set(['w2', 'w12']));
  const [location, setLocation] = useState('NYU Area');

  const applyToRole = (roleId: string, eventId: string): ApplyResult => {
    if (!isAuthenticated || !user) {
      router.push('/auth/login');
      return { success: false, reason: 'not_authenticated' };
    }

    if (user.type === 'host') {
      return { success: false, reason: 'host_user' };
    }

    if (!hasCompletedOnboarding || !isProfileComplete) {
      Alert.alert(
        'Complete Your Profile',
        'Please complete your profile before applying to gigs.',
        [
          { text: 'Complete Profile', onPress: () => router.push('/onboarding/worker-setup') },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
      return { success: false, reason: 'incomplete_profile' };
    }

    if (appliedRoles.has(roleId)) {
      return { success: false, reason: 'already_applied' };
    }

    const appId = `a_${Date.now()}`;
    const workerProfile = user as WorkerProfile;

    const newApp: Application = {
      id: appId,
      workerId: user.id,
      roleId,
      eventId,
      status: 'pending',
      note: onboardingProfile.bio || workerProfile.bio || '',
      appliedAt: 'Just now',
      applicantName: user.name,
      school: onboardingProfile.school || workerProfile.school || '',
      major: onboardingProfile.major || '',
      skills: onboardingProfile.skills.length > 0 ? onboardingProfile.skills : workerProfile.skills,
      bio: onboardingProfile.bio || workerProfile.bio || '',
      resumeUri: onboardingProfile.resumeUri,
      profileSummary: !onboardingProfile.resumeUri ? profileSummary : undefined,
      portfolioUrl: onboardingProfile.portfolioUrl || '',
      linkedinUrl: onboardingProfile.linkedinUrl || '',
      submittedAt: Date.now(),
    };

    setAppliedRoles(prev => new Set([...prev, roleId]));
    setApplications(prev => [...prev, newApp]);
    return { success: true, reason: 'applied', applicationId: appId };
  };

  const bookWorker = (workerId: string) => {
    setBookedWorkers(prev => new Set([...prev, workerId]));
  };

  const getEventApplications = (eventId: string) =>
    applications.filter(a => a.eventId === eventId);

  const getRoleApplications = (roleId: string) =>
    applications.filter(a => a.roleId === roleId);

  const getApplicationsByWorker = (workerId: string) =>
    applications.filter(a => a.workerId === workerId);

  const updateApplicationStatus = (appId: string, status: ApplicationStatus) => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
  };

  const getAllGigRoles = () => {
    const roles: (EventRole & { event: MockEvent })[] = [];
    for (const event of mockEvents) {
      for (const role of event.roles) {
        roles.push({ ...role, event });
      }
    }
    return roles;
  };

  const getWorkerById = (id: string) => mockWorkers.find(w => w.id === id);
  const getEventById = (id: string) => mockEvents.find(e => e.id === id);

  const value = useMemo(() => ({
    events: mockEvents,
    workers: mockWorkers,
    hosts: mockHosts,
    applications,
    location,
    setLocation,
    appliedRoles,
    bookedWorkers,
    applyToRole,
    bookWorker,
    getEventApplications,
    getRoleApplications,
    updateApplicationStatus,
    getAllGigRoles,
    getWorkerById,
    getEventById,
    getApplicationsByWorker,
  }), [applications, appliedRoles, bookedWorkers, location, user, isAuthenticated, hasCompletedOnboarding, isProfileComplete, onboardingProfile, profileSummary]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
