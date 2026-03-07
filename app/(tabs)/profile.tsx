import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadow } from '@/constants/theme';
import { Avatar } from '@/components/ui/Avatar';
import { StarRating } from '@/components/ui/StarRating';
import { Chip } from '@/components/ui/Chip';
import { Badge } from '@/components/ui/Badge';

const PORTFOLIO_COLORS = [
  colors.accentLavender,
  colors.accentPrimary + '80',
  colors.accentMint,
  colors.accentPeach,
];

const SKILLS = ['House', 'EDM', 'Hip-Hop', 'Latin', 'Techno', 'Deep House'];

const REVIEWS = [
  {
    id: '1',
    author: 'Jordan W.',
    rating: 5,
    text: 'Alex absolutely killed it at our party. Everyone was dancing all night!',
    date: 'Mar 2026',
    avatarColor: colors.accentMint,
  },
  {
    id: '2',
    author: 'Taylor S.',
    rating: 5,
    text: 'Super professional, arrived early, read the crowd perfectly.',
    date: 'Feb 2026',
    avatarColor: colors.accentBlue,
  },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingBottom: Platform.OS === 'web' ? 84 : 100 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.headerArea, { paddingTop: topPadding + 12 }]}>
        <View style={styles.headerActions}>
          <Pressable style={styles.iconBtn}>
            <Feather name="settings" size={20} color={colors.textSecondary} />
          </Pressable>
          <Pressable style={styles.iconBtn}>
            <Feather name="share-2" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        <View style={styles.avatarSection}>
          <Avatar name="Alex Kim" avatarColor={colors.accentLavender} size={84} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Alex Kim</Text>
            <Text style={styles.profileRole}>DJ • Creator</Text>
            <View style={styles.ratingRow}>
              <StarRating rating={4.9} size={15} />
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          {[
            { label: 'Gigs', value: '23' },
            { label: 'Reliability', value: '97%' },
            { label: 'On Time', value: '98%' },
            { label: 'Reviews', value: '18' },
          ].map(stat => (
            <View key={stat.label} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <LinearGradient
          colors={[colors.accentPrimary + '20', colors.accentLavender + '20']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.reliabilityCard}
        >
          <View style={styles.reliabilityHeader}>
            <MaterialCommunityIcons name="shield-check" size={22} color={colors.accentPrimary} />
            <Text style={styles.reliabilityTitle}>Reliability Score</Text>
          </View>
          <Text style={styles.reliabilityScore}>4.8</Text>
          <View style={styles.reliabilityMeta}>
            <View style={styles.reliabilityItem}>
              <Ionicons name="time-outline" size={14} color={colors.textMuted} />
              <Text style={styles.reliabilityMetaText}>98% on time</Text>
            </View>
            <View style={styles.reliabilityItem}>
              <Feather name="check-circle" size={14} color={colors.textMuted} />
              <Text style={styles.reliabilityMetaText}>17 gigs completed</Text>
            </View>
          </View>
          <View style={styles.badgesRow}>
            <Badge label="Top Rated" type="toprated" />
            <Badge label="On Time" type="ontime" />
            <Badge label="Campus Verified" type="campusverified" />
          </View>
        </LinearGradient>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skills</Text>
        <View style={styles.skillsWrap}>
          {SKILLS.map(skill => (
            <Chip key={skill} label={skill} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Portfolio</Text>
          <Pressable>
            <Feather name="plus" size={20} color={colors.accentPrimary} />
          </Pressable>
        </View>
        <View style={styles.portfolioGrid}>
          {PORTFOLIO_COLORS.map((color, i) => (
            <View key={i} style={[styles.portfolioItem, { backgroundColor: color }]}>
              <Ionicons name="musical-notes" size={24} color="rgba(255,255,255,0.6)" />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reviews</Text>
        {REVIEWS.map(review => (
          <View key={review.id} style={[styles.reviewCard, shadow.card]}>
            <View style={styles.reviewHeader}>
              <Avatar name={review.author} avatarColor={review.avatarColor} size={36} />
              <View style={styles.reviewInfo}>
                <Text style={styles.reviewAuthor}>{review.author}</Text>
                <StarRating rating={review.rating} size={12} showNumber={false} />
              </View>
              <Text style={styles.reviewDate}>{review.date}</Text>
            </View>
            <Text style={styles.reviewText}>{review.text}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  content: {
    gap: 0,
  },
  headerArea: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.backgroundPrimary,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceCard,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  profileInfo: {
    gap: 4,
  },
  profileName: {
    ...typography.eventTitle,
    color: colors.textPrimary,
    fontFamily: 'Inter_700Bold',
    fontSize: 26,
  },
  profileRole: {
    ...typography.body,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
  },
  ratingRow: {
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.card,
    padding: spacing.md,
    ...shadow.card,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    ...typography.cardTitle,
    color: colors.textPrimary,
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
  },
  statLabel: {
    ...typography.meta,
    color: colors.textMuted,
    fontFamily: 'Inter_400Regular',
  },
  section: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
    fontFamily: 'Inter_700Bold',
  },
  reliabilityCard: {
    borderRadius: radius.card,
    padding: spacing.md,
    gap: spacing.sm,
  },
  reliabilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  reliabilityTitle: {
    ...typography.cardTitle,
    color: colors.textPrimary,
    fontFamily: 'Inter_600SemiBold',
  },
  reliabilityScore: {
    fontSize: 48,
    fontFamily: 'Inter_700Bold',
    color: colors.accentPrimary,
    lineHeight: 56,
  },
  reliabilityMeta: {
    gap: 6,
  },
  reliabilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reliabilityMetaText: {
    ...typography.body,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  skillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  portfolioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  portfolioItem: {
    width: '47%',
    height: 100,
    borderRadius: radius.small,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.card,
    padding: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  reviewInfo: {
    flex: 1,
    gap: 2,
  },
  reviewAuthor: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontFamily: 'Inter_600SemiBold',
  },
  reviewDate: {
    ...typography.meta,
    color: colors.textMuted,
    fontFamily: 'Inter_400Regular',
  },
  reviewText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 20,
    fontFamily: 'Inter_400Regular',
  },
});
