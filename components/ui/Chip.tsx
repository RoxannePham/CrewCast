import React from 'react';
import { Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { colors, typography, radius, spacing } from '@/constants/theme';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  color?: string;
  size?: 'small' | 'medium';
  style?: ViewStyle;
}

export function Chip({ label, selected = false, onPress, color, size = 'medium', style }: ChipProps) {
  const bgColor = selected
    ? (color || colors.accentPrimary)
    : colors.backgroundSecondary;

  const textColor = selected ? colors.textInverse : colors.textSecondary;

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
