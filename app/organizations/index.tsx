import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, Pressable,
  Platform, ScrollView, Linking
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, radius, shadow } from '@/constants/theme';
import { SearchBar } from '@/components/ui/SearchBar';
import { mockOrganizations, Organization } from '@/data/mockOrganizations';

const CATEGORIES = ['All', 'Tech', 'Cultural', 'Identity', 'Arts', 'Sports', 'Academic', 'Pre-Professional', 'Student Government'];

const CATEGORY_ICONS: Record<string, string> = {
  Tech: 'hardware-chip-outline',
  Cultural: 'globe-outline',
  Identity: 'heart-outline',
  Arts: 'color-palette-outline',
  Sports: 'football-outline',
  Academic: 'school-outline',
  'Pre-Professional': 'briefcase-outline',
  'Student Government': 'flag-outline',
};

function OrgCard({ org, onPress }: { org: Organization; onPress: () => void }) {
  const iconName = CATEGORY_ICONS[org.category] || 'business-outline';
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.orgCard, shadow.card, { transform: [{ scale: pressed ? 0.98 : 1 }] }]}
    >
      <View style={[styles.orgIcon, { backgroundColor: getCategoryColor(org.category) + '25' }]}>
        <Ionicons name={iconName as any} size={22} color={getCategoryColor(org.category)} />
      </View>
      <View style={styles.orgInfo}>
        <Text style={styles.orgName} numberOfLines={1}>{org.name}</Text>
        <Text style={styles.orgDesc} numberOfLines={2}>{org.description}</Text>
        <View style={styles.orgMeta}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{org.category}</Text>
          </View>
          <Text style={styles.campusText} numberOfLines={1}>{org.campus.replace('Rutgers University — ', '')}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </Pressable>
  );
}

function getCategoryColor(category: string): string {
  const map: Record<string, string> = {
    Tech: colors.accentBlue,
    Cultural: colors.accentPeach,
    Identity: colors.accentPrimary,
    Arts: colors.accentLavender,
    Sports: colors.accentMint,
    Academic: colors.starGold,
    'Pre-Professional': colors.accentBlue,
    'Student Government': colors.accentLavender,
  };
  return map[category] || colors.textMuted;
}

export default function OrganizationsScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const filtered = useMemo(() => {
    return mockOrganizations.filter(org => {
      const matchCat = activeCategory === 'All' || org.category === activeCategory;
      const matchSearch = !searchQuery ||
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [searchQuery, activeCategory]);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <View style={styles.titleRow}>
          <Pressable onPress={() => router.back()} style={[styles.backBtn, shadow.card]}>
            <Ionicons name="chevron-back" size={22} color={colors.textSecondary} />
          </Pressable>
          <Text style={styles.title}>Organizations</Text>
          <View style={{ width: 40 }} />
        </View>
        <SearchBar
          placeholder="Search organizations by name or category"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {CATEGORIES.map(cat => (
            <Pressable
              key={cat}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setActiveCategory(cat); }}
              style={[styles.catChip, activeCategory === cat && styles.catChipActive]}
            >
              <Text style={[styles.catChipText, activeCategory === cat && styles.catChipTextActive]}>{cat}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={o => o.id}
        renderItem={({ item }) => (
          <OrgCard org={item} onPress={() => router.push(`/organizations/${item.id}`)} />
        )}
        contentContainerStyle={[styles.list, { paddingBottom: Platform.OS === 'web' ? 34 : insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={styles.listCount}>{filtered.length} organization{filtered.length !== 1 ? 's' : ''}</Text>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No organizations found</Text>
            <Text style={styles.emptySubtitle}>Try a different search or filter</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundPrimary },
  header: { paddingHorizontal: spacing.md, gap: spacing.sm, paddingBottom: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceCard, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontFamily: 'Inter_700Bold', color: colors.textPrimary },
  chipRow: { gap: 8, paddingBottom: 4 },
  catChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: radius.chip, backgroundColor: colors.surfaceCard, borderWidth: 1.5, borderColor: colors.borderSubtle },
  catChipActive: { backgroundColor: colors.accentPrimary, borderColor: colors.accentPrimary },
  catChipText: { fontSize: 12, fontFamily: 'Inter_500Medium', color: colors.textSecondary },
  catChipTextActive: { color: '#fff', fontFamily: 'Inter_600SemiBold' },
  list: { paddingHorizontal: spacing.md, paddingTop: spacing.sm, gap: spacing.sm },
  listCount: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_500Medium', marginBottom: 4 },
  orgCard: {
    backgroundColor: colors.surfaceCard, borderRadius: radius.card,
    padding: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.md,
  },
  orgIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  orgInfo: { flex: 1, gap: 4 },
  orgName: { fontSize: 15, fontFamily: 'Inter_700Bold', color: colors.textPrimary },
  orgDesc: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_400Regular', lineHeight: 17 },
  orgMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
  categoryBadge: { backgroundColor: colors.backgroundSecondary, borderRadius: radius.chip, paddingHorizontal: 8, paddingVertical: 2 },
  categoryBadgeText: { fontSize: 10, fontFamily: 'Inter_600SemiBold', color: colors.textSecondary },
  campusText: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_400Regular', flex: 1 },
  emptyState: { alignItems: 'center', paddingVertical: 80, gap: spacing.md },
  emptyTitle: { ...typography.sectionTitle, color: colors.textSecondary, fontFamily: 'Inter_600SemiBold' },
  emptySubtitle: { ...typography.body, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
});
