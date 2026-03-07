import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, Pressable,
  Platform, KeyboardAvoidingView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, radius, shadow } from '@/constants/theme';
import { Avatar } from '@/components/ui/Avatar';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import { ChatMessage } from '@/data/mockChats';

function MessageBubble({ msg, isMine }: { msg: ChatMessage; isMine: boolean }) {
  return (
    <View style={[styles.bubbleRow, isMine && styles.bubbleRowMine]}>
      {!isMine && (
        <Avatar size={30} name={msg.senderName} backgroundColor={msg.senderAvatarColor} />
      )}
      <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleOther]}>
        {!isMine && <Text style={styles.bubbleSender}>{msg.senderName}</Text>}
        <Text style={[styles.bubbleText, isMine && styles.bubbleTextMine]}>{msg.text}</Text>
        <Text style={[styles.bubbleTime, isMine && styles.bubbleTimeMine]}>{msg.timestamp}</Text>
      </View>
    </View>
  );
}

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { getChat, sendMessage, markChatRead } = useChat();
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const listRef = useRef<FlatList>(null);

  const chat = getChat(id as string);
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const botPad = Platform.OS === 'web' ? 34 : insets.bottom;

  useEffect(() => {
    if (chat?.id) markChatRead(chat.id);
  }, [chat?.id]);

  if (!chat) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: colors.textMuted }}>Chat not found</Text>
        <Pressable onPress={() => router.back()}><Text style={{ color: colors.accentPrimary }}>Go back</Text></Pressable>
      </View>
    );
  }

  const myId = user?.id || 'w1';
  const myName = user?.name || 'Alex Kim';
  const myColor = '#CDB9FF';

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    sendMessage(chat.id, myId, myName, myColor, text);
    setInputText('');
  };

  const pinnedInfo = chat.pinnedInfo;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, shadow.card]}>
          <Ionicons name="chevron-back" size={22} color={colors.textSecondary} />
        </Pressable>
        <View style={styles.headerInfo}>
          <View style={[styles.chatAvatarSmall, { backgroundColor: chat.avatarColor + '40' }]}>
            <Ionicons name={chat.type === 'group' ? 'people' : 'person'} size={18} color={chat.avatarColor} />
          </View>
          <View>
            <Text style={styles.chatTitle} numberOfLines={1}>{chat.title}</Text>
            <Text style={styles.chatMemberCount}>{chat.participantNames.length} members</Text>
          </View>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Pinned info */}
      {pinnedInfo && (
        <View style={styles.pinnedBanner}>
          <Ionicons name="pin" size={14} color={colors.accentPrimary} />
          <View style={styles.pinnedContent}>
            <Text style={styles.pinnedTitle}>Call time: {pinnedInfo.callTime}</Text>
            <Text style={styles.pinnedText} numberOfLines={1}>{pinnedInfo.location}</Text>
          </View>
          <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
        </View>
      )}

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={chat.messages}
        keyExtractor={m => m.id}
        renderItem={({ item }) => (
          <MessageBubble msg={item} isMine={item.senderId === myId} />
        )}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
      />

      {/* Input */}
      <View style={[styles.inputBar, { paddingBottom: botPad + 8 }]}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Message..."
          placeholderTextColor={colors.textMuted}
          multiline
          maxLength={500}
          onSubmitEditing={handleSend}
        />
        <Pressable
          onPress={handleSend}
          disabled={!inputText.trim()}
          style={({ pressed }) => [
            styles.sendBtn,
            { opacity: !inputText.trim() ? 0.5 : pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.9 : 1 }] }
          ]}
        >
          <Ionicons name="send" size={20} color="#fff" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundPrimary },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingBottom: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: colors.borderSubtle,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceCard, alignItems: 'center', justifyContent: 'center' },
  headerInfo: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1, marginHorizontal: spacing.sm },
  chatAvatarSmall: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  chatTitle: { fontSize: 15, fontFamily: 'Inter_700Bold', color: colors.textPrimary },
  chatMemberCount: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
  pinnedBanner: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.accentPrimary + '10', paddingHorizontal: spacing.md, paddingVertical: 8,
    borderBottomWidth: 1, borderBottomColor: colors.borderSubtle,
  },
  pinnedContent: { flex: 1, gap: 1 },
  pinnedTitle: { ...typography.meta, color: colors.accentPrimary, fontFamily: 'Inter_600SemiBold' },
  pinnedText: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
  messageList: { paddingHorizontal: spacing.md, paddingVertical: spacing.md, gap: spacing.sm },
  bubbleRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 4 },
  bubbleRowMine: { flexDirection: 'row-reverse' },
  bubble: { maxWidth: '78%', borderRadius: radius.card, padding: spacing.sm + 2, gap: 2 },
  bubbleMine: { backgroundColor: colors.accentPrimary },
  bubbleOther: { backgroundColor: colors.surfaceCard },
  bubbleSender: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_600SemiBold', marginBottom: 1 },
  bubbleText: { ...typography.body, color: colors.textPrimary, fontFamily: 'Inter_400Regular', lineHeight: 20 },
  bubbleTextMine: { color: '#fff' },
  bubbleTime: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_400Regular', fontSize: 10, alignSelf: 'flex-end' },
  bubbleTimeMine: { color: 'rgba(255,255,255,0.7)' },
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm,
    paddingHorizontal: spacing.md, paddingTop: spacing.sm,
    backgroundColor: colors.surfaceCard, borderTopWidth: 1, borderTopColor: colors.borderSubtle,
  },
  input: {
    flex: 1, fontSize: 15, color: colors.textPrimary, fontFamily: 'Inter_400Regular',
    backgroundColor: colors.backgroundPrimary, borderRadius: radius.button,
    paddingHorizontal: spacing.md, paddingVertical: 10, maxHeight: 100,
    borderWidth: 1.5, borderColor: colors.borderSubtle,
  },
  sendBtn: {
    width: 42, height: 42, borderRadius: 21, backgroundColor: colors.accentPrimary,
    alignItems: 'center', justifyContent: 'center',
  },
});
