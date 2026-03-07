import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, Pressable,
  Platform, ScrollView, Alert
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
import { EventRole, MockEvent } from '@/data/mockEvents';

const ROLE_FILTERS = ['All', 'DJ', 'Photographer', 'Videographer', 'Host/MC', 'Content Creator', 'Bartender', 'Security'];
const SORT_OPTIONS = ['Newest', 'Highest Pay', 'Closest', 'Most Applied'];

type GigRoleItem = EventRole & { event: MockEvent };

function GigCard({ item, applied, onApply, onViewEvent }: { item: GigRoleItem; applied: boolean; onApply: () => void; onViewEvent: () => void }) {
  const filled = item.filledSlots >= item.slots;
  return (
    <Pressable
      onPress={onViewEvent}
      style={({ pressed }) => [styles.gigCard, shadow.card, { transform: [{ scale: pressed ? 0.98 : 1 }] }]}
    >
      <View style={styles.gigCardTop}>
        <View style={[styles.roleIconCircle, { backgroundColor: colors.accentPrimary + '15' }]}>
          <Ionicons name="musical-notes-outline" size={20} color={colors.accentPrimary} />
        </View>
        <View style={styles.gigCardInfo}>
          <Text style={styles.gigCardRole}>{item.roleType}</Text>
          <Text style={styles.gigCardEvent} numberOfLines={1}>{item.event.title}</Text>
          <Text style={styles.gigCardOrg} numberOfLines={1}>{item.event.orgName}</Text>
        </View>
        <View style={styles.gigCardPayArea}>
          <Text style={styles.gigCardPay}>${item.pay}</Text>
          <Text style={styles.gigCardPayLabel}>flat</Text>
        </View>
      </View>

      <View style={styles.gigCardMeta}>
        <View style={styles.gigMetaItem}>
          <Ionicons name="calendar-outline" size={13} color={colors.textMuted} />
          <Text style={styles.gigMetaText}>{item.event.date}</Text>
        </View>
        <View style={styles.gigMetaItem}>
          <Ionicons name="time-outline" size={13} color={colors.textMuted} />
          <Text style={styles.gigMetaText}>{item.shiftStart} – {item.shiftEnd}</Text>
        </View>
        <View style={styles.gigMetaItem}>
          <Ionicons name="location-outline" size={13} color={colors.textMuted} />
          <Text style={styles.gigMetaText}>{item.event.distance}</Text>
        </View>
      </View>

      <View style={styles.gigCardTags}>
        {item.tags.slice(0, 3).map(tag => <Chip key={tag} label={tag} variant="default" />)}
        <View style={styles.slotsChip}>
          <Text style={styles.slotsText}>{item.slots - item.filledSlots} left</Text>
        </View>
      </View>

      <Pressable
        onPress={(e) => {
          e.stopPropagation?.();
          if (!applied && !filled) {
            onApply();
          }
        }}
        style={({ pressed }) => [
          styles.applyBtn,
          applied && styles.applyBtnApplied,
          filled && styles.applyBtnFilled,
          { transform: [{ scale: pressed ? 0.97 : 1 }] }
        ]}
      >
        {!applied && !filled ? (
          <LinearGradient colors={['#FF8F9B', '#FF5E73']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.applyBtnGrad}>
            <Text style={styles.applyBtnText}>Quick Apply</Text>
          </LinearGradient>
        ) : (
          <Text style={styles.applyBtnTextDisabled}>
            {filled ? 'Role Filled' : applied ? 'Applied ✓' : ''}
          </Text>
        )}
      </Pressable>
    </Pressable>
  );
}

export default function GigsScreen() {
  const insets = useSafeAreaInsets();
  const { getAllGigRoles, appliedRoles, applyToRole } = useApp();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Newest');
  const [showSort, setShowSort] = useState(false);
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const allRoles = getAllGigRoles();

  const filtered = useMemo(() => {
    let result = allRoles;
    if (activeFilter !== 'All') {
      result = result.filter(r => r.roleType === activeFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r =>
        r.roleType.toLowerCase().includes(q) ||
        r.event.title.toLowerCase().includes(q) ||
        r.event.orgName.toLowerCase().includes(q) ||
        r.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (sortBy === 'Highest Pay') result = [...result].sort((a, b) => b.pay - a.pay);
    return result;
  }, [allRoles, activeFilter, searchQuery, sortBy]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Gigs</Text>
          <Pressable
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setShowSort(s => !s); }}
            style={[styles.sortBtn, shadow.card]}
          >
            <Ionicons name="swap-vertical-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.sortBtnText}>{sortBy}</Text>
          </Pressable>
        </View>
        <Text style={styles.subtitle}>{filtered.length} role{filtered.length !== 1 ? 's' : ''} available near you</Text>

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
          placeholder="Search roles, skills, events..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filtersContent}
        >
          {ROLE_FILTERS.map(filter => (
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
          <GigCard
            item={item}
            applied={appliedRoles.has(item.id)}
            onApply={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              applyToRole(item.id, item.eventId);
              Alert.alert('Applied!', `You applied for ${item.roleType} at ${item.event.title}. Good luck!`);
            }}
            onViewEvent={() => router.push(`/event/${item.eventId}`)}
          />
        )}
        contentContainerStyle={[styles.list, { paddingBottom: Platform.OS === 'web' ? 84 : 100 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No gigs found</Text>
            <Text style={styles.emptySubtitle}>Try a different role or search term</Text>
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
  list: { paddingHorizontal: spacing.md, paddingTop: spacing.sm, gap: spacing.sm },
  gigCard: { backgroundColor: colors.surfaceCard, borderRadius: radius.card, padding: spacing.md, gap: spacing.sm },
  gigCardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  roleIconCircle: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  gigCardInfo: { flex: 1, gap: 2 },
  gigCardRole: { fontSize: 17, fontFamily: 'Inter_700Bold', color: colors.textPrimary },
  gigCardEvent: { ...typography.body, color: colors.textSecondary, fontFamily: 'Inter_500Medium' },
  gigCardOrg: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
  gigCardPayArea: { alignItems: 'flex-end' },
  gigCardPay: { fontSize: 22, fontFamily: 'Inter_700Bold', color: colors.accentPrimary },
  gigCardPayLabel: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
  gigCardMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  gigMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  gigMetaText: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
  gigCardTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center' },
  slotsChip: { paddingHorizontal: 10, paddingVertical: 4, backgroundColor: colors.accentMint + '40', borderRadius: radius.chip },
  slotsText: { fontSize: 11, fontFamily: 'Inter_600SemiBold', color: '#1A6635' },
  applyBtn: { borderRadius: radius.button, overflow: 'hidden' },
  applyBtnApplied: { backgroundColor: colors.accentMint + '40', paddingVertical: 10, alignItems: 'center', borderRadius: radius.button },
  applyBtnFilled: { backgroundColor: colors.borderSubtle, paddingVertical: 10, alignItems: 'center', borderRadius: radius.button },
  applyBtnGrad: { paddingVertical: 10, alignItems: 'center' },
  applyBtnText: { fontSize: 14, fontFamily: 'Inter_700Bold', color: '#fff' },
  applyBtnTextDisabled: { fontSize: 14, fontFamily: 'Inter_500Medium', color: colors.textMuted, paddingVertical: 10, textAlign: 'center' },
  emptyState: { alignItems: 'center', paddingVertical: 80, gap: spacing.md },
  emptyTitle: { ...typography.sectionTitle, color: colors.textSecondary, fontFamily: 'Inter_600SemiBold' },
  emptySubtitle: { ...typography.body, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
});
