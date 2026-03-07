import React from 'react';
import { Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { colors, typography, radius } from '@/constants/theme';

type ChipVariant = 'default' | 'pink' | 'lavender' | 'mint' | 'peach';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  color?: string;
  size?: 'small' | 'medium';
  style?: ViewStyle;
  variant?: ChipVariant;
}

const VARIANT_COLORS: Record<ChipVariant, { bg: string; text: string; selectedBg: string }> = {
  default: { bg: colors.backgroundSecondary, text: colors.textSecondary, selectedBg: colors.accentPrimary },
  pink: { bg: colors.accentPrimary + '20', text: colors.accentPrimary, selectedBg: colors.accentPrimary },
  lavender: { bg: colors.accentLavender + '25', text: '#6B4FCF', selectedBg: colors.accentLavender },
  mint: { bg: colors.accentMint + '40', text: '#1A6635', selectedBg: colors.accentMint },
  peach: { bg: colors.accentPeach + '40', text: '#8B4513', selectedBg: colors.accentPeach },
};

export function Chip({ label, selected = false, onPress, color, size = 'medium', style, variant = 'default' }: ChipProps) {
  const variantConfig = VARIANT_COLORS[variant];

  const bgColor = selected
    ? (color || variantConfig.selectedBg)
    : (variant !== 'default' && !selected ? variantConfig.bg : colors.backgroundSecondary);

  const textColor = selected ? colors.textInverse : (variant !== 'default' ? variantConfig.text : colors.textSecondary);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        size === 'small' && styles.chipSmall,
        { backgroundColor: bgColor, opacity: pressed ? 0.8 : 1 },
        style,
      ]}
    >
      <Text style={[
        styles.text,
        size === 'small' && styles.textSmall,
        { color: textColor },
      ]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.chip,
    alignSelf: 'flex-start',
  },
  chipSmall: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  text: {
    ...typography.metaMedium,
    fontFamily: 'Inter_500Medium',
  },
  textSmall: {
    fontSize: 11,
  },
});
