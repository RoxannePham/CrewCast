import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadow } from '@/constants/theme';
import { DiscussionPostCard } from '@/components/cards/DiscussionPostCard';
import { useApp } from '@/context/AppContext';
import { Avatar } from '@/components/ui/Avatar';

const CATEGORIES = [
  { key: 'foryou', label: 'For You' },
  { key: 'nyu', label: 'NYU' },
  { key: 'photovideo', label: 'Photo/Video' },
  { key: 'tips', label: 'Tips' },
];

export default function DiscussionsScreen() {
  const insets = useSafeAreaInsets();
  const { discussions } = useApp();
  const [activeCategory, setActiveCategory] = useState('foryou');

  const topPadding = Platform.OS === 'web' ? 67 : insets.top;

  const filtered = activeCategory === 'foryou'
    ? discussions
    : discussions.filter(d => d.category === activeCategory);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topPadding + 12 }]}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Discussions</Text>
          <View style={styles.headerActions}>
            <Pressable style={styles.headerBtn}>
              <Ionicons name="notifications-outline" size={20} color={colors.textSecondary} />
            </Pressable>
            <Pressable style={styles.headerBtn}>
              <Feather name="video" size={18} color={colors.textSecondary} />
            </Pressable>
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContent}
        >
          {CATEGORIES.map(cat => (
            <Pressable
              key={cat.key}
              onPress={() => setActiveCategory(cat.key)}
              style={[
                styles.categoryChip,
                activeCategory === cat.key && styles.categoryChipActive,
              ]}
            >
              <Text style={[
                styles.categoryText,
                activeCategory === cat.key && styles.categoryTextActive,
              ]}>
                {cat.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={[styles.listContent, { paddingBottom: Platform.OS === 'web' ? 84 : 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.composerCard, shadow.card]}>
          <Avatar name="You" avatarColor={colors.accentLavender} size={36} />
          <View style={styles.composerInput}>
            <Text style={styles.composerPlaceholder}>What's on your mind?</Text>
          </View>
          <Pressable style={styles.composerMore}>
            <Feather name="more-horizontal" size={18} color={colors.textMuted} />
          </Pressable>
        </View>

        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="message-circle" size={40} color={colors.textMuted} />
            <Text style={styles.emptyText}>No posts yet</Text>
          </View>
        ) : (
          filtered.map(post => (
            <DiscussionPostCard key={post.id} post={post} />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.backgroundPrimary,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriesScroll: {
    marginHorizontal: -spacing.md,
  },
  categoriesContent: {
    paddingHorizontal: spacing.md,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: radius.chip,
    backgroundColor: colors.backgroundSecondary,
    marginRight: 6,
  },
  categoryChipActive: {
    backgroundColor: colors.accentLavender,
  },
  categoryText: {
    ...typography.metaMedium,
    color: colors.textSecondary,
    fontFamily: 'Inter_500Medium',
  },
  categoryTextActive: {
    color: '#5A3F8A',
    fontFamily: 'Inter_600SemiBold',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    gap: 0,
  },
  composerCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.card,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  composerInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: radius.button,
  },
  composerPlaceholder: {
    ...typography.body,
    color: colors.textMuted,
    fontFamily: 'Inter_400Regular',
  },
  composerMore: {
    padding: 4,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: spacing.sm,
  },
  emptyText: {
    ...typography.sectionTitle,
    color: colors.textSecondary,
    fontFamily: 'Inter_600SemiBold',
  },
});
