import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { mockChats, Chat, ChatMessage } from '@/data/mockChats';

interface ChatContextValue {
  chats: Chat[];
  getChat: (id: string) => Chat | undefined;
  sendMessage: (chatId: string, senderId: string, senderName: string, senderAvatarColor: string, text: string) => void;
  markChatRead: (chatId: string) => void;
  totalUnread: number;
  createGroupChat: (eventTitle: string, eventId: string, participantIds: string[], participantNames: string[]) => Chat;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[]>(mockChats);

  const totalUnread = chats.reduce((sum, c) => sum + c.unreadCount, 0);

  const getChat = (id: string) => chats.find(c => c.id === id);

  const sendMessage = (chatId: string, senderId: string, senderName: string, senderAvatarColor: string, text: string) => {
    setChats(prev => prev.map(chat => {
      if (chat.id !== chatId) return chat;
      const newMsg: ChatMessage = {
        id: `msg_${Date.now()}`,
        chatId,
        senderId,
        senderName,
        senderAvatarColor,
        text,
        timestamp: 'Just now',
        isRead: false,
      };
      return {
        ...chat,
        messages: [...chat.messages, newMsg],
        lastMessage: text,
        lastMessageTime: 'Just now',
      };
    }));
  };

  const markChatRead = (chatId: string) => {
    setChats(prev => prev.map(chat =>
      chat.id === chatId
        ? { ...chat, unreadCount: 0, messages: chat.messages.map(m => ({ ...m, isRead: true })) }
        : chat
    ));
  };

  const createGroupChat = (eventTitle: string, eventId: string, participantIds: string[], participantNames: string[]): Chat => {
    const newChat: Chat = {
      id: `c_${Date.now()}`,
      type: 'group',
      title: `${eventTitle} Crew`,
      eventId,
      participantIds,
      participantNames,
      avatarColor: '#CDB9FF',
      lastMessage: 'Group chat created!',
      lastMessageTime: 'Just now',
      unreadCount: 1,
      messages: [
        {
          id: `msg_${Date.now()}`,
          chatId: `c_${Date.now()}`,
          senderId: 'system',
          senderName: 'System',
          senderAvatarColor: '#E0E0E0',
          text: `Welcome to the ${eventTitle} crew chat! Get ready for an amazing event.`,
          timestamp: 'Just now',
          isRead: false,
        },
      ],
    };
    setChats(prev => [newChat, ...prev]);
    return newChat;
  };

  const value = useMemo(() => ({
    chats,
    getChat,
    sendMessage,
    markChatRead,
    totalUnread,
    createGroupChat,
  }), [chats, totalUnread]);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
}
