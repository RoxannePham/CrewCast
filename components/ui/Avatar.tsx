import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { typography, radius } from '@/constants/theme';

interface AvatarProps {
  name: string;
  avatarColor?: string;
  size?: number;
  imageUri?: string;
}

export function Avatar({ name, avatarColor = '#CDB9FF', size = 40, imageUri }: AvatarProps) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const fontSize = size * 0.38;

  if (imageUri) {
    return (
      <Image
        source={{ uri: imageUri }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        contentFit="cover"
      />
    );
  }

  return (
    <View style={[
      styles.container,
      { width: size, height: size, borderRadius: size / 2, backgroundColor: avatarColor }
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
