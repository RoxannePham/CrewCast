import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
  Platform, Linking, Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, radius, shadow } from '@/constants/theme';
import { OrgAvatar } from '@/components/ui/OrgAvatar';
import { mockOrganizations } from '@/data/mockOrganizations';

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

function LinkButton({ icon, label, url, color }: { icon: string; label: string; url: string; color: string }) {
  const handlePress = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Cannot Open Link', 'This link could not be opened on your device.');
      }
    } catch {
      Alert.alert('Error', 'Failed to open link.');
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.linkBtn, shadow.card, { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] }]}
    >
      <View style={[styles.linkIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon as any} size={20} color={color} />
      </View>
      <View style={styles.linkInfo}>
        <Text style={styles.linkLabel}>{label}</Text>
        <Text style={styles.linkUrl} numberOfLines={1}>{url.replace('https://', '').replace('www.', '')}</Text>
      </View>
      <Ionicons name="open-outline" size={16} color={colors.textMuted} />
    </Pressable>
  );
}

export default function OrganizationDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const org = mockOrganizations.find(o => o.id === id);
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const botPad = Platform.OS === 'web' ? 34 : insets.bottom;

  if (!org) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.textMuted} />
        <Text style={styles.notFoundTitle}>Organization not found</Text>
        <Pressable onPress={() => router.back()} style={styles.goBackBtn}>
          <Text style={styles.goBackBtnText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const catColor = getCategoryColor(org.category);
  const iconName = CATEGORY_ICONS[org.category] || 'business-outline';

  const links = [];
  if (org.instagram) links.push({ icon: 'logo-instagram', label: 'Instagram', url: org.instagram, color: '#E1306C' });
  if (org.linktree) links.push({ icon: 'link-outline', label: 'Linktree', url: org.linktree, color: '#43E660' });
  if (org.website) links.push({ icon: 'globe-outline', label: 'Website', url: org.website, color: colors.accentBlue });
  if (org.email) links.push({ icon: 'mail-outline', label: 'Email', url: `mailto:${org.email}`, color: colors.accentPrimary });
  if (links.length === 0 && org.primaryLink) {
    links.push({ icon: 'link-outline', label: 'Main Link', url: org.primaryLink, color: colors.accentPrimary });
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: topPad + 12, paddingBottom: botPad + 40 }]}
      showsVerticalScrollIndicator={false}
    >
      <Pressable onPress={() => router.back()} style={[styles.backBtn, shadow.card]}>
        <Ionicons name="chevron-back" size={22} color={colors.textSecondary} />
      </Pressable>

      <View style={styles.heroArea}>
        <OrgAvatar name={org.name} imageUrl={org.imageUrl} category={org.category} size={80} />
        <Text style={styles.orgName}>{org.name}</Text>
        <View style={styles.metaRow}>
          <View style={[styles.catBadge, { backgroundColor: catColor + '20' }]}>
            <Text style={[styles.catBadgeText, { color: catColor }]}>{org.category}</Text>
          </View>
        </View>
        <Text style={styles.campus}>{org.campus}</Text>
      </View>

      <View style={[styles.card, shadow.card]}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.description}>{org.description}</Text>
      </View>

      {org.tags.length > 0 && (
        <View style={[styles.card, shadow.card]}>
          <Text style={styles.sectionTitle}>Tags</Text>
          <View style={styles.tagRow}>
            {org.tags.map(tag => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.linksSection}>
        <Text style={styles.sectionTitle}>Links & Contact</Text>
        {links.map((link, i) => (
          <LinkButton key={i} {...link} />
        ))}
      </View>

      <View style={[styles.card, shadow.card, styles.futureCard]}>
        <Ionicons name="flash-outline" size={20} color={colors.accentPrimary} />
        <View style={styles.futureInfo}>
          <Text style={styles.futureTitle}>Opportunities</Text>
          <Text style={styles.futureDesc}>Check back soon for posted gigs and events from this organization.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundPrimary },
  content: { paddingHorizontal: spacing.md, gap: spacing.md },
  centered: { alignItems: 'center', justifyContent: 'center' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceCard, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start' },
  heroArea: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.md },
  heroIcon: { width: 80, height: 80, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  orgName: { fontSize: 24, fontFamily: 'Inter_700Bold', color: colors.textPrimary, textAlign: 'center' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  catBadge: { borderRadius: radius.chip, paddingHorizontal: 12, paddingVertical: 4 },
  catBadgeText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  campus: { ...typography.body, color: colors.textMuted, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  card: { backgroundColor: colors.surfaceCard, borderRadius: radius.card, padding: spacing.md, gap: spacing.sm },
  sectionTitle: { ...typography.sectionTitle, color: colors.textPrimary, fontFamily: 'Inter_700Bold' },
  description: { ...typography.body, color: colors.textSecondary, fontFamily: 'Inter_400Regular', lineHeight: 22 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { backgroundColor: colors.backgroundSecondary, borderRadius: radius.chip, paddingHorizontal: 10, paddingVertical: 4 },
  tagText: { fontSize: 12, fontFamily: 'Inter_500Medium', color: colors.textSecondary },
  linksSection: { gap: spacing.sm },
  linkBtn: {
    backgroundColor: colors.surfaceCard, borderRadius: radius.card,
    padding: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.md,
  },
  linkIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  linkInfo: { flex: 1, gap: 2 },
  linkLabel: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: colors.textPrimary },
  linkUrl: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
  futureCard: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, borderWidth: 1.5, borderColor: colors.accentPrimary + '30', backgroundColor: colors.accentPrimary + '05' },
  futureInfo: { flex: 1, gap: 2 },
  futureTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: colors.textPrimary },
  futureDesc: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_400Regular', lineHeight: 18 },
  notFoundTitle: { fontSize: 18, fontFamily: 'Inter_600SemiBold', color: colors.textSecondary, marginTop: spacing.md },
  goBackBtn: { marginTop: spacing.md, backgroundColor: colors.accentPrimary, borderRadius: radius.button, paddingHorizontal: spacing.xl, paddingVertical: 12 },
  goBackBtnText: { fontSize: 15, fontFamily: 'Inter_700Bold', color: '#fff' },
});
