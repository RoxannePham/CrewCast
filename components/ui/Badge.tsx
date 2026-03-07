import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radius } from '@/constants/theme';

type BadgeType = 'toprated' | 'ontime' | 'campusverified' | 'default';
type BadgeVariant = 'topRated' | 'onTime' | 'campusVerified' | 'default';

interface BadgeProps {
  label?: string;
  type?: BadgeType;
  variant?: BadgeVariant;
}

const badgeConfig: Record<string, { bg: string; text: string; defaultLabel: string; icon?: React.ReactNode }> = {
  toprated: { bg: '#FFF0B8', text: '#996600', defaultLabel: 'Top Rated', icon: <Ionicons name="flame" size={11} color="#996600" /> },
  topRated: { bg: '#FFF0B8', text: '#996600', defaultLabel: 'Top Rated', icon: <Ionicons name="flame" size={11} color="#996600" /> },
  ontime: { bg: '#D4F0FF', text: '#005C8A', defaultLabel: 'On Time', icon: <Ionicons name="time-outline" size={11} color="#005C8A" /> },
  onTime: { bg: '#D4F0FF', text: '#005C8A', defaultLabel: 'On Time', icon: <Ionicons name="time-outline" size={11} color="#005C8A" /> },
  campusverified: { bg: '#E0F4E8', text: '#1A6635', defaultLabel: 'Campus', icon: <MaterialCommunityIcons name="map-marker-check-outline" size={11} color="#1A6635" /> },
  campusVerified: { bg: '#E0F4E8', text: '#1A6635', defaultLabel: 'Campus', icon: <MaterialCommunityIcons name="map-marker-check-outline" size={11} color="#1A6635" /> },
  default: { bg: colors.backgroundSecondary, text: colors.textSecondary, defaultLabel: 'Badge' },
};

export function Badge({ label, type, variant }: BadgeProps) {
  const key = variant || type || 'default';
  const config = badgeConfig[key] || badgeConfig.default;
  const displayLabel = label || config.defaultLabel;

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      {config.icon && <View style={styles.iconWrap}>{config.icon}</View>}
      <Text style={[styles.text, { color: config.text }]}>{displayLabel}</Text>
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
  iconWrap: { marginRight: 4 },
  text: { fontSize: 11, fontFamily: 'Inter_500Medium' },
});
