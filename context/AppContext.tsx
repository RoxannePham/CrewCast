import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { mockWorkers, mockHosts, WorkerProfile, HostProfile } from '@/data/mockUsers';
import { mockEvents, MockEvent, EventRole } from '@/data/mockEvents';
import { mockApplications, Application, ApplicationStatus } from '@/data/mockApplications';

export type { WorkerProfile, HostProfile };
export type { MockEvent, EventRole };
export type { Application, ApplicationStatus };

interface AppContextValue {
  events: MockEvent[];
  workers: WorkerProfile[];
  hosts: HostProfile[];
  applications: Application[];
  location: string;
  setLocation: (loc: string) => void;
  appliedRoles: Set<string>;
  bookedWorkers: Set<string>;
  applyToRole: (roleId: string, eventId: string) => void;
  bookWorker: (workerId: string) => void;
  getEventApplications: (eventId: string) => Application[];
  getRoleApplications: (roleId: string) => Application[];
  updateApplicationStatus: (appId: string, status: ApplicationStatus) => void;
  getAllGigRoles: () => (EventRole & { event: MockEvent })[];
  getWorkerById: (id: string) => WorkerProfile | undefined;
  getEventById: (id: string) => MockEvent | undefined;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [appliedRoles, setAppliedRoles] = useState<Set<string>>(new Set(['r1', 'r4']));
  const [bookedWorkers, setBookedWorkers] = useState<Set<string>>(new Set(['w2', 'w12']));
  const [location, setLocation] = useState('NYU Area');

  const applyToRole = (roleId: string, eventId: string) => {
    setAppliedRoles(prev => new Set([...prev, roleId]));
    const newApp: Application = {
      id: `a_${Date.now()}`,
      workerId: 'w1',
      roleId,
      eventId,
      status: 'pending',
      note: 'Applying from the app!',
      appliedAt: 'Just now',
    };
    setApplications(prev => [...prev, newApp]);
  };

  const bookWorker = (workerId: string) => {
    setBookedWorkers(prev => new Set([...prev, workerId]));
  };

  const getEventApplications = (eventId: string) =>
    applications.filter(a => a.eventId === eventId);

  const getRoleApplications = (roleId: string) =>
    applications.filter(a => a.roleId === roleId);

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
  }), [applications, appliedRoles, bookedWorkers, location]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
