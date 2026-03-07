import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { typography, radius } from '@/constants/theme';

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || '?';
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

interface AvatarProps {
  name: string;
  avatarColor?: string;
  backgroundColor?: string;
  size?: number;
  imageUri?: string;
  imageUrl?: string;
  imageSource?: any;
  showBorder?: boolean;
}

export function Avatar({
  name,
  avatarColor,
  backgroundColor,
  size = 40,
  imageUri,
  imageUrl,
  imageSource,
  showBorder = false,
}: AvatarProps) {
  const bgColor = backgroundColor || avatarColor || '#CDB9FF';
  const initials = getInitials(name);
  const fontSize = size * 0.38;
  const [imgFailed, setImgFailed] = useState(false);

  const borderStyle = showBorder ? {
    borderWidth: 3,
    borderColor: '#fff',
  } : {};

  const resolvedUri = imageUrl || imageUri;

  if (imageSource && !imgFailed) {
    return (
      <Image
        source={imageSource}
        style={[{ width: size, height: size, borderRadius: size / 2 }, borderStyle]}
        contentFit="cover"
        onError={() => setImgFailed(true)}
      />
    );
  }

  if (resolvedUri && !imgFailed) {
    return (
      <Image
        source={{ uri: resolvedUri }}
        style={[{ width: size, height: size, borderRadius: size / 2 }, borderStyle]}
        contentFit="cover"
        onError={() => setImgFailed(true)}
      />
    );
  }

  return (
    <View style={[
      styles.container,
      { width: size, height: size, borderRadius: size / 2, backgroundColor: bgColor },
      borderStyle,
    ]}>
      <Text style={[styles.initials, { fontSize }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    ...typography.bodyMedium,
    color: '#1E1E1E',
    fontFamily: 'Inter_600SemiBold',
  },
});
