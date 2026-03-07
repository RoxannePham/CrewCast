import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, radius, shadow } from '@/constants/theme';
import { Avatar } from '@/components/ui/Avatar';
import { useNotifications } from '@/context/NotificationsContext';
import { AppNotification } from '@/data/mockNotifications';

const TYPE_ICONS: Record<string, { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  new_application: { icon: 'person-add-outline', color: colors.accentPrimary },
  shortlisted: { icon: 'star-outline', color: colors.starGold },
  messaged: { icon: 'chatbubble-outline', color: colors.accentBlue },
  booked: { icon: 'checkmark-circle-outline', color: colors.accentMint.replace('BFF0D4', '1A6635') },
  booking_accepted: { icon: 'checkmark-circle', color: '#1A6635' },
  booking_declined: { icon: 'close-circle-outline', color: colors.accentPrimary },
  added_to_group_chat: { icon: 'people-outline', color: colors.accentLavender },
  new_chat_message: { icon: 'chatbubbles-outline', color: colors.accentLavender },
  event_updated: { icon: 'calendar-outline', color: colors.accentBlue },
  role_filled: { icon: 'checkmark-done-outline', color: '#1A6635' },
  check_in_reminder: { icon: 'time-outline', color: colors.accentPeach },
  announcement: { icon: 'megaphone-outline', color: colors.accentPrimary },
};

function NotifItem({ notif, onPress }: { notif: AppNotification; onPress: () => void }) {
  const config = TYPE_ICONS[notif.type] || { icon: 'notifications-outline' as keyof typeof Ionicons.glyphMap, color: colors.accentPrimary };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.notifCard,
        !notif.isRead && styles.notifCardUnread,
        shadow.card,
        { opacity: pressed ? 0.9 : 1 }
      ]}
    >
      <View style={[styles.iconCircle, { backgroundColor: config.color + '20' }]}>
        <Ionicons name={config.icon} size={20} color={config.color} />
      </View>
      <View style={styles.notifInfo}>
        <Text style={styles.notifMessage} numberOfLines={2}>{notif.message}</Text>
        {notif.eventTitle && (
          <Text style={styles.notifEvent} numberOfLines={1}>{notif.eventTitle}</Text>
        )}
        <Text style={styles.notifTime}>{notif.createdAt}</Text>
      </View>
      {!notif.isRead && <View style={styles.unreadDot} />}
    </Pressable>
  );
}

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const botPad = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, shadow.card]}>
          <Ionicons name="chevron-back" size={22} color={colors.textSecondary} />
        </Pressable>
        <Text style={styles.title}>Notifications</Text>
        {unreadCount > 0 ? (
          <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); markAllAsRead(); }}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </Pressable>
        ) : (
          <View style={{ width: 80 }} />
        )}
      </View>
      {unreadCount > 0 && (
        <View style={styles.unreadBanner}>
          <Text style={styles.unreadBannerText}>{unreadCount} unread notification{unreadCount > 1 ? 's' : ''}</Text>
        </View>
      )}
      <ScrollView
        contentContainerStyle={[styles.list, { paddingBottom: botPad + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {notifications.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="notifications-off-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        ) : (
          notifications.map(notif => (
            <NotifItem
              key={notif.id}
              notif={notif}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                markAsRead(notif.id);
                if (notif.eventId) router.push(`/event/${notif.eventId}`);
              }}
            />
          ))
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
  title: { ...typography.sectionTitle, color: colors.textPrimary, fontFamily: 'Inter_700Bold', fontSize: 20 },
  markAllText: { ...typography.meta, color: colors.accentPrimary, fontFamily: 'Inter_600SemiBold' },
  unreadBanner: { marginHorizontal: spacing.md, marginBottom: spacing.sm, backgroundColor: colors.accentPrimary + '15', borderRadius: radius.small, padding: spacing.sm, alignItems: 'center' },
  unreadBannerText: { ...typography.meta, color: colors.accentPrimary, fontFamily: 'Inter_500Medium' },
  list: { paddingHorizontal: spacing.md, gap: spacing.sm },
  notifCard: {
    backgroundColor: colors.surfaceCard, borderRadius: radius.card,
    padding: spacing.md, flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
  },
  notifCardUnread: { backgroundColor: colors.accentPrimary + '08', borderWidth: 1.5, borderColor: colors.accentPrimary + '30' },
  iconCircle: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  notifInfo: { flex: 1, gap: 3 },
  notifMessage: { ...typography.body, color: colors.textPrimary, fontFamily: 'Inter_500Medium', lineHeight: 20 },
  notifEvent: { ...typography.meta, color: colors.accentPrimary, fontFamily: 'Inter_500Medium' },
  notifTime: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
  unreadDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.accentPrimary, marginTop: 4 },
  empty: { alignItems: 'center', paddingVertical: 80, gap: spacing.md },
  emptyText: { ...typography.sectionTitle, color: colors.textSecondary, fontFamily: 'Inter_600SemiBold' },
});
