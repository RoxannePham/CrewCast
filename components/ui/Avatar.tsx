import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { typography, radius } from '@/constants/theme';

interface AvatarProps {
  name: string;
  avatarColor?: string;
  backgroundColor?: string;
  size?: number;
  imageUri?: string;
  imageSource?: any;
  showBorder?: boolean;
}

export function Avatar({
  name,
  avatarColor,
  backgroundColor,
  size = 40,
  imageUri,
  imageSource,
  showBorder = false,
}: AvatarProps) {
  const bgColor = backgroundColor || avatarColor || '#CDB9FF';
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const fontSize = size * 0.38;

  const borderStyle = showBorder ? {
    borderWidth: 3,
    borderColor: '#fff',
  } : {};

  if (imageSource) {
    return (
      <Image
        source={imageSource}
        style={[{ width: size, height: size, borderRadius: size / 2 }, borderStyle]}
        contentFit="cover"
      />
    );
  }

  if (imageUri) {
    return (
      <Image
        source={{ uri: imageUri }}
        style={[{ width: size, height: size, borderRadius: size / 2 }, borderStyle]}
        contentFit="cover"
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
