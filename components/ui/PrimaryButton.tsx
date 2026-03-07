import React from 'react';
import { Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors, typography, radius } from '@/constants/theme';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  disabled?: boolean;
}

export function PrimaryButton({ label, onPress, size = 'medium', style, disabled }: PrimaryButtonProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        { opacity: disabled ? 0.5 : pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.96 : 1 }] },
        style,
      ]}
    >
      <LinearGradient
        colors={['#FF8F9B', '#FF5E73']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.button, size === 'small' && styles.small, size === 'large' && styles.large]}
      >
        <Text style={[styles.label, size === 'small' && styles.labelSmall]}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  small: {
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  large: {
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  label: {
    ...typography.bodyMedium,
    color: colors.textInverse,
    fontFamily: 'Inter_600SemiBold',
  },
  labelSmall: {
    fontSize: 13,
  },
});
