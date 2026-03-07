export type NotificationType =
  | 'new_application'
  | 'shortlisted'
  | 'messaged'
  | 'booked'
  | 'booking_accepted'
  | 'booking_declined'
  | 'added_to_group_chat'
  | 'new_chat_message'
  | 'event_updated'
  | 'role_filled'
  | 'check_in_reminder'
  | 'announcement';

export interface AppNotification {
  id: string;
  type: NotificationType;
  senderId: string;
  senderName: string;
  senderAvatarColor: string;
  recipientId: string;
  eventId?: string;
  eventTitle?: string;
  roleId?: string;
  roleTitle?: string;
  applicationId?: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export const mockNotifications: AppNotification[] = [
  // Host notifications (recipient: h1)
  {
    id: 'n1',
    type: 'new_application',
    senderId: 'w1',
    senderName: 'Alex Kim',
    senderAvatarColor: '#CDB9FF',
    recipientId: 'h1',
    eventId: 'e1',
    eventTitle: 'Greek Week Afterparty',
    roleId: 'r1',
    roleTitle: 'DJ',
    message: 'Alex Kim applied for DJ — Greek Week Afterparty.',
    createdAt: '2 hrs ago',
    isRead: false,
  },
  {
    id: 'n2',
    type: 'new_application',
    senderId: 'w2',
    senderName: 'Maya Chen',
    senderAvatarColor: '#BFF0D4',
    recipientId: 'h2',
    eventId: 'e2',
    eventTitle: 'Startup Mixer',
    roleId: 'r4',
    roleTitle: 'Photographer',
    message: 'Maya Chen applied for Photographer — Startup Mixer.',
    createdAt: '3 hrs ago',
    isRead: false,
  },
  {
    id: 'n3',
    type: 'added_to_group_chat',
    senderId: 'h1',
    senderName: 'Jessica McCall',
    senderAvatarColor: '#FFD9B8',
    recipientId: 'h1',
    eventId: 'e1',
    eventTitle: 'Greek Week Afterparty',
    message: 'Group chat created for Greek Week Afterparty.',
    createdAt: '1 day ago',
    isRead: true,
  },
  {
    id: 'n4',
    type: 'event_updated',
    senderId: 'h1',
    senderName: 'System',
    senderAvatarColor: '#E0E0E0',
    recipientId: 'h1',
    eventId: 'e1',
    eventTitle: 'Greek Week Afterparty',
    message: 'Your event instructions have been updated.',
    createdAt: '2 days ago',
    isRead: true,
  },
  {
    id: 'n5',
    type: 'new_chat_message',
    senderId: 'w1',
    senderName: 'Alex Kim',
    senderAvatarColor: '#CDB9FF',
    recipientId: 'h1',
    eventId: 'e1',
    eventTitle: 'Greek Week Afterparty',
    message: '2 new messages in Greek Week Afterparty chat.',
    createdAt: '30 min ago',
    isRead: false,
  },
  // User notifications (recipient: w1 = Alex Kim)
  {
    id: 'n6',
    type: 'shortlisted',
    senderId: 'h1',
    senderName: 'Jessica McCall',
    senderAvatarColor: '#FFD9B8',
    recipientId: 'w1',
    eventId: 'e1',
    eventTitle: 'Greek Week Afterparty',
    roleId: 'r1',
    roleTitle: 'DJ',
    message: "You've been shortlisted for DJ — Greek Week Afterparty.",
    createdAt: '1 hr ago',
    isRead: false,
  },
  {
    id: 'n7',
    type: 'event_updated',
    senderId: 'h2',
    senderName: 'Sean Brody',
    senderAvatarColor: '#B9D9FF',
    recipientId: 'w1',
    eventId: 'e2',
    eventTitle: 'Startup Mixer',
    message: 'Your application to Startup Mixer was viewed.',
    createdAt: '2 hrs ago',
    isRead: false,
  },
  {
    id: 'n8',
    type: 'booking_accepted',
    senderId: 'h1',
    senderName: 'Jessica McCall',
    senderAvatarColor: '#FFD9B8',
    recipientId: 'w1',
    eventId: 'e1',
    eventTitle: 'Greek Week Afterparty',
    message: 'Booking request from Jessica McCall.',
    createdAt: '3 hrs ago',
    isRead: false,
  },
  {
    id: 'n9',
    type: 'added_to_group_chat',
    senderId: 'h1',
    senderName: 'Jessica McCall',
    senderAvatarColor: '#FFD9B8',
    recipientId: 'w1',
    eventId: 'e1',
    eventTitle: 'Greek Week Afterparty',
    message: "You've been added to the Greek Week Afterparty crew chat.",
    createdAt: '3 hrs ago',
    isRead: true,
  },
  // More notifications
  {
    id: 'n10',
    type: 'new_application',
    senderId: 'w3',
    senderName: 'Jordan Walsh',
    senderAvatarColor: '#FFD9B8',
    recipientId: 'h1',
    eventId: 'e1',
    eventTitle: 'Greek Week Afterparty',
    roleId: 'r3',
    roleTitle: 'Videographer',
    message: 'Jordan Walsh applied for Videographer — Greek Week Afterparty.',
    createdAt: '1 hr ago',
    isRead: false,
  },
  {
    id: 'n11',
    type: 'role_filled',
    senderId: 'h1',
    senderName: 'System',
    senderAvatarColor: '#E0E0E0',
    recipientId: 'h1',
    eventId: 'e1',
    eventTitle: 'Greek Week Afterparty',
    roleId: 'r2',
    roleTitle: 'Photographer',
    message: 'Photographer role for Greek Week Afterparty has been filled!',
    createdAt: '3 hrs ago',
    isRead: true,
  },
  {
    id: 'n12',
    type: 'check_in_reminder',
    senderId: 'h1',
    senderName: 'System',
    senderAvatarColor: '#E0E0E0',
    recipientId: 'w2',
    eventId: 'e1',
    eventTitle: 'Greek Week Afterparty',
    message: "Tonight's event check-in opens at 8PM. Be ready!",
    createdAt: '6 hrs ago',
    isRead: false,
  },
];
