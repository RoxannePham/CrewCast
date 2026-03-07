import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Tech: 'hardware-chip-outline',
  Cultural: 'globe-outline',
  Identity: 'heart-outline',
  Arts: 'color-palette-outline',
  Sports: 'football-outline',
  Academic: 'school-outline',
  'Pre-Professional': 'briefcase-outline',
  'Student Government': 'flag-outline',
};

const CATEGORY_COLORS: Record<string, string> = {
  Tech: colors.accentBlue,
  Cultural: colors.accentPeach,
  Identity: colors.accentPrimary,
  Arts: colors.accentLavender,
  Sports: colors.accentMint,
  Academic: colors.starGold,
  'Pre-Professional': colors.accentBlue,
  'Student Government': colors.accentLavender,
};

const FALLBACK_ICON: keyof typeof Ionicons.glyphMap = 'business-outline';

interface OrgAvatarProps {
  name: string;
  imageUrl?: string;
  category?: string;
  size?: number;
}

export function OrgAvatar({ category, size = 48 }: OrgAvatarProps) {
  const bgColor = (category && CATEGORY_COLORS[category]) || colors.accentLavender;
  const iconName = (category && CATEGORY_ICONS[category]) || FALLBACK_ICON;
  const iconSize = size * 0.45;

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2, backgroundColor: bgColor + '25' }]}>
      <Ionicons name={iconName} size={iconSize} color={bgColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
