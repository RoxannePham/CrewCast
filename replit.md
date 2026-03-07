# CrewCast — Gen-Z Event Staffing Platform

## Overview
CrewCast connects workers (DJs, photographers, etc.) with event organizers via an Expo React Native mobile app with Express backend.

## Tech Stack
- **Frontend**: Expo (SDK 54), React Native, Expo Router (file-based routing), TypeScript
- **Backend**: Express + TypeScript on port 5000
- **State**: React Context (AuthContext, AppContext, NotificationsContext, ChatContext), AsyncStorage for persistence
- **Data Fetching**: @tanstack/react-query with custom query client
- **Styling**: React Native StyleSheet, warm pastel palette, Inter font family, 22px radius cards

## Architecture

### Routing (Expo Router)
```
app/
  _layout.tsx            # Root layout with providers + AuthGate
  (tabs)/
    _layout.tsx          # Tab navigation (Home, Gigs, Post, Crew, Discussions, Profile)
    index.tsx            # Home screen
    gigs.tsx             # Gig listings with search/filter
    post.tsx             # Post new event
    crew.tsx             # Crew management
    discussions.tsx      # Community feed
    profile.tsx          # User profile
  auth/
    login.tsx            # Login with demo login
    signup.tsx           # Sign up with role selection
  onboarding/
    index.tsx            # Welcome screen (Get Started / Login)
    worker-setup.tsx     # 4-step worker onboarding (resume OR prompts)
    host-setup.tsx       # 3-step host onboarding
  event/[id].tsx         # Event detail (overview/roles/crew tabs)
  candidate/[id].tsx     # Worker profile + application material
  organizations/
    index.tsx            # Organizations list with search/category filter
    [id].tsx             # Organization detail with links
  messages/
    index.tsx            # Messages list
    [id].tsx             # Chat thread
  notifications.tsx      # Notifications screen
```

### Context Providers (order matters)
1. QueryClientProvider
2. AuthProvider — auth state, onboarding profile, profile completeness
3. AppProvider — events, workers, applications, apply logic (uses useAuth internally)
4. NotificationsProvider
5. ChatProvider

### Auth Flow
- Splash screen while loading → AuthGate redirects:
  - Not authenticated → /onboarding (welcome)
  - Authenticated, onboarding incomplete → /onboarding
  - Authenticated, onboarding complete → /(tabs)
- Demo login: alex@nyu.edu / any password

### Apply Flow
- `applyToRole(roleId, eventId)` returns `ApplyResult` with reasons:
  - `not_authenticated` → redirect to login
  - `incomplete_profile` → Alert with "Complete Profile" CTA
  - `host_user` → silent rejection (hide button)
  - `already_applied` → disabled button
  - `applied` → success with confirmation

### Design System (constants/theme.ts)
- backgroundPrimary: `#F6F1E8`
- accentPrimary: `#FF7B8A`
- accentLavender: `#CDB9FF`
- accentMint: `#BFF0D4`
- accentPeach: `#FFD9B8`
- accentBlue: `#B9D9FF`
- Card radius: 22px, Inter font (400/500/600/700)

### Key Data Files
- `data/mockUsers.ts` — WorkerProfile/HostProfile with portraits
- `data/mockEvents.ts` — MockEvent with EventRole entries
- `data/mockApplications.ts` — Application with profile data fields
- `data/mockOrganizations.ts` — 20 Rutgers organizations with real links

### Important Patterns
- Safe area: `Platform.OS === 'web' ? 67 : insets.top` for top padding
- Web bottom inset: 34px (or 84px for tab bar)
- Portraits: 10 in assets/mock/users/, workers w9-w20 use avatarColor fallback
- Event images: Only event-hero.png and event-mixer.png exist; others use gradient fallback
- No emojis in UI — use Ionicons, Feather, MaterialCommunityIcons
