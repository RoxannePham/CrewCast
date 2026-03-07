import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, Pressable,
  TextInput, Platform, ScrollView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, radius, shadow } from '@/constants/theme';
import { Avatar } from '@/components/ui/Avatar';
import { Chip } from '@/components/ui/Chip';

interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatarColor: string;
  authorRole: string;
  authorSchool: string;
  text: string;
  tags: string[];
  likes: number;
  comments: number;
  hasLiked: boolean;
  timeAgo: string;
  isPinned?: boolean;
}

const MOCK_POSTS: Post[] = [
  {
    id: 'p1', authorId: 'w1', authorName: 'Alex Kim', authorAvatarColor: '#CDB9FF',
    authorRole: 'DJ · NYU', authorSchool: 'NYU',
    text: 'Just wrapped Greek Week at NYU Palladium. 400 people on the floor at midnight 🎉 Best event I\'ve done this semester. Who else is working Spring Fling?',
    tags: ['NYU', 'DJ', 'Greek Life'], likes: 42, comments: 8, hasLiked: false, timeAgo: '2 hrs ago', isPinned: true,
  },
  {
    id: 'p2', authorId: 'w2', authorName: 'Maya Chen', authorAvatarColor: '#BFF0D4',
    authorRole: 'Photographer · Columbia', authorSchool: 'Columbia',
    text: 'Anyone else notice how hard it is to find legit event photography gigs on other apps? CrewCast actually gets it. Booked 3 events this week through crew chats alone.',
    tags: ['Photography', 'CrewCast', 'Tips'], likes: 28, comments: 5, hasLiked: false, timeAgo: '4 hrs ago',
  },
  {
    id: 'p3', authorId: 'h2', authorName: 'Sean Brody', authorAvatarColor: '#B9D9FF',
    authorRole: 'Event Host · TechStartup NYC', authorSchool: '',
    text: 'PSA: If you\'re applying to events, please have your portfolio link ready. Seeing so many applications with no work samples. Hosts can\'t book blind.',
    tags: ['Advice', 'For Workers', 'Hiring'], likes: 67, comments: 14, hasLiked: false, timeAgo: '6 hrs ago',
  },
  {
    id: 'p4', authorId: 'w3', authorName: 'Jordan Walsh', authorAvatarColor: '#FFD9B8',
    authorRole: 'Videographer · NYU Tisch', authorSchool: 'NYU',
    text: 'Tip for aspiring videographers: always get b-roll of the crowd during the first hour. That\'s when people are most candid and natural. The DJ/performer footage can wait.',
    tags: ['Videography', 'Tips', 'Pro Tips'], likes: 53, comments: 11, hasLiked: false, timeAgo: '8 hrs ago',
  },
  {
    id: 'p5', authorId: 'w8', authorName: 'Marcus Davis', authorAvatarColor: '#B8F0D4',
    authorRole: 'DJ · Brooklyn College', authorSchool: 'Brooklyn College',
    text: 'Playing Rooftop Rave this weekend. Techno b2b with another DJ for 5 hours. If you\'re in Brooklyn Saturday night, come through.',
    tags: ['Rave', 'Brooklyn', 'Techno'], likes: 89, comments: 23, hasLiked: false, timeAgo: '12 hrs ago',
  },
  {
    id: 'p6', authorId: 'w5', authorName: 'Olivia Hall', authorAvatarColor: '#CDB9FF',
    authorRole: 'Content Creator · NYU', authorSchool: 'NYU',
    text: 'Brand event content is getting so competitive. But here\'s the thing — authenticity always wins. Show the real moments, not just the polished ones. Hosts love that now.',
    tags: ['Content Creation', 'UGC', 'Brands'], likes: 71, comments: 19, hasLiked: false, timeAgo: '1 day ago',
  },
  {
    id: 'p7', authorId: 'w4', authorName: 'Sam Rivera', authorAvatarColor: '#B9D9FF',
    authorRole: 'Host/MC · Fordham', authorSchool: 'Fordham',
    text: 'Looking for other MCs to connect with. Running a monthly comedy + mixer series and need a co-host. DM if interested!',
    tags: ['Networking', 'MC', 'Collab'], likes: 34, comments: 9, hasLiked: false, timeAgo: '1 day ago',
  },
  {
    id: 'p8', authorId: 'h1', authorName: 'Jessica McCall', authorAvatarColor: '#FFD9B8',
    authorRole: 'Event Host · NYU Greek Council', authorSchool: 'NYU',
    text: 'Shoutout to Alex Kim and Maya Chen for absolutely killing it at Greek Week last night. Both were super professional, on time, and delivered amazing work. Booking again immediately 🔥',
    tags: ['Shoutout', 'NYU', 'GreekWeek'], likes: 104, comments: 18, hasLiked: false, timeAgo: '2 days ago',
  },
];

const TAGS = ['All', 'Tips', 'NYC', 'DJ', 'Photography', 'Collab', 'For Workers', 'For Hosts'];

function PostCard({ post, onLike }: { post: Post; onLike: () => void }) {
  return (
    <View style={[styles.postCard, shadow.card, post.isPinned && styles.postCardPinned]}>
      {post.isPinned && (
        <View style={styles.pinnedRow}>
          <Ionicons name="pin" size={12} color={colors.accentPrimary} />
          <Text style={styles.pinnedText}>Trending</Text>
        </View>
      )}
      <View style={styles.postHeader}>
        <Avatar size={40} name={post.authorName} backgroundColor={post.authorAvatarColor} />
        <View style={styles.postAuthorInfo}>
          <Text style={styles.postAuthorName}>{post.authorName}</Text>
          <Text style={styles.postAuthorRole}>{post.authorRole}</Text>
        </View>
        <Text style={styles.postTime}>{post.timeAgo}</Text>
      </View>
      <Text style={styles.postText}>{post.text}</Text>
      <View style={styles.postTags}>
        {post.tags.map(tag => (
          <View key={tag} style={styles.postTag}>
            <Text style={styles.postTagText}>#{tag}</Text>
          </View>
        ))}
      </View>
      <View style={styles.postActions}>
        <Pressable onPress={onLike} style={({ pressed }) => [styles.actionBtn, { opacity: pressed ? 0.8 : 1 }]}>
          <Ionicons name={post.hasLiked ? 'heart' : 'heart-outline'} size={18} color={post.hasLiked ? colors.accentPrimary : colors.textMuted} />
          <Text style={[styles.actionText, post.hasLiked && styles.actionTextActive]}>{post.likes}</Text>
        </Pressable>
        <View style={styles.actionBtn}>
          <Ionicons name="chatbubble-outline" size={18} color={colors.textMuted} />
          <Text style={styles.actionText}>{post.comments}</Text>
        </View>
        <View style={styles.actionBtn}>
          <Ionicons name="share-outline" size={18} color={colors.textMuted} />
        </View>
      </View>
    </View>
  );
}

export default function DiscussionsScreen() {
  const insets = useSafeAreaInsets();
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [activeTag, setActiveTag] = useState('All');
  const [composing, setComposing] = useState(false);
  const [newPost, setNewPost] = useState('');
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const botPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const filteredPosts = activeTag === 'All' ? posts :
    posts.filter(p => p.tags.some(t => t.toLowerCase() === activeTag.toLowerCase()));

  const handleLike = (postId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, likes: p.hasLiked ? p.likes - 1 : p.likes + 1, hasLiked: !p.hasLiked } : p
    ));
  };

  const handlePost = () => {
    if (!newPost.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const post: Post = {
      id: `p_${Date.now()}`,
      authorId: 'w1',
      authorName: 'Alex Kim',
      authorAvatarColor: '#CDB9FF',
      authorRole: 'DJ · NYU',
      authorSchool: 'NYU',
      text: newPost,
      tags: ['NYC'],
      likes: 0,
      comments: 0,
      hasLiked: false,
      timeAgo: 'Just now',
    };
    setPosts(prev => [post, ...prev]);
    setNewPost('');
    setComposing(false);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Feed</Text>
          <Pressable
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setComposing(c => !c); }}
            style={[styles.composeBtn, shadow.card]}
          >
            <Ionicons name="add" size={20} color={colors.accentPrimary} />
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagRow}>
          {TAGS.map(tag => (
            <Pressable
              key={tag}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setActiveTag(tag); }}
              style={[styles.tagChip, activeTag === tag && styles.tagChipActive]}
            >
              <Text style={[styles.tagChipText, activeTag === tag && styles.tagChipTextActive]}>{tag}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {composing && (
        <View style={[styles.composeCard, shadow.cardHeavy]}>
          <TextInput
            style={styles.composeInput}
            value={newPost}
            onChangeText={setNewPost}
            placeholder="Share something with the crew..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={3}
            autoFocus
          />
          <View style={styles.composeActions}>
            <Pressable onPress={() => setComposing(false)} style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Pressable>
            <Pressable onPress={handlePost} style={styles.postBtn}>
              <LinearGradient colors={['#FF8F9B', '#FF5E73']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.postBtnGrad}>
                <Text style={styles.postBtnText}>Post</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      )}

      <FlatList
        data={filteredPosts}
        keyExtractor={p => p.id}
        renderItem={({ item }) => (
          <PostCard post={item} onLike={() => handleLike(item.id)} />
        )}
        contentContainerStyle={[styles.list, { paddingBottom: botPad + (Platform.OS === 'web' ? 84 : 100) }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="chatbubbles-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>Nothing here yet</Text>
            <Text style={styles.emptySubtitle}>Be the first to post!</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundPrimary },
  header: { paddingHorizontal: spacing.md, paddingBottom: 4, gap: spacing.sm },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 28, fontFamily: 'Inter_700Bold', color: colors.textPrimary },
  composeBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surfaceCard, alignItems: 'center', justifyContent: 'center' },
  tagRow: { gap: 8, paddingBottom: 4 },
  tagChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: radius.chip, backgroundColor: colors.surfaceCard, borderWidth: 1.5, borderColor: colors.borderSubtle },
  tagChipActive: { backgroundColor: colors.accentPrimary, borderColor: colors.accentPrimary },
  tagChipText: { fontSize: 13, fontFamily: 'Inter_500Medium', color: colors.textSecondary },
  tagChipTextActive: { color: '#fff', fontFamily: 'Inter_600SemiBold' },
  composeCard: { backgroundColor: colors.surfaceCard, marginHorizontal: spacing.md, borderRadius: radius.card, padding: spacing.md, gap: spacing.sm, marginBottom: spacing.sm },
  composeInput: { fontSize: 15, color: colors.textPrimary, fontFamily: 'Inter_400Regular', minHeight: 80, textAlignVertical: 'top' },
  composeActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.sm },
  cancelBtn: { paddingHorizontal: spacing.md, paddingVertical: 9, borderRadius: radius.button, borderWidth: 1.5, borderColor: colors.borderSubtle },
  cancelBtnText: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: colors.textSecondary },
  postBtn: { overflow: 'hidden', borderRadius: radius.button },
  postBtnGrad: { paddingHorizontal: spacing.lg, paddingVertical: 9, borderRadius: radius.button },
  postBtnText: { fontSize: 14, fontFamily: 'Inter_700Bold', color: '#fff' },
  list: { paddingHorizontal: spacing.md, paddingTop: spacing.sm, gap: spacing.sm },
  postCard: { backgroundColor: colors.surfaceCard, borderRadius: radius.card, padding: spacing.md, gap: spacing.sm },
  postCardPinned: { borderWidth: 1.5, borderColor: colors.accentPrimary + '30', backgroundColor: colors.accentPrimary + '05' },
  pinnedRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  pinnedText: { fontSize: 11, fontFamily: 'Inter_600SemiBold', color: colors.accentPrimary },
  postHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  postAuthorInfo: { flex: 1, gap: 1 },
  postAuthorName: { fontSize: 14, fontFamily: 'Inter_700Bold', color: colors.textPrimary },
  postAuthorRole: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
  postTime: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
  postText: { ...typography.body, color: colors.textPrimary, fontFamily: 'Inter_400Regular', lineHeight: 22 },
  postTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  postTag: { backgroundColor: colors.accentLavender + '20', borderRadius: radius.chip, paddingHorizontal: 8, paddingVertical: 3 },
  postTagText: { fontSize: 11, fontFamily: 'Inter_500Medium', color: colors.accentLavender },
  postActions: { flexDirection: 'row', gap: spacing.md, borderTopWidth: 1, borderTopColor: colors.borderSubtle, paddingTop: spacing.sm },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  actionText: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_500Medium' },
  actionTextActive: { color: colors.accentPrimary },
  emptyState: { alignItems: 'center', paddingVertical: 80, gap: spacing.md },
  emptyTitle: { ...typography.sectionTitle, color: colors.textSecondary, fontFamily: 'Inter_600SemiBold' },
  emptySubtitle: { ...typography.body, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
});
