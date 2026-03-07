import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadow } from '@/constants/theme';
import { Avatar } from '@/components/ui/Avatar';
import { useChat } from '@/context/ChatContext';
import { Chat } from '@/data/mockChats';

function ChatRow({ chat, onPress }: { chat: Chat; onPress: () => void }) {
  const initials = chat.title.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chatRow,
        shadow.card,
        { opacity: pressed ? 0.9 : 1 }
      ]}
    >
      <View style={[styles.chatAvatarWrap, { backgroundColor: chat.avatarColor + '50' }]}>
        <Ionicons
          name={chat.type === 'group' ? 'people' : 'person'}
          size={22}
          color={chat.avatarColor}
        />
      </View>
      <View style={styles.chatInfo}>
        <View style={styles.chatTitleRow}>
          <Text style={styles.chatTitle} numberOfLines={1}>{chat.title}</Text>
          <Text style={styles.chatTime}>{chat.lastMessageTime}</Text>
        </View>
        <View style={styles.chatLastRow}>
          <Text style={styles.chatLastMsg} numberOfLines={1}>{chat.lastMessage}</Text>
          {chat.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{chat.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

export default function MessagesInboxScreen() {
  const insets = useSafeAreaInsets();
  const { chats, totalUnread } = useChat();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const botPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const groupChats = chats.filter(c => c.type === 'group');
  const dms = chats.filter(c => c.type === 'dm');

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, shadow.card]}>
          <Ionicons name="chevron-back" size={22} color={colors.textSecondary} />
        </Pressable>
        <Text style={styles.title}>Messages</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.list, { paddingBottom: botPad + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {groupChats.length > 0 && (
          <>
            <Text style={styles.sectionHeader}>Crew Chats</Text>
            {groupChats.map(chat => (
              <ChatRow
                key={chat.id}
                chat={chat}
                onPress={() => router.push(`/messages/${chat.id}`)}
              />
            ))}
          </>
        )}
        {dms.length > 0 && (
          <>
            <Text style={styles.sectionHeader}>Direct Messages</Text>
            {dms.map(chat => (
              <ChatRow
                key={chat.id}
                chat={chat}
                onPress={() => router.push(`/messages/${chat.id}`)}
              />
            ))}
          </>
        )}
        {chats.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="chatbubbles-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>No messages yet</Text>
            <Text style={styles.emptySubtext}>Get booked to join a crew chat!</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundPrimary },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingBottom: spacing.md,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceCard, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontFamily: 'Inter_700Bold', color: colors.textPrimary },
  list: { paddingHorizontal: spacing.md, gap: spacing.xs },
  sectionHeader: { ...typography.sectionTitle, color: colors.textSecondary, fontFamily: 'Inter_600SemiBold', marginTop: spacing.sm, marginBottom: 2 },
  chatRow: {
    backgroundColor: colors.surfaceCard, borderRadius: radius.card,
    padding: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
  },
  chatAvatarWrap: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  chatInfo: { flex: 1, gap: 4 },
  chatTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chatTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: colors.textPrimary, flex: 1, marginRight: spacing.sm },
  chatTime: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
  chatLastRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  chatLastMsg: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_400Regular', flex: 1, marginRight: spacing.sm },
  unreadBadge: { backgroundColor: colors.accentPrimary, borderRadius: 10, minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
  unreadBadgeText: { fontSize: 11, fontFamily: 'Inter_700Bold', color: '#fff' },
  empty: { alignItems: 'center', paddingVertical: 80, gap: spacing.md },
  emptyText: { ...typography.sectionTitle, color: colors.textSecondary, fontFamily: 'Inter_600SemiBold' },
  emptySubtext: { ...typography.body, color: colors.textMuted, fontFamily: 'Inter_400Regular', textAlign: 'center' },
});
