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
import { Ionicons, Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, typography, spacing, radius, shadow } from '@/constants/theme';
import { SearchBar } from '@/components/ui/SearchBar';
import { EventHeroCard } from '@/components/cards/EventHeroCard';
import { RecommendedCard } from '@/components/cards/RecommendedCard';
import { CrewCard } from '@/components/cards/CrewCard';
import { useApp } from '@/context/AppContext';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { events, confirmedCrew, appliedGigs, applyToGig, location } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const tonightEvents = events.filter(e => e.type === 'tonight');
  const recommendedEvents = events.filter(e => e.type === 'recommended');

  const topPadding = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <ScrollView
      style={[styles.container]}
      contentContainerStyle={[styles.content, { paddingTop: topPadding + 12, paddingBottom: Platform.OS === 'web' ? 84 : 100 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topBar}>
        <SearchBar
          placeholder="Search gigs..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Pressable style={styles.notifButton}>
          <Ionicons name="notifications-outline" size={22} color={colors.textSecondary} />
        </Pressable>
      </View>

      <View style={styles.locationRow}>
        <View style={styles.locationChip}>
          <Ionicons name="location-outline" size={14} color={colors.accentPrimary} />
          <Text style={styles.locationText}>{location}</Text>
        </View>
        <View style={styles.actionIcons}>
          <Pressable style={styles.iconBtn}>
            <Feather name="mail" size={18} color={colors.textSecondary} />
          </Pressable>
          <Pressable style={styles.iconBtn}>
            <Feather name="clock" size={18} color={colors.textSecondary} />
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tonight Near You</Text>
        {tonightEvents.map(event => (
          <EventHeroCard
            key={event.id}
            event={event}
            onApply={() => applyToGig(event.id)}
            applied={appliedGigs.has(event.id)}
          />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommended For You</Text>
        {recommendedEvents.map(event => (
          <RecommendedCard
            key={event.id}
            event={event}
            onApply={() => applyToGig(event.id)}
            applied={appliedGigs.has(event.id)}
          />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Confirmed Crew</Text>
        {confirmedCrew.map(member => (
          <CrewCard key={member.id} member={member} />
        ))}
      </View>

      <Pressable
        style={({ pressed }) => [styles.feedBanner, { opacity: pressed ? 0.85 : 1 }]}
        onPress={() => router.push('/(tabs)/discussions')}
      >
        <View style={styles.feedBannerLeft}>
          <Ionicons name="chatbubbles" size={22} color={colors.accentLavender} />
          <View>
            <Text style={styles.feedBannerTitle}>Community Feed</Text>
            <Text style={styles.feedBannerSub}>See what's happening nearby</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  content: {
    paddingHorizontal: spacing.md,
    gap: 0,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  notifButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceCard,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.surfaceCard,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.chip,
    ...shadow.card,
  },
  locationText: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontFamily: 'Inter_600SemiBold',
  },
  actionIcons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceCard,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  section: {
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },
  feedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.card,
    padding: spacing.md,
    marginBottom: spacing.xl,
    ...shadow.card,
  },
  feedBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  feedBannerTitle: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontFamily: 'Inter_600SemiBold',
  },
  feedBannerSub: {
    ...typography.meta,
    color: colors.textMuted,
    fontFamily: 'Inter_400Regular',
  },
});
