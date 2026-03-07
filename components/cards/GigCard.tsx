import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons, Feather } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadow } from '@/constants/theme';
import { Chip } from '@/components/ui/Chip';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { GigRole } from '@/context/AppContext';

interface GigCardProps {
  gig: GigRole;
  onApply: () => void;
  applied?: boolean;
}

export function GigCard({ gig, onApply, applied }: GigCardProps) {
  return (
    <Pressable
      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
      style={({ pressed }) => [
        styles.card,
        shadow.card,
        { transform: [{ scale: pressed ? 0.97 : 1 }] }
      ]}
    >
      <View style={styles.colorBar}>
        <LinearGradient
          colors={[gig.themeColor, gig.themeColor + '80']}
          style={StyleSheet.absoluteFill}
        />
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.roleType}>{gig.roleType}</Text>
            <Text style={styles.eventTitle}>{gig.eventTitle}</Text>
          </View>
          <View style={styles.payBadge}>
            <Text style={styles.payAmount}>${gig.pay}</Text>
            <Text style={styles.payLabel}>pay</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={13} color={colors.textMuted} />
            <Text style={styles.infoText}>{gig.shiftStart} – {gig.shiftEnd}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="location-outline" size={13} color={colors.textMuted} />
            <Text style={styles.infoText}>{gig.location} • {gig.distance}</Text>
          </View>
          <View style={styles.infoItem}>
            <Feather name="users" size={13} color={colors.textMuted} />
            <Text style={styles.infoText}>{gig.slots} slot{gig.slots > 1 ? 's' : ''} open</Text>
          </View>
        </View>
        <View style={styles.footer}>
          <View style={styles.tags}>
            {gig.tags.slice(0, 3).map(t => (
              <Chip key={t} label={t} size="small" />
            ))}
          </View>
          <PrimaryButton
            label={applied ? 'Applied' : 'Apply'}
            onPress={onApply}
            size="small"
            disabled={applied}
          />
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
    flexDirection: 'row',
    overflow: 'hidden',
  },
  colorBar: {
    width: 6,
    borderRadius: 0,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
    gap: 3,
  },
  roleType: {
    ...typography.cardTitle,
    color: colors.textPrimary,
    fontFamily: 'Inter_700Bold',
  },
  eventTitle: {
    ...typography.meta,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
  },
  payBadge: {
    backgroundColor: colors.accentMint,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.small,
    alignItems: 'center',
  },
  payAmount: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#1A6635',
  },
  payLabel: {
    fontSize: 10,
    color: '#1A6635',
    fontFamily: 'Inter_400Regular',
  },
  infoRow: {
    gap: 4,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  infoText: {
    ...typography.meta,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  tags: {
    flexDirection: 'row',
    gap: 5,
    flex: 1,
    flexWrap: 'wrap',
  },
});
