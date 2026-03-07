import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadow } from '@/constants/theme';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Event } from '@/context/AppContext';

interface RecommendedCardProps {
  event: Event;
  onApply: () => void;
  applied?: boolean;
}

export function RecommendedCard({ event, onApply, applied }: RecommendedCardProps) {
  return (
    <Pressable
      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
      style={({ pressed }) => [
        styles.card,
        shadow.card,
        { transform: [{ scale: pressed ? 0.97 : 1 }] }
      ]}
    >
      <LinearGradient
        colors={[event.themeColor + '40', event.themeColor + '10', colors.surfaceCard]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />
      <View style={styles.content}>
        <View style={styles.left}>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.time}>{event.time}</Text>
          <View style={styles.metaRow}>
            {event.pay && (
              <View style={styles.payChip}>
                <Text style={styles.payText}>${event.pay}</Text>
              </View>
            )}
            <Text style={styles.distance}>{event.distance}</Text>
          </View>
        </View>
        <PrimaryButton
          label={applied ? 'Applied' : 'Apply'}
          onPress={onApply}
          size="small"
          disabled={applied}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    backgroundColor: colors.surfaceCard,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  gradient: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  left: {
    flex: 1,
    marginRight: spacing.md,
  },
  title: {
    ...typography.cardTitle,
    color: colors.textPrimary,
    marginBottom: 3,
    fontFamily: 'Inter_600SemiBold',
  },
  time: {
    ...typography.meta,
    color: colors.textSecondary,
    marginBottom: 6,
    fontFamily: 'Inter_400Regular',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  payChip: {
    backgroundColor: colors.accentMint,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.chip,
  },
  payText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: '#1A6635',
  },
  distance: {
    ...typography.meta,
    color: colors.textMuted,
    fontFamily: 'Inter_400Regular',
  },
});
