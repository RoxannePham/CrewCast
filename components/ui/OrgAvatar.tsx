import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { colors, typography } from '@/constants/theme';

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || '?';
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

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

interface OrgAvatarProps {
  name: string;
  imageUrl?: string;
  category?: string;
  size?: number;
}

export function OrgAvatar({ name, imageUrl, category, size = 48 }: OrgAvatarProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const initials = getInitials(name);
  const fontSize = size * 0.34;
  const bgColor = (category && CATEGORY_COLORS[category]) || colors.accentLavender;

  if (imageUrl && !imgFailed) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        contentFit="cover"
        onError={() => setImgFailed(true)}
      />
    );
  }

  return (
    <View style={[styles.fallback, { width: size, height: size, borderRadius: size / 2, backgroundColor: bgColor + '25' }]}>
      <Text style={[styles.initials, { fontSize, color: bgColor }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontFamily: 'Inter_700Bold',
  },
});
