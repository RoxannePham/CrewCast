import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, Pressable,
  Platform, ScrollView, Alert, Image
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, radius, shadow } from '@/constants/theme';
import { Chip } from '@/components/ui/Chip';
import { SearchBar } from '@/components/ui/SearchBar';
import { useApp } from '@/context/AppContext';
import { MockEvent } from '@/data/mockEvents';
import { mockWorkers } from '@/data/mockUsers';

const EVENT_TYPE_FILTERS = ['All', 'Tonight', 'This Week', 'High Pay', 'Near You'];
const SORT_OPTIONS = ['Newest', 'Highest Pay', 'Closest', 'Most Roles'];

const CREW_AVATAR_SIZE = 26;
const CREW_OVERLAP = -7;
const MAX_CREW_SHOWN = 3;

function CrewAvatarStack({ crewIds }: { crewIds: string[] }) {
  if (crewIds.length === 0) return null;
  const shown = crewIds.slice(0, MAX_CREW_SHOWN);
  const remaining = crewIds.length - shown.length;
  return (
    <View style={styles.crewStack}>
      {shown.map((wId, i) => {
        const worker = mockWorkers.find(w => w.id === wId);
        if (!worker) return null;
        return (
          <View key={wId} style={[styles.crewAvatarWrapper, { marginLeft: i > 0 ? CREW_OVERLAP : 0, zIndex: MAX_CREW_SHOWN - i }]}>
            {worker.portraitPath ? (
              <Image source={worker.portraitPath} style={styles.crewAvatarImg} />
            ) : (
              <View style={[styles.crewAvatarFallback, { backgroundColor: worker.avatarColor }]}>
                <Text style={styles.crewAvatarInitial}>{worker.name.charAt(0)}</Text>
              </View>
            )}
          </View>
        );
      })}
      {remaining > 0 && (
        <View style={[styles.crewAvatarWrapper, styles.crewAvatarMore, { marginLeft: CREW_OVERLAP, zIndex: 0 }]}>
          <Text style={styles.crewMoreText}>+{remaining}</Text>
        </View>
      )}
    </View>
  );
}

function EventCard({ event, onPress }: { event: MockEvent; onPress: () => void }) {
  const openRoles = event.roles.filter(r => r.filledSlots < r.slots).length;
  const minPay = Math.min(...event.roles.map(r => r.pay));
  const maxPay = Math.max(...event.roles.map(r => r.pay));
  const payText = minPay === maxPay ? `$${minPay}` : `$${minPay}–$${maxPay}`;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.eventCard, shadow.cardHeavy, { transform: [{ scale: pressed ? 0.98 : 1 }] }]}
    >
      {event.coverImagePath ? (
        <Image source={event.coverImagePath} style={styles.eventCardImage} resizeMode="cover" />
      ) : (
        <LinearGradient colors={[event.themeColor + 'DD', event.themeColor + '55']} style={styles.eventCardImage} />
      )}
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={StyleSheet.absoluteFill} />

      {event.isTonight && (
        <View style={styles.tonightChip}>
          <Ionicons name="flash" size={11} color="#fff" />
          <Text style={styles.tonightChipText}>TONIGHT</Text>
        </View>
      )}

      {event.confirmedCrewIds.length > 0 && (
        <View style={styles.crewChipContainer}>
          <CrewAvatarStack crewIds={event.confirmedCrewIds} />
        </View>
      )}

      <View style={styles.eventCardContent}>
        <View style={styles.eventCardTitleRow}>
          <View style={styles.eventCardTitleBlock}>
            <Text style={styles.eventCardTitle}>{event.title}</Text>
            <Text style={styles.eventCardOrg}>{event.orgName}</Text>
          </View>
          <View style={styles.eventCardPayBubble}>
            <Text style={styles.eventCardPayText}>{payText}</Text>
          </View>
        </View>
        <View style={styles.eventCardMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={12} color="rgba(255,255,255,0.8)" />
            <Text style={styles.metaText}>{event.distance}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={12} color="rgba(255,255,255,0.8)" />
            <Text style={styles.metaText}>{event.time}</Text>
          </View>
          <View style={styles.openRolesBadge}>
            <Text style={styles.openRolesText}>{openRoles} open role{openRoles !== 1 ? 's' : ''}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function GigsScreen() {
  const insets = useSafeAreaInsets();
  const { events } = useApp();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Newest');
  const [showSort, setShowSort] = useState(false);
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const filtered = useMemo(() => {
    let result = [...events];
    if (activeFilter === 'Tonight') {
      result = result.filter(e => e.isTonight);
    } else if (activeFilter === 'This Week') {
      const now = new Date();
      const weekEnd = new Date(now);
      weekEnd.setDate(weekEnd.getDate() + 7);
      result = result.filter(e => {
        const eventDate = new Date(e.date + ' 2026');
        return eventDate >= now && eventDate <= weekEnd;
      });
    } else if (activeFilter === 'High Pay') {
      result = result.filter(e => Math.max(...e.roles.map(r => r.pay)) >= 200);
    } else if (activeFilter === 'Near You') {
      result = result.filter(e => {
        const d = parseFloat(e.distance);
        return !isNaN(d) && d <= 1.0;
      });
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.orgName.toLowerCase().includes(q) ||
        e.eventType.toLowerCase().includes(q) ||
        e.roles.some(r => r.roleType.toLowerCase().includes(q))
      );
    }
    if (sortBy === 'Highest Pay') result.sort((a, b) => Math.max(...b.roles.map(r => r.pay)) - Math.max(...a.roles.map(r => r.pay)));
    else if (sortBy === 'Closest') result.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    else if (sortBy === 'Most Roles') result.sort((a, b) => b.roles.length - a.roles.length);
    return result;
  }, [events, activeFilter, searchQuery, sortBy]);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Events</Text>
          <Pressable
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setShowSort(s => !s); }}
            style={[styles.sortBtn, shadow.card]}
          >
            <Ionicons name="swap-vertical-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.sortBtnText}>{sortBy}</Text>
          </Pressable>
        </View>
        <Text style={styles.subtitle}>{filtered.length} event{filtered.length !== 1 ? 's' : ''} near you</Text>

        {showSort && (
          <View style={[styles.sortDropdown, shadow.cardHeavy]}>
            {SORT_OPTIONS.map(opt => (
              <Pressable key={opt} onPress={() => { setSortBy(opt); setShowSort(false); }} style={[styles.sortOption, sortBy === opt && styles.sortOptionActive]}>
                <Text style={[styles.sortOptionText, sortBy === opt && styles.sortOptionTextActive]}>{opt}</Text>
                {sortBy === opt && <Ionicons name="checkmark" size={16} color={colors.accentPrimary} />}
              </Pressable>
            ))}
          </View>
        )}

        <SearchBar
          placeholder="Search events, roles, orgs..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filtersContent}
        >
          {EVENT_TYPE_FILTERS.map(filter => (
            <Chip
              key={filter}
              label={filter}
              selected={activeFilter === filter}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setActiveFilter(filter);
              }}
              variant={activeFilter === filter ? 'pink' : 'default'}
            />
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onPress={() => router.push(`/event/${item.id}`)}
          />
        )}
        contentContainerStyle={[styles.list, { paddingBottom: Platform.OS === 'web' ? 84 : 100 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No events found</Text>
            <Text style={styles.emptySubtitle}>Try a different filter or search term</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundPrimary },
  header: { paddingHorizontal: spacing.md, gap: spacing.sm, paddingBottom: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 28, fontFamily: 'Inter_700Bold', color: colors.textPrimary },
  subtitle: { ...typography.body, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
  sortBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.surfaceCard, borderRadius: radius.chip, paddingHorizontal: 12, paddingVertical: 7 },
  sortBtnText: { ...typography.meta, color: colors.textSecondary, fontFamily: 'Inter_500Medium' },
  sortDropdown: { position: 'absolute', top: 80, right: spacing.md, backgroundColor: colors.surfaceCard, borderRadius: radius.small, zIndex: 999, overflow: 'hidden' },
  sortOption: { paddingHorizontal: spacing.md, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minWidth: 160 },
  sortOptionActive: { backgroundColor: colors.accentPrimary + '10' },
  sortOptionText: { ...typography.body, color: colors.textPrimary, fontFamily: 'Inter_500Medium' },
  sortOptionTextActive: { color: colors.accentPrimary, fontFamily: 'Inter_600SemiBold' },
  filtersScroll: { marginTop: 2 },
  filtersContent: { gap: 8, paddingBottom: 4 },
  list: { paddingHorizontal: spacing.md, paddingTop: spacing.sm, gap: spacing.md },

  eventCard: { borderRadius: radius.card, overflow: 'hidden', aspectRatio: 1.55, justifyContent: 'flex-end' },
  eventCardImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  tonightChip: { position: 'absolute', top: 16, right: 16, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.accentPrimary, borderRadius: radius.chip, paddingHorizontal: 10, paddingVertical: 5 },
  tonightChipText: { fontSize: 11, fontFamily: 'Inter_700Bold', color: '#fff', letterSpacing: 0.5 },
  crewChipContainer: { position: 'absolute', top: 16, left: 16 },
  crewStack: { flexDirection: 'row', alignItems: 'center' },
  crewAvatarWrapper: { width: CREW_AVATAR_SIZE, height: CREW_AVATAR_SIZE, borderRadius: CREW_AVATAR_SIZE / 2, borderWidth: 2, borderColor: 'rgba(255,255,255,0.9)', overflow: 'hidden' },
  crewAvatarImg: { width: '100%', height: '100%', borderRadius: CREW_AVATAR_SIZE / 2 },
  crewAvatarFallback: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  crewAvatarInitial: { fontSize: 10, fontFamily: 'Inter_700Bold', color: '#fff' },
  crewAvatarMore: { backgroundColor: colors.accentLavender, alignItems: 'center', justifyContent: 'center' },
  crewMoreText: { fontSize: 9, fontFamily: 'Inter_700Bold', color: '#fff' },

  eventCardContent: { padding: spacing.md, gap: 4 },
  eventCardTitleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 },
  eventCardTitleBlock: { flex: 1 },
  eventCardTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', color: '#fff' },
  eventCardOrg: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter_500Medium' },
  eventCardPayBubble: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: radius.chip, paddingHorizontal: 10, paddingVertical: 4, marginTop: 2 },
  eventCardPayText: { fontSize: 13, fontFamily: 'Inter_700Bold', color: '#fff' },
  eventCardMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 2 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { fontSize: 12, color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter_400Regular' },
  openRolesBadge: { marginLeft: 'auto', backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: radius.chip, paddingHorizontal: 8, paddingVertical: 3 },
  openRolesText: { fontSize: 11, fontFamily: 'Inter_700Bold', color: '#fff' },

  emptyState: { alignItems: 'center', paddingVertical: 80, gap: spacing.md },
  emptyTitle: { ...typography.sectionTitle, color: colors.textSecondary, fontFamily: 'Inter_600SemiBold' },
  emptySubtitle: { ...typography.body, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
});
