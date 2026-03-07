import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, radius, shadow } from '@/constants/theme';
import { Avatar } from '@/components/ui/Avatar';
import { StarRating } from '@/components/ui/StarRating';
import { CrewMember } from '@/context/AppContext';

interface CrewCardProps {
  member: CrewMember;
  onPress?: () => void;
  compact?: boolean;
}

export function CrewCard({ member, onPress, compact }: CrewCardProps) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.card,
        shadow.card,
        { transform: [{ scale: pressed ? 0.97 : 1 }] }
      ]}
    >
      <View style={styles.content}>
        <Avatar name={member.name} avatarColor={member.avatarColor} size={compact ? 42 : 48} />
        <View style={styles.info}>
          <Text style={styles.name}>{member.name}</Text>
          <View style={styles.ratingRow}>
            <StarRating rating={member.rating} size={12} />
          </View>
          <Text style={styles.meta}>{member.gigs} gigs • {member.reliabilityScore}% reliability</Text>
        </View>
        <View style={styles.rightSide}>
          <View style={[styles.roleBadge, { backgroundColor: member.avatarColor + '50' }]}>
            <Text style={[styles.roleText, { color: colors.textSecondary }]}>{member.role}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.card,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  name: {
    ...typography.cardTitle,
    color: colors.textPrimary,
    fontFamily: 'Inter_600SemiBold',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  meta: {
    ...typography.meta,
    color: colors.textMuted,
    fontFamily: 'Inter_400Regular',
  },
  rightSide: {
    alignItems: 'flex-end',
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.chip,
  },
  roleText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
});
