import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '@/constants/theme';
import { CandidateCard } from '@/components/cards/CandidateCard';
import { Chip } from '@/components/ui/Chip';
import { useApp } from '@/context/AppContext';

const ROLE_FILTERS = ['All', 'DJ', 'Photographer', 'Videographer', 'Host'];

export default function CrewScreen() {
  const insets = useSafeAreaInsets();
  const { crew, bookedCrew, bookCrew } = useApp();
  const [activeRole, setActiveRole] = useState('All');

  const topPadding = Platform.OS === 'web' ? 67 : insets.top;

  const filtered = activeRole === 'All'
    ? crew
    : crew.filter(m => m.role.includes(activeRole));

  const [featured, ...rest] = filtered;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topPadding + 12 }]}>
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.title}>Candidates for DJ</Text>
            <Text style={styles.subtitle}>Greek Week Afterparty</Text>
            <Text style={styles.subtitleMeta}>April 20 • 9PM – 1AM</Text>
          </View>
          <Pressable style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filtersContent}
        >
          {ROLE_FILTERS.map(f => (
            <Chip
              key={f}
              label={f}
              selected={activeRole === f}
              onPress={() => setActiveRole(f)}
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
        {featured && (
          <CandidateCard
            member={featured}
            onBook={() => bookCrew(featured.id)}
            booked={bookedCrew.has(featured.id)}
            featured
          />
        )}
        {rest.map(member => (
          <CandidateCard
            key={member.id}
            member={member}
            onBook={() => bookCrew(member.id)}
            booked={bookedCrew.has(member.id)}
          />
        ))}
        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="people-outline" size={40} color={colors.textMuted} />
            <Text style={styles.emptyText}>No candidates found</Text>
          </View>
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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
  },
  subtitle: {
    ...typography.cardTitle,
    color: colors.textSecondary,
    fontFamily: 'Inter_500Medium',
    marginTop: 2,
  },
  subtitleMeta: {
    ...typography.meta,
    color: colors.textMuted,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceCard,
    alignItems: 'center',
    justifyContent: 'center',
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
});
