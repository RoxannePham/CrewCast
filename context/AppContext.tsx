import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  distance: string;
  coverImage?: string;
  themeColor: string;
  tags: string[];
  type: 'tonight' | 'recommended';
  pay?: number;
  applicants?: number;
}

export interface CrewMember {
  id: string;
  name: string;
  role: string;
  rating: number;
  gigs: number;
  avatar?: string;
  avatarColor: string;
  reliabilityScore: number;
  skills: string[];
  badges: string[];
  isTopRated?: boolean;
  isOnTime?: boolean;
  isCampusVerified?: boolean;
  location?: string;
}

export interface GigRole {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  roleType: string;
  pay: number;
  shiftStart: string;
  shiftEnd: string;
  slots: number;
  location: string;
  tags: string[];
  themeColor: string;
  distance: string;
}

export interface DiscussionPost {
  id: string;
  author: CrewMember;
  content: string;
  timestamp: string;
  replies: number;
  likes: number;
  shares: number;
  category: 'foryou' | 'nyu' | 'photovideo' | 'tips';
  images?: string[];
  eventRef?: string;
  isPinned?: boolean;
}

const SAMPLE_CREW: CrewMember[] = [
  {
    id: '1',
    name: 'Alex Kim',
    role: 'DJ',
    rating: 4.9,
    gigs: 23,
    avatarColor: '#CDB9FF',
    reliabilityScore: 97,
    skills: ['House', 'EDM', 'Hip-Hop'],
    badges: ['Top Rated', 'On Time'],
    isTopRated: true,
    isOnTime: true,
    isCampusVerified: true,
    location: 'NYU Area',
  },
  {
    id: '2',
    name: 'Maya Chen',
    role: 'Photographer',
    rating: 4.7,
    gigs: 18,
    avatarColor: '#BFF0D4',
    reliabilityScore: 94,
    skills: ['EDM', 'House Party', 'Portrait'],
    badges: ['Campus Verified'],
    isCampusVerified: true,
    location: 'Manhattan',
  },
  {
    id: '3',
    name: 'Jordan Walsh',
    role: 'Videographer',
    rating: 4.8,
    gigs: 31,
    avatarColor: '#FFD9B8',
    reliabilityScore: 98,
    skills: ['Reels', 'Live Stream', 'Event'],
    badges: ['Top Rated', 'Campus Verified'],
    isTopRated: true,
    isCampusVerified: true,
    location: 'Brooklyn',
  },
  {
    id: '4',
    name: 'Sam Rivera',
    role: 'Host / MC',
    rating: 4.6,
    gigs: 14,
    avatarColor: '#B9D9FF',
    reliabilityScore: 91,
    skills: ['Comedy', 'Campus Events', 'Greek Life'],
    badges: ['On Time'],
    isOnTime: true,
    location: 'NYU Area',
  },
];

const SAMPLE_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Greek Week Afterparty',
    date: 'April 20',
    time: '9PM - 1AM',
    location: 'NYU Campus',
    distance: '0.4 miles away',
    themeColor: '#CDB9FF',
    tags: ['DJ', 'Photographer'],
    type: 'tonight',
    pay: 220,
    applicants: 12,
  },
  {
    id: '2',
    title: 'Startup Mixer',
    date: 'Tonight',
    time: '7PM - 9AM',
    location: 'SoHo',
    distance: '0.2 miles away',
    themeColor: '#FFD9B8',
    tags: ['Host', 'Photographer'],
    type: 'recommended',
    pay: 250,
    applicants: 8,
  },
  {
    id: '3',
    title: 'Rooftop Rave',
    date: 'April 22',
    time: '10PM - 3AM',
    location: 'Brooklyn',
    distance: '1.2 miles away',
    themeColor: '#BFF0D4',
    tags: ['DJ', 'Videographer'],
    type: 'recommended',
    pay: 300,
    applicants: 5,
  },
];

const SAMPLE_GIGS: GigRole[] = [
  {
    id: '1',
    eventId: '1',
    eventTitle: 'Greek Week Afterparty',
    eventDate: 'April 20 • 9PM - 1AM',
    roleType: 'DJ',
    pay: 220,
    shiftStart: '9PM',
    shiftEnd: '1AM',
    slots: 1,
    location: 'NYU Area',
    tags: ['House', 'EDM', 'Latin'],
    themeColor: '#CDB9FF',
    distance: '0.4 mi',
  },
  {
    id: '2',
    eventId: '1',
    eventTitle: 'Greek Week Afterparty',
    eventDate: 'April 20 • 9PM - 1AM',
    roleType: 'Photographer',
    pay: 180,
    shiftStart: '9PM',
    shiftEnd: '12AM',
    slots: 2,
    location: 'NYU Area',
    tags: ['Event', 'Portrait', 'Social Media'],
    themeColor: '#FF7B8A',
    distance: '0.4 mi',
  },
  {
    id: '3',
    eventId: '2',
    eventTitle: 'Startup Mixer',
    eventDate: 'Tonight • 7PM - 9PM',
    roleType: 'Host / MC',
    pay: 250,
    shiftStart: '7PM',
    shiftEnd: '9PM',
    slots: 1,
    location: 'SoHo',
    tags: ['Corporate', 'Networking'],
    themeColor: '#FFD9B8',
    distance: '0.2 mi',
  },
  {
    id: '4',
    eventId: '3',
    eventTitle: 'Rooftop Rave',
    eventDate: 'April 22 • 10PM - 3AM',
    roleType: 'Videographer',
    pay: 300,
    shiftStart: '10PM',
    shiftEnd: '3AM',
    slots: 1,
    location: 'Brooklyn',
    tags: ['Reels', 'Live Stream'],
    themeColor: '#BFF0D4',
    distance: '1.2 mi',
  },
  {
    id: '5',
    eventId: '2',
    eventTitle: 'Brand Launch Party',
    eventDate: 'April 25 • 8PM - 12AM',
    roleType: 'Content Creator',
    pay: 400,
    shiftStart: '8PM',
    shiftEnd: '12AM',
    slots: 3,
    location: 'Tribeca',
    tags: ['TikTok', 'Instagram', 'Brand'],
    themeColor: '#B9D9FF',
    distance: '0.8 mi',
  },
];

const SAMPLE_DISCUSSIONS: DiscussionPost[] = [
  {
    id: '1',
    author: SAMPLE_CREW[0],
    content: 'Looking for a photographer for Greek Week! Queens at 37 of shift, $220 in Macknaan for an angogement. 9PM, 5m',
    timestamp: '5 min ago',
    replies: 10,
    likes: 33,
    shares: 2,
    category: 'nyu',
    isPinned: false,
  },
  {
    id: '2',
    author: SAMPLE_CREW[1],
    content: 'Photographer can neexits sengsCnight? Host TM, Meire can presented.',
    timestamp: '12 min ago',
    replies: 146,
    likes: 33,
    shares: 21,
    category: 'foryou',
  },
  {
    id: '3',
    author: SAMPLE_CREW[3],
    content: 'Epic night ahead for Greek Week. Let\'s make this one legendary! The energy is unmatched.',
    timestamp: '1 hr ago',
    replies: 31,
    likes: 87,
    shares: 12,
    category: 'foryou',
    eventRef: 'Greek Week Afterparty',
    isPinned: true,
  },
];

interface AppContextValue {
  events: Event[];
  crew: CrewMember[];
  gigs: GigRole[];
  discussions: DiscussionPost[];
  confirmedCrew: CrewMember[];
  appliedGigs: Set<string>;
  bookedCrew: Set<string>;
  applyToGig: (gigId: string) => void;
  bookCrew: (crewId: string) => void;
  location: string;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [appliedGigs, setAppliedGigs] = useState<Set<string>>(new Set());
  const [bookedCrew, setBookedCrew] = useState<Set<string>>(new Set());

  const applyToGig = (gigId: string) => {
    setAppliedGigs(prev => new Set([...prev, gigId]));
  };

  const bookCrew = (crewId: string) => {
    setBookedCrew(prev => new Set([...prev, crewId]));
  };

  const value = useMemo(() => ({
    events: SAMPLE_EVENTS,
    crew: SAMPLE_CREW,
    gigs: SAMPLE_GIGS,
    discussions: SAMPLE_DISCUSSIONS,
    confirmedCrew: SAMPLE_CREW.slice(0, 2),
    appliedGigs,
    bookedCrew,
    applyToGig,
    bookCrew,
    location: 'NYU Area',
  }), [appliedGigs, bookedCrew]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
