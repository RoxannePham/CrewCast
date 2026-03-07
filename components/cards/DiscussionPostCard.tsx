import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons, Feather } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadow } from '@/constants/theme';
import { Avatar } from '@/components/ui/Avatar';
import { DiscussionPost } from '@/context/AppContext';

interface DiscussionPostCardProps {
  post: DiscussionPost;
}

export function DiscussionPostCard({ post }: DiscussionPostCardProps) {
  const [liked, setLiked] = React.useState(false);

  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLiked(l => !l);
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.card, shadow.card, { opacity: pressed ? 0.95 : 1 }]}
      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
    >
      {post.isPinned && (
        <View style={styles.pinnedBanner}>
          <Ionicons name="pin" size={11} color={colors.accentPrimary} />
          <Text style={styles.pinnedText}>Pinned</Text>
        </View>
      )}

      {post.eventRef && (
        <View style={styles.eventRefCard}>
          <View style={styles.eventRefImage} />
          <View style={styles.eventRefInfo}>
            <Text style={styles.eventRefTitle}>{post.eventRef}</Text>
            <View style={styles.eventRefMeta}>
              <Avatar name={post.author.name} avatarColor={post.author.avatarColor} size={16} />
              <Text style={styles.eventRefAuthor}>{post.author.name}</Text>
              <Text style={styles.eventRefRating}>{post.author.rating}</Text>
              <Ionicons name="star" size={10} color={colors.starGold} />
            </View>
          </View>
        </View>
      )}

      <View style={styles.header}>
        <Avatar name={post.author.name} avatarColor={post.author.avatarColor} size={40} />
        <View style={styles.headerInfo}>
          <Text style={styles.authorName}>{post.author.name}</Text>
          <Text style={styles.timestamp}>{post.timestamp}</Text>
        </View>
        <Pressable style={styles.moreButton}>
          <Feather name="more-horizontal" size={16} color={colors.textMuted} />
        </Pressable>
      </View>

      <Text style={styles.content} numberOfLines={3}>{post.content}</Text>

      <View style={styles.reactions}>
        <Pressable style={styles.reactionBtn} onPress={handleLike}>
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={16}
            color={liked ? colors.accentPrimary : colors.textMuted}
          />
          <Text style={[styles.reactionCount, liked && { color: colors.accentPrimary }]}>
            {post.likes + (liked ? 1 : 0)}
          </Text>
        </Pressable>
        <Pressable style={styles.reactionBtn}>
          <Feather name="message-circle" size={16} color={colors.textMuted} />
          <Text style={styles.reactionCount}>{post.replies} Replies</Text>
        </Pressable>
        <Pressable style={styles.reactionBtn}>
          <Feather name="share-2" size={16} color={colors.textMuted} />
          <Text style={styles.reactionCount}>{post.shares}</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.card,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  pinnedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pinnedText: {
    ...typography.meta,
    color: colors.accentPrimary,
    fontFamily: 'Inter_500Medium',
  },
  eventRefCard: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: radius.small,
    overflow: 'hidden',
    marginBottom: 4,
  },
  eventRefImage: {
    width: 80,
    height: 60,
    backgroundColor: colors.accentLavender + '60',
  },
  eventRefInfo: {
    flex: 1,
    padding: spacing.sm,
    justifyContent: 'center',
    gap: 4,
  },
  eventRefTitle: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontFamily: 'Inter_600SemiBold',
  },
  eventRefMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  eventRefAuthor: {
    ...typography.meta,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
  },
  eventRefRating: {
    ...typography.meta,
    color: colors.textSecondary,
    fontFamily: 'Inter_500Medium',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerInfo: {
    flex: 1,
  },
  authorName: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontFamily: 'Inter_600SemiBold',
  },
  timestamp: {
    ...typography.meta,
    color: colors.textMuted,
    fontFamily: 'Inter_400Regular',
  },
  moreButton: {
    padding: 4,
  },
  content: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 20,
    fontFamily: 'Inter_400Regular',
  },
  reactions: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    marginTop: 4,
  },
  reactionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  reactionCount: {
    ...typography.meta,
    color: colors.textMuted,
    fontFamily: 'Inter_400Regular',
  },
});
