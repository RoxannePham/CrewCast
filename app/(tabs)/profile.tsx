import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Platform, Switch
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, radius, shadow } from '@/constants/theme';
import { Avatar } from '@/components/ui/Avatar';
import { StarRating } from '@/components/ui/StarRating';
import { Badge } from '@/components/ui/Badge';
import { Chip } from '@/components/ui/Chip';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationsContext';
import { useApp } from '@/context/AppContext';
import { WorkerProfile } from '@/data/mockUsers';

function StatBox({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <View style={[styles.statBox, shadow.card]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const { unreadCount } = useNotifications();
  const { applications, bookedWorkers } = useApp();
  const [notifOn, setNotifOn] = useState(true);
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const botPad = Platform.OS === 'web' ? 34 : insets.bottom;

  if (!user) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Ionicons name="person-outline" size={60} color={colors.textMuted} />
        <Text style={styles.noUserTitle}>Not signed in</Text>
        <Pressable onPress={() => router.push('/auth/login')} style={styles.signInBtn}>
          <Text style={styles.signInBtnText}>Sign In</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/onboarding')} style={styles.signUpLink}>
          <Text style={styles.signUpLinkText}>Create an account</Text>
        </Pressable>
      </View>
    );
  }

  const isWorker = user.type === 'worker';
  const worker = isWorker ? (user as WorkerProfile) : null;
  const myApplications = applications.filter(a => a.workerId === user.id);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: topPad + 12, paddingBottom: botPad + 80 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header with notification button */}
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.push('/notifications')}
          style={[styles.iconBtn, shadow.card]}
        >
          <Ionicons name="notifications-outline" size={20} color={colors.textSecondary} />
          {unreadCount > 0 && <View style={styles.notifDot}><Text style={styles.notifDotText}>{unreadCount}</Text></View>}
        </Pressable>
        <Pressable onPress={async () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          await signOut();
          router.replace('/onboarding');
        }} style={[styles.iconBtn, shadow.card]}>
          <Ionicons name="log-out-outline" size={20} color={colors.textSecondary} />
        </Pressable>
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <LinearGradient
          colors={[user.avatarColor + '60', user.avatarColor + '20', colors.backgroundPrimary]}
          style={StyleSheet.absoluteFill}
        />
        <Avatar
          size={100}
          name={user.name}
          imageSource={isWorker && worker ? worker.portraitPath : null}
          backgroundColor={user.avatarColor}
          showBorder
        />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.school}>{isWorker ? (user as WorkerProfile).school : (user as any).orgName}</Text>
        {isWorker && worker && (
          <View style={styles.badgeRow}>
            {worker.isTopRated && <Badge variant="topRated" />}
            {worker.isOnTime && <Badge variant="onTime" />}
            {worker.isCampusVerified && <Badge variant="campusVerified" />}
          </View>
        )}
        {isWorker && worker && <StarRating rating={worker.rating} size={14} showCount count={worker.gigs} />}
      </View>

      {/* Stats */}
      {isWorker && worker && (
        <View style={styles.statsRow}>
          <StatBox label="Gigs" value={worker.gigs} color={colors.accentPrimary} />
          <StatBox label="Rating" value={`${worker.rating}★`} color={colors.starGold} />
          <StatBox label="On Time" value={`${worker.onTimePercent}%`} color={colors.accentMint.replace('BFF0D4', '#1A6635')} />
          <StatBox label="Applied" value={myApplications.length} color={colors.accentLavender} />
        </View>
      )}

      {/* Roles & Skills */}
      {isWorker && worker && (
        <View style={[styles.card, shadow.card]}>
          <Text style={styles.cardTitle}>Roles</Text>
          <View style={styles.chipRow}>
            {worker.roles.map(r => <Chip key={r} label={r} variant="pink" />)}
          </View>
          <Text style={[styles.cardTitle, { marginTop: 8 }]}>Skills</Text>
          <View style={styles.chipRow}>
            {worker.skills.map(s => <Chip key={s} label={s} variant="default" />)}
          </View>
        </View>
      )}

      {/* Applications */}
      {isWorker && myApplications.length > 0 && (
        <View style={[styles.card, shadow.card]}>
          <Text style={styles.cardTitle}>My Applications</Text>
          {myApplications.slice(0, 5).map(app => (
            <View key={app.id} style={styles.appRow}>
              <View style={[styles.appStatus, { backgroundColor: STATUS_COLORS[app.status] + '20' }]}>
                <Text style={[styles.appStatusText, { color: STATUS_COLORS[app.status] }]}>{app.status}</Text>
              </View>
              <View style={styles.appInfo}>
                <Text style={styles.appRoleId}>{app.roleId}</Text>
                <Text style={styles.appTime}>{app.appliedAt}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Settings */}
      <View style={[styles.card, shadow.card]}>
        <Text style={styles.cardTitle}>Settings</Text>
        {[
          { icon: 'person-outline' as const, label: 'Edit Profile' },
          { icon: 'notifications-outline' as const, label: 'Notifications', badge: unreadCount },
          { icon: 'mail-outline' as const, label: 'Messages', onPress: () => router.push('/messages') },
          { icon: 'shield-checkmark-outline' as const, label: 'Privacy & Safety' },
          { icon: 'help-circle-outline' as const, label: 'Help & Support' },
        ].map(item => (
          <Pressable key={item.label} onPress={item.onPress} style={styles.settingRow}>
            <View style={[styles.settingIconWrap, { backgroundColor: colors.accentLavender + '25' }]}>
              <Ionicons name={item.icon} size={18} color={colors.accentLavender} />
            </View>
            <Text style={styles.settingLabel}>{item.label}</Text>
            <View style={styles.settingRight}>
              {item.badge && item.badge > 0 ? (
                <View style={styles.settingBadge}><Text style={styles.settingBadgeText}>{item.badge}</Text></View>
              ) : null}
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </View>
          </Pressable>
        ))}
        <View style={styles.settingRow}>
          <View style={[styles.settingIconWrap, { backgroundColor: colors.accentPrimary + '15' }]}>
            <Ionicons name="notifications-outline" size={18} color={colors.accentPrimary} />
          </View>
          <Text style={styles.settingLabel}>Push Notifications</Text>
          <Switch
            value={notifOn}
            onValueChange={v => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setNotifOn(v); }}
            trackColor={{ false: colors.borderSubtle, true: colors.accentPrimary + '80' }}
            thumbColor={notifOn ? colors.accentPrimary : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Sign out */}
      <Pressable
        onPress={async () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          await signOut();
          router.replace('/onboarding');
        }}
        style={({ pressed }) => [styles.signOutBtn, { opacity: pressed ? 0.85 : 1 }]}
      >
        <Text style={styles.signOutText}>Sign Out</Text>
      </Pressable>
    </ScrollView>
  );
}

const STATUS_COLORS: Record<string, string> = {
  pending: colors.starGold,
  shortlisted: colors.accentLavender,
  messaged: colors.accentBlue,
  booked: '#1A6635',
  accepted: '#1A6635',
  declined: colors.accentPrimary,
  withdrawn: colors.textMuted,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundPrimary },
  content: { paddingHorizontal: spacing.md, gap: spacing.md },
  centered: { alignItems: 'center', justifyContent: 'center' },
  topBar: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.sm },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surfaceCard, alignItems: 'center', justifyContent: 'center' },
  notifDot: { position: 'absolute', top: 8, right: 8, width: 14, height: 14, borderRadius: 7, backgroundColor: colors.accentPrimary, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.backgroundPrimary },
  notifDotText: { fontSize: 7, fontFamily: 'Inter_700Bold', color: '#fff' },
  hero: { alignItems: 'center', paddingVertical: spacing.lg, gap: spacing.sm, borderRadius: radius.card, overflow: 'hidden' },
  name: { fontSize: 26, fontFamily: 'Inter_700Bold', color: colors.textPrimary },
  school: { ...typography.body, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
  badgeRow: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap', justifyContent: 'center' },
  statsRow: { flexDirection: 'row', gap: spacing.sm },
  statBox: { flex: 1, backgroundColor: colors.surfaceCard, borderRadius: radius.card, padding: spacing.sm, alignItems: 'center', gap: 3 },
  statValue: { fontSize: 20, fontFamily: 'Inter_700Bold' },
  statLabel: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  card: { backgroundColor: colors.surfaceCard, borderRadius: radius.card, padding: spacing.md, gap: spacing.sm },
  cardTitle: { ...typography.sectionTitle, color: colors.textPrimary, fontFamily: 'Inter_700Bold' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  appRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  appStatus: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.chip },
  appStatusText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  appInfo: { flex: 1, gap: 1 },
  appRoleId: { ...typography.meta, color: colors.textSecondary, fontFamily: 'Inter_500Medium' },
  appTime: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 6 },
  settingIconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  settingLabel: { flex: 1, ...typography.body, color: colors.textPrimary, fontFamily: 'Inter_500Medium' },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  settingBadge: { backgroundColor: colors.accentPrimary, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 },
  settingBadgeText: { fontSize: 10, fontFamily: 'Inter_700Bold', color: '#fff' },
  signOutBtn: { backgroundColor: colors.accentPrimary + '15', borderRadius: radius.button, paddingVertical: 14, alignItems: 'center', marginTop: spacing.sm },
  signOutText: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: colors.accentPrimary },
  noUserTitle: { fontSize: 22, fontFamily: 'Inter_700Bold', color: colors.textSecondary, marginTop: spacing.md },
  signInBtn: { backgroundColor: colors.accentPrimary, borderRadius: radius.button, paddingVertical: 14, paddingHorizontal: spacing.xxl, marginTop: spacing.md },
  signInBtnText: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#fff' },
  signUpLink: { marginTop: spacing.sm },
  signUpLinkText: { ...typography.body, color: colors.accentPrimary, fontFamily: 'Inter_600SemiBold' },
});
