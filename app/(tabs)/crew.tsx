import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, Pressable,
  Platform, ScrollView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, radius, shadow } from '@/constants/theme';
import { Avatar } from '@/components/ui/Avatar';
import { SearchBar } from '@/components/ui/SearchBar';
import { StarRating } from '@/components/ui/StarRating';
import { Badge } from '@/components/ui/Badge';
import { useChat } from '@/context/ChatContext';
import { useApp } from '@/context/AppContext';
import { WorkerProfile } from '@/data/mockUsers';

type CrewTab = 'workers' | 'chats';

function WorkerSearchCard({ worker, onPress }: { worker: WorkerProfile; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.workerCard, shadow.card, { transform: [{ scale: pressed ? 0.98 : 1 }] }]}
    >
      <Avatar size={54} name={worker.name} imageSource={worker.portraitPath} backgroundColor={worker.avatarColor} />
      <View style={styles.workerInfo}>
        <View style={styles.workerNameRow}>
          <Text style={styles.workerName} numberOfLines={1}>{worker.name}</Text>
          {worker.isTopRated && <Badge variant="topRated" />}
        </View>
        <Text style={styles.workerRoles}>{worker.roles.join(' · ')}</Text>
        <Text style={styles.workerSchool} numberOfLines={1}>{worker.school} · {worker.city}</Text>
        <View style={styles.workerMeta}>
          <StarRating rating={worker.rating} size={11} />
          <Text style={styles.workerGigs}>{worker.gigs} gigs</Text>
          {worker.isOnTime && (
            <View style={styles.onTimeBadge}>
              <Text style={styles.onTimeBadgeText}>On Time</Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.workerAvailability}>
        {worker.availability.slice(0, 3).map((d: string) => (
          <View key={d} style={styles.availDay}>
            <Text style={styles.availDayText}>{d.slice(0, 2)}</Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
}

function ChatRow({ chat, onPress }: { chat: any; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.chatRow, shadow.card, { opacity: pressed ? 0.9 : 1 }]}
    >
      <View style={[styles.chatAvatar, { backgroundColor: chat.avatarColor + '40' }]}>
        <Ionicons name={chat.type === 'group' ? 'people' : 'person'} size={22} color={chat.avatarColor} />
      </View>
      <View style={styles.chatInfo}>
        <View style={styles.chatTitleRow}>
          <Text style={styles.chatTitle} numberOfLines={1}>{chat.title}</Text>
          <Text style={styles.chatTime}>{chat.lastMessageTime}</Text>
        </View>
        <View style={styles.chatLastRow}>
          <Text style={styles.chatLastMsg} numberOfLines={1}>{chat.lastMessage}</Text>
          {chat.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{chat.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const ROLE_CHIPS = ['All', 'DJ', 'Photographer', 'Videographer', 'Host/MC', 'Content Creator', 'Bartender'];

export default function CrewScreen() {
  const insets = useSafeAreaInsets();
  const { workers } = useApp();
  const { chats, totalUnread } = useChat();
  const [activeTab, setActiveTab] = useState<CrewTab>('workers');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const filteredWorkers = workers.filter(w => {
    const matchRole = roleFilter === 'All' || w.roles.includes(roleFilter as any);
    const matchSearch = !searchQuery ||
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.roles.some(r => r.toLowerCase().includes(searchQuery.toLowerCase())) ||
      w.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchRole && matchSearch;
  });

  const topRated = filteredWorkers.filter(w => w.isTopRated);
  const others = filteredWorkers.filter(w => !w.isTopRated);
  const displayWorkers = [...topRated, ...others];

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Crew</Text>
          {activeTab === 'chats' && totalUnread > 0 && (
            <View style={styles.unreadCountBadge}>
              <Text style={styles.unreadCountText}>{totalUnread}</Text>
            </View>
          )}
        </View>
        <View style={styles.tabs}>
          <Pressable onPress={() => setActiveTab('workers')} style={[styles.tab, activeTab === 'workers' && styles.tabActive]}>
            <Text style={[styles.tabText, activeTab === 'workers' && styles.tabTextActive]}>Workers</Text>
          </Pressable>
          <Pressable onPress={() => setActiveTab('chats')} style={[styles.tab, activeTab === 'chats' && styles.tabActive]}>
            <Text style={[styles.tabText, activeTab === 'chats' && styles.tabTextActive]}>Messages</Text>
            {totalUnread > 0 && (
              <View style={styles.tabBadge}><Text style={styles.tabBadgeText}>{totalUnread}</Text></View>
            )}
          </Pressable>
        </View>
        {activeTab === 'workers' && (
          <>
            <SearchBar placeholder="Search workers, roles, skills..." value={searchQuery} onChangeText={setSearchQuery} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.roleChips}>
              {ROLE_CHIPS.map(chip => (
                <Pressable
                  key={chip}
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setRoleFilter(chip); }}
                  style={[styles.roleChip, roleFilter === chip && styles.roleChipActive]}
                >
                  <Text style={[styles.roleChipText, roleFilter === chip && styles.roleChipTextActive]}>{chip}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </>
        )}
      </View>

      {activeTab === 'workers' && (
        <FlatList
          data={displayWorkers}
          keyExtractor={w => w.id}
          renderItem={({ item }) => (
            <WorkerSearchCard worker={item} onPress={() => router.push(`/candidate/${item.id}`)} />
          )}
          contentContainerStyle={[styles.list, { paddingBottom: Platform.OS === 'web' ? 84 : 100 }]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            topRated.length > 0 ? (
              <View style={styles.listHeader}>
                <Ionicons name="star" size={13} color={colors.starGold} />
                <Text style={styles.listHeaderText}>{topRated.length} Top Rated · {displayWorkers.length} total workers</Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>No workers found</Text>
              <Text style={styles.emptySubtitle}>Try a different search or filter</Text>
            </View>
          }
        />
      )}

      {activeTab === 'chats' && (
        <FlatList
          data={chats}
          keyExtractor={c => c.id}
          renderItem={({ item }) => (
            <ChatRow chat={item} onPress={() => router.push(`/messages/${item.id}`)} />
          )}
          contentContainerStyle={[styles.list, { paddingBottom: Platform.OS === 'web' ? 84 : 100 }]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="chatbubbles-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>No messages yet</Text>
              <Text style={styles.emptySubtitle}>Get booked to join a crew chat!</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundPrimary },
  header: { paddingHorizontal: spacing.md, gap: spacing.sm, paddingBottom: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  title: { fontSize: 28, fontFamily: 'Inter_700Bold', color: colors.textPrimary },
  unreadCountBadge: { backgroundColor: colors.accentPrimary, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3 },
  unreadCountText: { fontSize: 12, fontFamily: 'Inter_700Bold', color: '#fff' },
  tabs: { flexDirection: 'row', backgroundColor: colors.surfaceCard, borderRadius: radius.button, padding: 4 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: radius.button - 2, flexDirection: 'row', justifyContent: 'center', gap: 6 },
  tabActive: { backgroundColor: colors.backgroundPrimary },
  tabText: { fontSize: 14, fontFamily: 'Inter_500Medium', color: colors.textMuted },
  tabTextActive: { fontFamily: 'Inter_700Bold', color: colors.textPrimary },
  tabBadge: { backgroundColor: colors.accentPrimary, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  tabBadgeText: { fontSize: 10, fontFamily: 'Inter_700Bold', color: '#fff' },
  roleChips: { gap: 8, paddingBottom: 4 },
  roleChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: radius.chip, backgroundColor: colors.surfaceCard, borderWidth: 1.5, borderColor: colors.borderSubtle },
  roleChipActive: { backgroundColor: colors.accentPrimary, borderColor: colors.accentPrimary },
  roleChipText: { fontSize: 13, fontFamily: 'Inter_500Medium', color: colors.textSecondary },
  roleChipTextActive: { color: '#fff', fontFamily: 'Inter_600SemiBold' },
  list: { paddingHorizontal: spacing.md, paddingTop: spacing.sm, gap: spacing.sm },
  listHeader: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 4 },
  listHeaderText: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_500Medium' },
  workerCard: { backgroundColor: colors.surfaceCard, borderRadius: radius.card, padding: spacing.md, flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  workerInfo: { flex: 1, gap: 3 },
  workerNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  workerName: { fontSize: 16, fontFamily: 'Inter_700Bold', color: colors.textPrimary },
  workerRoles: { ...typography.body, color: colors.accentPrimary, fontFamily: 'Inter_600SemiBold' },
  workerSchool: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
  workerMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
  workerGigs: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
  onTimeBadge: { backgroundColor: colors.accentMint + '60', borderRadius: radius.chip, paddingHorizontal: 7, paddingVertical: 2 },
  onTimeBadgeText: { fontSize: 10, fontFamily: 'Inter_600SemiBold', color: '#1A6635' },
  workerAvailability: { gap: 3, alignItems: 'center' },
  availDay: { width: 28, height: 22, borderRadius: 6, backgroundColor: colors.accentLavender + '30', alignItems: 'center', justifyContent: 'center' },
  availDayText: { fontSize: 10, fontFamily: 'Inter_600SemiBold', color: colors.accentLavender },
  chatRow: { backgroundColor: colors.surfaceCard, borderRadius: radius.card, padding: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  chatAvatar: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  chatInfo: { flex: 1, gap: 4 },
  chatTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chatTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: colors.textPrimary, flex: 1, marginRight: spacing.sm },
  chatTime: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
  chatLastRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  chatLastMsg: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_400Regular', flex: 1, marginRight: spacing.sm },
  unreadBadge: { backgroundColor: colors.accentPrimary, borderRadius: 10, minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
  unreadText: { fontSize: 11, fontFamily: 'Inter_700Bold', color: '#fff' },
  emptyState: { alignItems: 'center', paddingVertical: 80, gap: spacing.md },
  emptyTitle: { ...typography.sectionTitle, color: colors.textSecondary, fontFamily: 'Inter_600SemiBold' },
  emptySubtitle: { ...typography.body, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
});
