import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '@/constants/theme';
import { Chip } from '@/components/ui/Chip';
import { GigCard } from '@/components/cards/GigCard';
import { useApp } from '@/context/AppContext';

const FILTERS = ['All', 'DJ', 'Photographer', 'Videographer', 'Host', 'Creator'];

export default function GigsScreen() {
  const insets = useSafeAreaInsets();
  const { gigs, appliedGigs, applyToGig } = useApp();
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All'
    ? gigs
    : gigs.filter(g => g.roleType.includes(activeFilter));

  const topPadding = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <View style={[styles.container]}>
      <View style={[styles.header, { paddingTop: topPadding + 12 }]}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Gigs</Text>
          <Pressable style={styles.filterBtn}>
            <Ionicons name="options-outline" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>
        <Text style={styles.subtitle}>{filtered.length} roles available near you</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filtersContent}
        >
          {FILTERS.map(filter => (
            <Chip
              key={filter}
              label={filter}
              selected={activeFilter === filter}
              onPress={() => setActiveFilter(filter)}
              style={{ marginRight: 6 }}
            />
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={[styles.listContent, { paddingBottom: Platform.OS === 'web' ? 84 : 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="briefcase-outline" size={40} color={colors.textMuted} />
            <Text style={styles.emptyText}>No gigs found</Text>
            <Text style={styles.emptySubtext}>Try a different filter or check back later</Text>
          </View>
        ) : (
          filtered.map(gig => (
            <GigCard
              key={gig.id}
              gig={gig}
              onApply={() => applyToGig(gig.id)}
              applied={appliedGigs.has(gig.id)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.backgroundPrimary,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    ...typography.eventTitle,
    color: colors.textPrimary,
    fontFamily: 'Inter_700Bold',
  },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: spacing.md,
    fontFamily: 'Inter_400Regular',
  },
  filtersScroll: {
    marginHorizontal: -spacing.md,
  },
  filtersContent: {
    paddingHorizontal: spacing.md,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    gap: 0,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: spacing.sm,
  },
  emptyText: {
    ...typography.sectionTitle,
    color: colors.textSecondary,
    fontFamily: 'Inter_600SemiBold',
  },
  emptySubtext: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
});
