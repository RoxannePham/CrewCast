import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radius } from '@/constants/theme';

interface BadgeProps {
  label: string;
  type?: 'toprated' | 'ontime' | 'campusverified' | 'default';
}

const badgeConfig: Record<string, { bg: string; text: string; icon?: React.ReactNode }> = {
  toprated: { bg: '#FFF0B8', text: '#996600', icon: <Text style={{ fontSize: 12 }}>🔥</Text> },
  ontime: { bg: '#D4F0FF', text: '#005C8A', icon: <Ionicons name="time-outline" size={11} color="#005C8A" /> },
  campusverified: { bg: '#E0F4E8', text: '#1A6635', icon: <MaterialCommunityIcons name="map-marker-check-outline" size={11} color="#1A6635" /> },
  default: { bg: colors.backgroundSecondary, text: colors.textSecondary },
};

export function Badge({ label, type = 'default' }: BadgeProps) {
  const typeKey = type.toLowerCase().replace(/ /g, '') as keyof typeof badgeConfig;
  const config = badgeConfig[typeKey] || badgeConfig.default;

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      {config.icon && <View style={styles.iconWrap}>{config.icon}</View>}
      <Text style={[styles.text, { color: config.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.chip,
  },
  iconWrap: {
    marginRight: 4,
  },
  text: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
});
