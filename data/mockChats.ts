export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderAvatarColor: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  isPinned?: boolean;
  type?: 'text' | 'im_here' | 'running_late' | 'location';
}

export interface Chat {
  id: string;
  type: 'group' | 'dm';
  title: string;
  eventId?: string;
  participantIds: string[];
  participantNames: string[];
  avatarColor: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
  pinnedInfo?: {
    location: string;
    callTime: string;
    instructions: string;
  };
}

export const mockChats: Chat[] = [
  // Group chat for Greek Week Afterparty
  {
    id: 'c1',
    type: 'group',
    title: 'Greek Week Afterparty Crew',
    eventId: 'e1',
    participantIds: ['h1', 'w1', 'w2'],
    participantNames: ['Jessica McCall', 'Alex Kim', 'Maya Chen'],
    avatarColor: '#CDB9FF',
    lastMessage: "Don't forget early load-in at 8PM! 🎉",
    lastMessageTime: '30 min ago',
    unreadCount: 2,
    pinnedInfo: {
      location: 'NYU Palladium, 140 E 14th St. Staff entrance on side.',
      callTime: '8PM (1hr before doors)',
      instructions: 'Load-in via staff entrance. Parking on E 13th. No exceptions to call time.',
    },
    messages: [
      {
        id: 'm1',
        chatId: 'c1',
        senderId: 'h1',
        senderName: 'Jessica McCall',
        senderAvatarColor: '#FFD9B8',
        text: 'Hey crew! Welcome to the Greek Week Afterparty chat 🎉 So excited to work with y\'all!',
        timestamp: '1 day ago',
        isRead: true,
        isPinned: false,
      },
      {
        id: 'm2',
        chatId: 'c1',
        senderId: 'w1',
        senderName: 'Alex Kim',
        senderAvatarColor: '#CDB9FF',
        text: "Let's go! Already building the setlist. What's the vibe you're going for?",
        timestamp: '1 day ago',
        isRead: true,
      },
      {
        id: 'm3',
        chatId: 'c1',
        senderId: 'h1',
        senderName: 'Jessica McCall',
        senderAvatarColor: '#FFD9B8',
        text: 'High energy, mix of EDM, hip-hop, and some Latin. Maybe peak at midnight.',
        timestamp: '1 day ago',
        isRead: true,
      },
      {
        id: 'm4',
        chatId: 'c1',
        senderId: 'w2',
        senderName: 'Maya Chen',
        senderAvatarColor: '#BFF0D4',
        text: 'Super excited! I\'ll do a mix of candid and posed shots. What\'s the best angle for the DJ booth?',
        timestamp: '23 hrs ago',
        isRead: true,
      },
      {
        id: 'm5',
        chatId: 'c1',
        senderId: 'h1',
        senderName: 'Jessica McCall',
        senderAvatarColor: '#FFD9B8',
        text: "Don't forget early load-in at 8PM! Staff entrance on the side of building.",
        timestamp: '30 min ago',
        isRead: false,
        isPinned: true,
      },
      {
        id: 'm6',
        chatId: 'c1',
        senderId: 'w1',
        senderName: 'Alex Kim',
        senderAvatarColor: '#CDB9FF',
        text: "Roger that! I'll be there at 7:30 to test levels.",
        timestamp: '25 min ago',
        isRead: false,
      },
    ],
  },
  // Group chat for Startup Mixer
  {
    id: 'c2',
    type: 'group',
    title: 'Startup Mixer Crew',
    eventId: 'e2',
    participantIds: ['h2', 'w12'],
    participantNames: ['Sean Brody', 'Dev Kapoor'],
    avatarColor: '#FFD9B8',
    lastMessage: 'Menu confirmed, ready to go!',
    lastMessageTime: '2 hrs ago',
    unreadCount: 0,
    pinnedInfo: {
      location: 'SoHo Works, 29 Little W 12th St. Enter from main entrance.',
      callTime: '6PM sharp',
      instructions: 'Bar setup starts at 5PM. Cocktail menu will be provided on arrival.',
    },
    messages: [
      {
        id: 'm7',
        chatId: 'c2',
        senderId: 'h2',
        senderName: 'Sean Brody',
        senderAvatarColor: '#B9D9FF',
        text: 'Hey Dev! Looking forward to working with you tonight.',
        timestamp: '5 hrs ago',
        isRead: true,
      },
      {
        id: 'm8',
        chatId: 'c2',
        senderId: 'w12',
        senderName: 'Dev Kapoor',
        senderAvatarColor: '#B8FFD4',
        text: "Likewise! What's the cocktail theme for tonight?",
        timestamp: '4 hrs ago',
        isRead: true,
      },
      {
        id: 'm9',
        chatId: 'c2',
        senderId: 'h2',
        senderName: 'Sean Brody',
        senderAvatarColor: '#B9D9FF',
        text: 'Tech startup vibe — clean, modern. Think espresso martinis and classic cocktails.',
        timestamp: '4 hrs ago',
        isRead: true,
      },
      {
        id: 'm10',
        chatId: 'c2',
        senderId: 'w12',
        senderName: 'Dev Kapoor',
        senderAvatarColor: '#B8FFD4',
        text: 'Menu confirmed, ready to go!',
        timestamp: '2 hrs ago',
        isRead: true,
      },
    ],
  },
  // Group chat for Campus Fest
  {
    id: 'c3',
    type: 'group',
    title: 'NYU Campus Fest Crew',
    eventId: 'e5',
    participantIds: ['h1', 'w11', 'w18'],
    participantNames: ['Jessica McCall', 'Emma Rodriguez', 'Jalen Brooks'],
    avatarColor: '#FFD9B8',
    lastMessage: 'Setup starts at 8AM — be there early!',
    lastMessageTime: '1 day ago',
    unreadCount: 1,
    pinnedInfo: {
      location: 'Washington Square Park Main Stage. Meet at fountain.',
      callTime: '8AM for setup crew, 11AM for stage hosts',
      instructions: 'Large event. Multiple zones. Crew check-in at coordinator tent.',
    },
    messages: [
      {
        id: 'm11',
        chatId: 'c3',
        senderId: 'h1',
        senderName: 'Jessica McCall',
        senderAvatarColor: '#FFD9B8',
        text: 'Campus Fest crew, welcome! This is going to be huge.',
        timestamp: '3 days ago',
        isRead: true,
      },
      {
        id: 'm12',
        chatId: 'c3',
        senderId: 'w11',
        senderName: 'Emma Rodriguez',
        senderAvatarColor: '#FFD4B8',
        text: '¡Hola! So pumped to MC this. NYU needs a bilingual host!',
        timestamp: '3 days ago',
        isRead: true,
      },
      {
        id: 'm13',
        chatId: 'c3',
        senderId: 'h1',
        senderName: 'Jessica McCall',
        senderAvatarColor: '#FFD9B8',
        text: 'Setup starts at 8AM — be there early!',
        timestamp: '1 day ago',
        isRead: false,
      },
    ],
  },
  // DM: Alex Kim → Jessica McCall
  {
    id: 'dm1',
    type: 'dm',
    title: 'Jessica McCall',
    participantIds: ['w1', 'h1'],
    participantNames: ['Alex Kim', 'Jessica McCall'],
    avatarColor: '#FFD9B8',
    lastMessage: 'Looking forward to seeing you there!',
    lastMessageTime: '1 hr ago',
    unreadCount: 1,
    messages: [
      {
        id: 'dm1m1',
        chatId: 'dm1',
        senderId: 'h1',
        senderName: 'Jessica McCall',
        senderAvatarColor: '#FFD9B8',
        text: "Hey Alex! I loved your SoundCloud. You're perfect for Greek Week.",
        timestamp: '2 days ago',
        isRead: true,
      },
      {
        id: 'dm1m2',
        chatId: 'dm1',
        senderId: 'w1',
        senderName: 'Alex Kim',
        senderAvatarColor: '#CDB9FF',
        text: "Thank you so much! I've been following the NYU events and Greek Week is always legendary.",
        timestamp: '2 days ago',
        isRead: true,
      },
      {
        id: 'dm1m3',
        chatId: 'dm1',
        senderId: 'h1',
        senderName: 'Jessica McCall',
        senderAvatarColor: '#FFD9B8',
        text: 'I\'d love to officially book you. Does $220 work?',
        timestamp: '1 day ago',
        isRead: true,
      },
      {
        id: 'dm1m4',
        chatId: 'dm1',
        senderId: 'w1',
        senderName: 'Alex Kim',
        senderAvatarColor: '#CDB9FF',
        text: "Absolutely! That works for me. Can't wait!",
        timestamp: '1 day ago',
        isRead: true,
      },
      {
        id: 'dm1m5',
        chatId: 'dm1',
        senderId: 'h1',
        senderName: 'Jessica McCall',
        senderAvatarColor: '#FFD9B8',
        text: 'Looking forward to seeing you there!',
        timestamp: '1 hr ago',
        isRead: false,
      },
    ],
  },
  // DM: Jordan Walsh → Marcus Davis (host)
  {
    id: 'dm2',
    type: 'dm',
    title: 'Marcus Davis',
    participantIds: ['w3', 'h5'],
    participantNames: ['Jordan Walsh', 'Marcus Davis'],
    avatarColor: '#B8F0D4',
    lastMessage: "We need cinematic quality for this one. Can you pull that off?",
    lastMessageTime: '5 hrs ago',
    unreadCount: 0,
    messages: [
      {
        id: 'dm2m1',
        chatId: 'dm2',
        senderId: 'h5',
        senderName: 'Marcus Davis',
        senderAvatarColor: '#B8F0D4',
        text: "Jordan, saw your reel from that Brooklyn show. Impressive stuff.",
        timestamp: '6 hrs ago',
        isRead: true,
      },
      {
        id: 'dm2m2',
        chatId: 'dm2',
        senderId: 'w3',
        senderName: 'Jordan Walsh',
        senderAvatarColor: '#FFD9B8',
        text: "Thanks! The rooftop venue will make amazing footage.",
        timestamp: '6 hrs ago',
        isRead: true,
      },
      {
        id: 'dm2m3',
        chatId: 'dm2',
        senderId: 'h5',
        senderName: 'Marcus Davis',
        senderAvatarColor: '#B8F0D4',
        text: "We need cinematic quality for this one. Can you pull that off?",
        timestamp: '5 hrs ago',
        isRead: true,
      },
    ],
  },
];
