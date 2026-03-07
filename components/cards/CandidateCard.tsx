import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadow } from '@/constants/theme';
import { Avatar } from '@/components/ui/Avatar';
import { StarRating } from '@/components/ui/StarRating';
import { Badge } from '@/components/ui/Badge';
import { Chip } from '@/components/ui/Chip';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { CrewMember } from '@/context/AppContext';

const { width } = Dimensions.get('window');

interface CandidateCardProps {
  member: CrewMember;
  onBook: () => void;
  booked?: boolean;
  featured?: boolean;
}

export function CandidateCard({ member, onBook, booked, featured }: CandidateCardProps) {
  if (featured) {
    return (
      <Pressable
        style={({ pressed }) => [styles.featuredCard, shadow.cardHeavy, { transform: [{ scale: pressed ? 0.98 : 1 }] }]}
        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
      >
        <View style={styles.featuredImageContainer}>
          <Avatar name={member.name} avatarColor={member.avatarColor} size={width - spacing.md * 2 - 32} />
          <LinearGradient
            colors={['transparent', 'rgba(30,10,10,0.6)', 'rgba(15,5,5,0.9)']}
            style={styles.featuredGradient}
          />
          <View style={styles.featuredOverlay}>
            <Text style={styles.featuredName}>{member.name}</Text>
            <StarRating rating={member.rating} size={16} />
          </View>
        </View>
        <View style={styles.featuredDetails}>
          <View style={styles.gigsRow}>
            <Ionicons name="flame" size={14} color={colors.accentPrimary} />
            <Text style={styles.gigsText}>{member.gigs} gigs</Text>
          </View>
          <View style={styles.badgesRow}>
            {member.isTopRated && <Badge label="Top Rated" type="toprated" />}
            {member.isOnTime && <Badge label="On Time" type="ontime" />}
            {member.isCampusVerified && <Badge label="Campus Verified" type="campusverified" />}
          </View>
          <PrimaryButton label={booked ? 'Booked!' : 'Book'} onPress={onBook} disabled={booked} />
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      style={({ pressed }) => [styles.card, shadow.card, { transform: [{ scale: pressed ? 0.97 : 1 }] }]}
      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
    >
      <Avatar name={member.name} avatarColor={member.avatarColor} size={52} />
      <View style={styles.cardInfo}>
        <Text style={styles.cardName}>{member.name}</Text>
        <Text style={styles.cardRole}>{member.role}</Text>
        <View style={styles.skillsRow}>
          {member.skills.slice(0, 2).map(s => (
            <Chip key={s} label={s} size="small" />
          ))}
        </View>
      </View>
      <View style={styles.cardRight}>
        {member.location && (
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={11} color={colors.textMuted} />
            <Text style={styles.locationText}>{member.location}</Text>
          </View>
        )}
        <PrimaryButton label={booked ? 'Booked' : 'Book'} onPress={onBook} size="small" disabled={booked} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  featuredCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.card,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  featuredImageContainer: {
    height: 280,
    backgroundColor: colors.backgroundSecondary,
  },
  featuredGradient: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: 120,
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
    right: spacing.md,
  },
  featuredName: {
    ...typography.eventTitle,
    color: colors.textInverse,
    marginBottom: 4,
    fontFamily: 'Inter_700Bold',
  },
  featuredDetails: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  gigsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  gigsText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    fontFamily: 'Inter_500Medium',
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  card: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.card,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  cardInfo: {
    flex: 1,
    gap: 4,
  },
  cardName: {
    ...typography.cardTitle,
    color: colors.textPrimary,
    fontFamily: 'Inter_600SemiBold',
  },
  cardRole: {
    ...typography.meta,
    color: colors.textMuted,
    fontFamily: 'Inter_400Regular',
  },
  skillsRow: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
  },
  cardRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  locationText: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: 'Inter_400Regular',
  },
});
