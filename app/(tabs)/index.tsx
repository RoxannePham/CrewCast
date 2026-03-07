import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Platform, Image
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, radius, shadow } from '@/constants/theme';
import { SearchBar } from '@/components/ui/SearchBar';
import { Avatar } from '@/components/ui/Avatar';
import { StarRating } from '@/components/ui/StarRating';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationsContext';
import { useChat } from '@/context/ChatContext';
import { MockEvent } from '@/data/mockEvents';
import { mockOrganizations, Organization } from '@/data/mockOrganizations';

function EventHeroCard({ event, onPress }: { event: MockEvent; onPress: () => void }) {
  const roleCount = event.roles.length;
  const openRoles = event.roles.filter(r => r.filledSlots < r.slots).length;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.heroCard, shadow.cardHeavy, { transform: [{ scale: pressed ? 0.98 : 1 }] }]}
    >
      {event.coverImagePath ? (
        <Image source={event.coverImagePath} style={styles.heroCardImage} resizeMode="cover" />
      ) : (
        <LinearGradient colors={[event.themeColor + 'DD', event.themeColor + '55']} style={styles.heroCardImage} />
      )}
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.65)']} style={StyleSheet.absoluteFill} />
      {event.isTonight && (
        <View style={styles.tonightChip}>
          <Ionicons name="flash" size={11} color="#fff" />
          <Text style={styles.tonightChipText}>TONIGHT</Text>
        </View>
      )}
      <View style={styles.heroCardContent}>
        <Text style={styles.heroCardTitle}>{event.title}</Text>
        <Text style={styles.heroCardOrg}>{event.orgName}</Text>
        <View style={styles.heroCardMeta}>
          <View style={styles.heroMetaItem}>
            <Ionicons name="location-outline" size={12} color="rgba(255,255,255,0.8)" />
            <Text style={styles.heroMetaText}>{event.distance}</Text>
          </View>
          <View style={styles.heroMetaItem}>
            <Ionicons name="time-outline" size={12} color="rgba(255,255,255,0.8)" />
            <Text style={styles.heroMetaText}>{event.time}</Text>
          </View>
          <View style={[styles.openRolesBadge]}>
            <Text style={styles.openRolesText}>{openRoles} open role{openRoles !== 1 ? 's' : ''}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function RecommendedCard({ event, onPress }: { event: MockEvent; onPress: () => void }) {
  const minPay = Math.min(...event.roles.map(r => r.pay));
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.recCard, shadow.card, { transform: [{ scale: pressed ? 0.97 : 1 }] }]}
    >
      <View style={[styles.recCardLeft, { backgroundColor: event.themeColor + '25' }]}>
        <Ionicons name="calendar-outline" size={22} color={event.themeColor} />
      </View>
      <View style={styles.recCardInfo}>
        <Text style={styles.recCardTitle} numberOfLines={1}>{event.title}</Text>
        <Text style={styles.recCardOrg} numberOfLines={1}>{event.orgName}</Text>
        <View style={styles.recCardMeta}>
          <Ionicons name="location-outline" size={11} color={colors.textMuted} />
          <Text style={styles.recCardMetaText}>{event.distance}</Text>
        </View>
      </View>
      <View style={styles.recCardRight}>
        <Text style={styles.recCardPay}>${minPay}+</Text>
        <Text style={styles.recCardPayLabel}>min pay</Text>
      </View>
    </Pressable>
  );
}

const ORG_ICON_MAP: Record<string, string> = {
  Tech: 'hardware-chip-outline',
  Cultural: 'globe-outline',
  Identity: 'heart-outline',
  Arts: 'color-palette-outline',
  Sports: 'football-outline',
  Academic: 'school-outline',
  'Pre-Professional': 'briefcase-outline',
  'Student Government': 'flag-outline',
};

const ORG_COLOR_MAP: Record<string, string> = {
  Tech: colors.accentBlue,
  Cultural: colors.accentPeach,
  Identity: colors.accentPrimary,
  Arts: colors.accentLavender,
  Sports: colors.accentMint,
  Academic: colors.starGold,
  'Pre-Professional': colors.accentBlue,
  'Student Government': colors.accentLavender,
};

function OrgCard({ org, onPress }: { org: Organization; onPress: () => void }) {
  const catColor = ORG_COLOR_MAP[org.category] || colors.textMuted;
  const iconName = ORG_ICON_MAP[org.category] || 'business-outline';
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.orgCard, shadow.card, { transform: [{ scale: pressed ? 0.97 : 1 }] }]}
    >
      <View style={[styles.orgCardIcon, { backgroundColor: catColor + '20' }]}>
        <Ionicons name={iconName as any} size={22} color={catColor} />
      </View>
      <Text style={styles.orgCardName} numberOfLines={2}>{org.name}</Text>
      <View style={[styles.orgCardBadge, { backgroundColor: catColor + '18' }]}>
        <Text style={[styles.orgCardBadgeText, { color: catColor }]}>{org.category}</Text>
      </View>
    </Pressable>
  );
}

function WorkerCard({ worker, onPress }: { worker: any; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.workerCard, shadow.card, { transform: [{ scale: pressed ? 0.97 : 1 }] }]}
    >
      <Avatar size={52} name={worker.name} imageSource={worker.portraitPath} backgroundColor={worker.avatarColor} />
      <View style={styles.workerCardInfo}>
        <Text style={styles.workerCardName} numberOfLines={1}>{worker.name}</Text>
        <Text style={styles.workerCardRoles} numberOfLines={1}>{worker.roles.join(', ')}</Text>
        <StarRating rating={worker.rating} size={11} />
      </View>
      <Text style={styles.workerCardGigs}>{worker.gigs} gigs</Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { events, workers } = useApp();
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const { totalUnread } = useChat();
  const [searchQuery, setSearchQuery] = useState('');
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const tonightEvents = events.filter(e => e.isTonight);
  const recommendedEvents = events.filter(e => e.isRecommended);
  const topWorkers = workers.filter(w => w.isTopRated).slice(0, 5);
  const firstName = user?.name.split(' ')[0] || 'there';

  const filtered = searchQuery
    ? events.filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.eventType.toLowerCase().includes(searchQuery.toLowerCase()))
    : null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: topPad + 12, paddingBottom: Platform.OS === 'web' ? 84 : 100 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Top bar */}
      <View style={styles.topBar}>
        <SearchBar placeholder="Search gigs, events..." value={searchQuery} onChangeText={setSearchQuery} />
        <Pressable
          onPress={() => router.push('/notifications')}
          style={[styles.iconBtn, shadow.card]}
        >
          <Ionicons name="notifications-outline" size={22} color={colors.textSecondary} />
          {unreadCount > 0 && (
            <View style={styles.notifDot}>
              <Text style={styles.notifDotText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
            </View>
          )}
        </Pressable>
        <Pressable
          onPress={() => router.push('/messages')}
          style={[styles.iconBtn, shadow.card]}
        >
          <Feather name="message-circle" size={22} color={colors.textSecondary} />
          {totalUnread > 0 && (
            <View style={styles.notifDot}>
              <Text style={styles.notifDotText}>{totalUnread > 9 ? '9+' : totalUnread}</Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* Greeting */}
      <View style={styles.greetingRow}>
        <View>
          <Text style={styles.greeting}>Hey, {firstName} 👋</Text>
          <View style={styles.locationChip}>
            <Ionicons name="location-outline" size={13} color={colors.accentPrimary} />
            <Text style={styles.locationText}>NYU Area · Manhattan</Text>
          </View>
        </View>
        {user && (
          <Pressable onPress={() => router.push('/(tabs)/profile')}>
            <Avatar size={44} name={user.name} imageSource={'portraitPath' in user ? (user as any).portraitPath : null} backgroundColor={user.avatarColor} />
          </Pressable>
        )}
      </View>

      {/* Search results */}
      {filtered && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</Text>
          {filtered.map(event => (
            <RecommendedCard key={event.id} event={event} onPress={() => router.push(`/event/${event.id}`)} />
          ))}
          {filtered.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No events match "{searchQuery}"</Text>
            </View>
          )}
        </View>
      )}

      {!filtered && (
        <>
          {/* Tonight */}
          {tonightEvents.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Tonight Near You</Text>
                <Pressable onPress={() => router.push('/(tabs)/gigs')}>
                  <Text style={styles.seeAll}>See all</Text>
                </Pressable>
              </View>
              {tonightEvents.map(event => (
                <EventHeroCard key={event.id} event={event} onPress={() => router.push(`/event/${event.id}`)} />
              ))}
            </View>
          )}

          {/* Top Workers */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Top Crew in Your Area</Text>
              <Pressable onPress={() => router.push('/(tabs)/gigs')}>
                <Text style={styles.seeAll}>Browse all</Text>
              </Pressable>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.workerScroll}>
              {topWorkers.map(w => (
                <WorkerCard key={w.id} worker={w} onPress={() => router.push(`/candidate/${w.id}`)} />
              ))}
            </ScrollView>
          </View>

          {/* Organizations */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Organizations</Text>
              <Pressable onPress={() => router.push('/organizations')}>
                <Text style={styles.seeAll}>See all</Text>
              </Pressable>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.orgScroll}>
              {mockOrganizations.slice(0, 8).map(org => (
                <OrgCard key={org.id} org={org} onPress={() => router.push(`/organizations/${org.id}`)} />
              ))}
            </ScrollView>
          </View>

          {/* Recommended Events */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recommended For You</Text>
              <Pressable onPress={() => router.push('/(tabs)/gigs')}>
                <Text style={styles.seeAll}>See all</Text>
              </Pressable>
            </View>
            {recommendedEvents.slice(0, 4).map(event => (
              <RecommendedCard key={event.id} event={event} onPress={() => router.push(`/event/${event.id}`)} />
            ))}
          </View>

          {/* Community Feed Banner */}
          <Pressable
            onPress={() => router.push('/(tabs)/discussions')}
            style={({ pressed }) => [styles.feedBanner, shadow.card, { opacity: pressed ? 0.9 : 1 }]}
          >
            <LinearGradient colors={[colors.accentLavender + '40', colors.accentLavender + '15']} style={StyleSheet.absoluteFill} />
            <View style={styles.feedBannerLeft}>
              <View style={styles.feedBannerIcon}>
                <Ionicons name="chatbubbles" size={22} color={colors.accentLavender} />
              </View>
              <View>
                <Text style={styles.feedBannerTitle}>Community Feed</Text>
                <Text style={styles.feedBannerSub}>See what NYC crew is talking about</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundPrimary },
  content: { paddingHorizontal: spacing.md, gap: 0 },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surfaceCard, alignItems: 'center', justifyContent: 'center' },
  notifDot: { position: 'absolute', top: 8, right: 8, width: 16, height: 16, borderRadius: 8, backgroundColor: colors.accentPrimary, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.backgroundPrimary },
  notifDotText: { fontSize: 8, fontFamily: 'Inter_700Bold', color: '#fff' },
  greetingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg },
  greeting: { fontSize: 24, fontFamily: 'Inter_700Bold', color: colors.textPrimary, marginBottom: 4 },
  locationChip: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { ...typography.bodyMedium, color: colors.textMuted, fontFamily: 'Inter_500Medium' },
  section: { marginBottom: spacing.xl, gap: spacing.sm },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { ...typography.sectionTitle, color: colors.textPrimary, fontFamily: 'Inter_700Bold' },
  seeAll: { ...typography.bodyMedium, color: colors.accentPrimary, fontFamily: 'Inter_600SemiBold' },
  // Hero Card
  heroCard: { borderRadius: radius.card, overflow: 'hidden', height: 220, justifyContent: 'flex-end' },
  heroCardImage: { ...StyleSheet.absoluteFillObject },
  tonightChip: { position: 'absolute', top: 16, right: 16, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.accentPrimary, borderRadius: radius.chip, paddingHorizontal: 10, paddingVertical: 5 },
  tonightChipText: { fontSize: 11, fontFamily: 'Inter_700Bold', color: '#fff', letterSpacing: 0.5 },
  heroCardContent: { padding: spacing.md, gap: 3 },
  heroCardTitle: { fontSize: 22, fontFamily: 'Inter_700Bold', color: '#fff' },
  heroCardOrg: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter_500Medium' },
  heroCardMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 4 },
  heroMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  heroMetaText: { fontSize: 12, color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter_400Regular' },
  openRolesBadge: { marginLeft: 'auto', backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: radius.chip, paddingHorizontal: 8, paddingVertical: 3 },
  openRolesText: { fontSize: 11, fontFamily: 'Inter_700Bold', color: '#fff' },
  // Recommended Card
  recCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surfaceCard, borderRadius: radius.card, padding: spacing.md },
  recCardLeft: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  recCardInfo: { flex: 1, gap: 3 },
  recCardTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: colors.textPrimary },
  recCardOrg: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
  recCardMeta: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  recCardMetaText: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
  recCardRight: { alignItems: 'flex-end', gap: 1 },
  recCardPay: { fontSize: 18, fontFamily: 'Inter_700Bold', color: colors.accentPrimary },
  recCardPayLabel: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
  // Org Card
  orgScroll: { gap: spacing.sm, paddingRight: spacing.sm },
  orgCard: { backgroundColor: colors.surfaceCard, borderRadius: radius.card, padding: spacing.md, alignItems: 'center', gap: spacing.xs, width: 140 },
  orgCardIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  orgCardName: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: colors.textPrimary, textAlign: 'center', lineHeight: 17 },
  orgCardBadge: { borderRadius: radius.chip, paddingHorizontal: 8, paddingVertical: 2, marginTop: 2 },
  orgCardBadgeText: { fontSize: 10, fontFamily: 'Inter_500Medium' },
  // Worker Card
  workerScroll: { gap: spacing.sm, paddingRight: spacing.sm },
  workerCard: { backgroundColor: colors.surfaceCard, borderRadius: radius.card, padding: spacing.md, alignItems: 'center', gap: spacing.xs, width: 130 },
  workerCardInfo: { alignItems: 'center', gap: 2, width: '100%' },
  workerCardName: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: colors.textPrimary, textAlign: 'center' },
  workerCardRoles: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  workerCardGigs: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
  // Community banner
  feedBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surfaceCard, borderRadius: radius.card, padding: spacing.md, marginBottom: spacing.xl, overflow: 'hidden' },
  feedBannerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  feedBannerIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.accentLavender + '30', alignItems: 'center', justifyContent: 'center' },
  feedBannerTitle: { ...typography.bodyMedium, color: colors.textPrimary, fontFamily: 'Inter_600SemiBold' },
  feedBannerSub: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
  // Empty
  emptyState: { alignItems: 'center', paddingVertical: spacing.xl },
  emptyText: { ...typography.body, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
});
