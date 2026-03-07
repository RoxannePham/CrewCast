import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
  Platform, Image, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, radius, shadow } from '@/constants/theme';
import { Avatar } from '@/components/ui/Avatar';
import { StarRating } from '@/components/ui/StarRating';
import { Chip } from '@/components/ui/Chip';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { usePayments } from '@/context/PaymentContext';
import { PaymentReceipt } from '@/components/PaymentReceipt';
import { PaymentStatusBadge } from '@/components/PaymentReceipt';
import { mockWorkers } from '@/data/mockUsers';
import { EventRole, MockEvent } from '@/data/mockEvents';

function RoleCard({
  role,
  event,
  applied,
  onApply,
  applicants,
}: {
  role: EventRole;
  event: MockEvent;
  applied: boolean;
  onApply: () => void;
  applicants: number;
}) {
  const filled = role.filledSlots >= role.slots;
  return (
    <View style={[styles.roleCard, shadow.card]}>
      <View style={styles.roleHeader}>
        <View style={styles.roleLeft}>
          <Text style={styles.roleTitle}>{role.roleType}</Text>
          <Text style={styles.rolePay}>${role.pay}</Text>
        </View>
        <View style={styles.roleRight}>
          <Text style={styles.roleSlots}>
            {role.filledSlots}/{role.slots} filled
          </Text>
          <View style={[styles.slotBar]}>
            <View style={[styles.slotFill, { width: `${(role.filledSlots / role.slots) * 100}%` as any }]} />
          </View>
        </View>
      </View>
      <View style={styles.roleShift}>
        <Ionicons name="time-outline" size={14} color={colors.textMuted} />
        <Text style={styles.roleShiftText}>{role.shiftStart} – {role.shiftEnd}</Text>
        {applicants > 0 && <Text style={styles.roleApplicants}>{applicants} applied</Text>}
      </View>
      {role.notes ? <Text style={styles.roleNotes}>{role.notes}</Text> : null}
      <View style={styles.roleChips}>
        {role.tags.map(t => <Chip key={t} label={t} variant="default" />)}
      </View>
      <Pressable
        onPress={onApply}
        disabled={applied || filled}
        style={({ pressed }) => [
          styles.applyBtn,
          applied && styles.applyBtnApplied,
          filled && styles.applyBtnFilled,
          { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] }
        ]}
      >
        {!applied && !filled ? (
          <LinearGradient colors={['#FF8F9B', '#FF5E73']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.applyBtnGrad}>
            <Text style={styles.applyBtnText}>Apply Now</Text>
          </LinearGradient>
        ) : (
          <Text style={styles.applyBtnTextDisabled}>{filled ? 'Role Filled' : 'Applied'}</Text>
        )}
      </Pressable>
    </View>
  );
}

function ApplicantRow({ workerId, onPress }: { workerId: string; onPress: () => void }) {
  const worker = mockWorkers.find(w => w.id === workerId);
  if (!worker) return null;
  return (
    <Pressable onPress={onPress} style={[styles.applicantRow, shadow.card]}>
      <Avatar
        size={44}
        name={worker.name}
        imageSource={worker.portraitPath}
        backgroundColor={worker.avatarColor}
      />
      <View style={styles.applicantInfo}>
        <Text style={styles.applicantName}>{worker.name}</Text>
        <Text style={styles.applicantRole}>{worker.roles.join(', ')}</Text>
      </View>
      <StarRating rating={worker.rating} size={12} />
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </Pressable>
  );
}

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { getEventById, appliedRoles, applyToRole, getEventApplications } = useApp();
  const { user } = useAuth();
  const { getPaymentsByEvent } = usePayments();
  const [activeTab, setActiveTab] = useState<'overview' | 'roles' | 'crew'>('overview');

  const event = getEventById(id as string);
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const botPad = Platform.OS === 'web' ? 34 : insets.bottom;

  if (!event) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: colors.textMuted }}>Event not found</Text>
        <Pressable onPress={() => router.back()}><Text style={{ color: colors.accentPrimary }}>Go back</Text></Pressable>
      </View>
    );
  }

  const applications = getEventApplications(event.id);

  return (
    <View style={styles.container}>
      {/* Hero */}
      <View style={styles.heroContainer}>
        {event.coverImagePath ? (
          <Image source={event.coverImagePath} style={styles.heroImage} resizeMode="cover" />
        ) : (
          <LinearGradient colors={[event.themeColor + 'DD', event.themeColor + '88', '#F6F1E8']} style={styles.heroImage} />
        )}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.55)']}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.heroOverlay, { paddingTop: topPad + 8 }]}>
          <Pressable onPress={() => router.back()} style={[styles.backBtn, shadow.card]}>
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </Pressable>
          {event.isTonight && (
            <View style={styles.tonightBadge}>
              <Ionicons name="flash" size={12} color="#fff" />
              <Text style={styles.tonightText}>TONIGHT</Text>
            </View>
          )}
        </View>
        <View style={styles.heroTitle}>
          <Text style={styles.heroEventTitle}>{event.title}</Text>
          <View style={styles.heroSubRow}>
            <Text style={styles.heroOrg}>{event.orgName}</Text>
            {event.confirmedCrewIds.length > 0 && (
              <View style={styles.heroCrewChip}>
                <View style={styles.heroCrewDots}>
                  {event.confirmedCrewIds.slice(0, 3).map((wId, i) => {
                    const w = mockWorkers.find(x => x.id === wId);
                    if (!w) return null;
                    return (
                      <View key={wId} style={[styles.heroCrewDot, { marginLeft: i > 0 ? -6 : 0, zIndex: 3 - i }]}>
                        {w.portraitPath ? (
                          <Image source={w.portraitPath} style={styles.heroCrewDotImg} />
                        ) : (
                          <View style={[styles.heroCrewDotFb, { backgroundColor: w.avatarColor }]}>
                            <Text style={styles.heroCrewDotInit}>{w.name.charAt(0)}</Text>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
                <Text style={styles.heroCrewCount}>{event.confirmedCrewIds.length} crew</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(['overview', 'roles', 'crew'] as const).map(tab => (
          <Pressable key={tab} onPress={() => setActiveTab(tab)} style={[styles.tab, activeTab === tab && styles.tabActive]}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: botPad + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'overview' && (
          <View style={styles.section}>
            {/* Quick info cards */}
            <View style={styles.infoRow}>
              {[
                { icon: 'calendar-outline' as const, label: event.date },
                { icon: 'time-outline' as const, label: event.time },
                { icon: 'location-outline' as const, label: event.location },
                { icon: 'people-outline' as const, label: `${event.expectedAttendance} guests` },
              ].map((item, i) => (
                <View key={i} style={[styles.infoCard, shadow.card]}>
                  <Ionicons name={item.icon} size={18} color={colors.accentPrimary} />
                  <Text style={styles.infoLabel} numberOfLines={2}>{item.label}</Text>
                </View>
              ))}
            </View>

            <View style={[styles.descCard, shadow.card]}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.descText}>{event.description}</Text>
            </View>

            <View style={[styles.descCard, shadow.card]}>
              <Text style={styles.sectionTitle}>Dress Code & Vibe</Text>
              <View style={styles.vibeRow}>
                <Chip label={event.dressCode} variant="lavender" />
                {event.vibe.split(', ').map((v, i) => <Chip key={i} label={v} variant="default" />)}
              </View>
            </View>

            {event.hostNotes ? (
              <View style={[styles.notesCard, shadow.card]}>
                <Ionicons name="alert-circle-outline" size={16} color={colors.accentPeach} />
                <View style={styles.notesContent}>
                  <Text style={styles.notesTitle}>Host Notes</Text>
                  <Text style={styles.notesText}>{event.hostNotes}</Text>
                </View>
              </View>
            ) : null}

            <View style={[styles.descCard, shadow.card]}>
              <View style={styles.hostRow}>
                <Avatar size={44} name={event.hostName} backgroundColor={colors.accentPrimary + '30'} />
                <View style={styles.hostInfo}>
                  <Text style={styles.hostName}>{event.hostName}</Text>
                  <Text style={styles.hostOrg}>{event.orgName}</Text>
                </View>
                <Pressable style={styles.msgBtn}>
                  <Feather name="message-circle" size={18} color={colors.accentPrimary} />
                </Pressable>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'roles' && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Open Roles ({event.roles.length})</Text>
            {event.roles.map(role => {
              const roleApps = applications.filter(a => a.roleId === role.id);
              return (
                <RoleCard
                  key={role.id}
                  role={role}
                  event={event}
                  applied={appliedRoles.has(role.id)}
                  applicants={roleApps.length}
                  onApply={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    const result = applyToRole(role.id, event.id);
                    if (result.success) {
                      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                      Alert.alert('Applied!', `You applied for ${role.roleType}. The host will review your profile.`);
                    } else if (result.reason === 'already_applied') {
                      Alert.alert('Already Applied', 'You have already applied for this role.');
                    } else if (result.reason === 'host_user') {
                      Alert.alert('Host Account', 'Switch to a worker account to apply for gigs.');
                    }
                  }}
                />
              );
            })}
          </View>
        )}

        {activeTab === 'crew' && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Confirmed Crew</Text>
            {event.confirmedCrewIds.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={36} color={colors.textMuted} />
                <Text style={styles.emptyStateText}>No crew confirmed yet</Text>
              </View>
            ) : (
              event.confirmedCrewIds.map(wId => {
                const crewPayments = getPaymentsByEvent(event.id).filter(p => p.workerId === wId);
                const latestPayment = crewPayments.length > 0 ? crewPayments[crewPayments.length - 1] : null;
                return (
                  <View key={wId}>
                    <ApplicantRow workerId={wId} onPress={() => router.push(`/candidate/${wId}`)} />
                    {latestPayment && (
                      <View style={styles.crewPaymentBadge}>
                        <PaymentStatusBadge status={latestPayment.paymentStatus} type="payment" />
                        {(latestPayment.paymentStatus === 'completed' || latestPayment.paymentStatus === 'held') && (
                          <PaymentStatusBadge status={latestPayment.payoutStatus} type="payout" />
                        )}
                      </View>
                    )}
                  </View>
                );
              })
            )}
            <Text style={[styles.sectionHeader, { marginTop: spacing.md }]}>Applicants ({applications.length})</Text>
            {applications.slice(0, 6).map(app => (
              <ApplicantRow key={app.id} workerId={app.workerId} onPress={() => router.push(`/candidate/${app.workerId}`)} />
            ))}

            {(() => {
              const eventPayments = getPaymentsByEvent(event.id);
              if (eventPayments.length === 0) return null;
              return (
                <>
                  <Text style={[styles.sectionHeader, { marginTop: spacing.md }]}>Payment History</Text>
                  {eventPayments.map(payment => (
                    <PaymentReceipt key={payment.id} payment={payment} compact />
                  ))}
                  <View style={styles.paymentTrust}>
                    <Ionicons name="shield-checkmark-outline" size={14} color={colors.textMuted} />
                    <Text style={styles.paymentTrustText}>Protected payments through CrewCast</Text>
                  </View>
                </>
              );
            })()}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const HERO_HEIGHT = 300;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundPrimary },
  heroContainer: { height: HERO_HEIGHT, position: 'relative' },
  heroImage: { width: '100%', height: HERO_HEIGHT },
  heroOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: spacing.md,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center', justifyContent: 'center',
  },
  tonightBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.accentPrimary, borderRadius: radius.chip,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  tonightText: { fontSize: 11, fontFamily: 'Inter_700Bold', color: '#fff', letterSpacing: 1 },
  heroTitle: { position: 'absolute', bottom: 20, left: spacing.md, right: spacing.md },
  heroEventTitle: { fontSize: 24, fontFamily: 'Inter_700Bold', color: '#fff', textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  heroOrg: { fontSize: 13, fontFamily: 'Inter_500Medium', color: 'rgba(255,255,255,0.85)' },
  heroSubRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  heroCrewChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 4 },
  heroCrewDots: { flexDirection: 'row', alignItems: 'center' },
  heroCrewDot: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.8)', overflow: 'hidden' },
  heroCrewDotImg: { width: '100%', height: '100%' },
  heroCrewDotFb: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  heroCrewDotInit: { fontSize: 9, fontFamily: 'Inter_700Bold', color: '#fff' },
  heroCrewCount: { fontSize: 11, fontFamily: 'Inter_600SemiBold', color: '#fff' },
  tabs: { flexDirection: 'row', backgroundColor: colors.surfaceCard, marginHorizontal: spacing.md, borderRadius: radius.button, padding: 4, marginTop: spacing.md, marginBottom: 2 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: radius.button - 2 },
  tabActive: { backgroundColor: colors.backgroundPrimary },
  tabText: { fontSize: 13, fontFamily: 'Inter_500Medium', color: colors.textMuted },
  tabTextActive: { fontFamily: 'Inter_700Bold', color: colors.textPrimary },
  scrollContent: { paddingHorizontal: spacing.md, paddingTop: spacing.md },
  section: { gap: spacing.sm },
  infoRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  infoCard: { flex: 1, minWidth: '44%', backgroundColor: colors.surfaceCard, borderRadius: radius.card, padding: spacing.sm, gap: 4, alignItems: 'flex-start' },
  infoLabel: { ...typography.meta, color: colors.textPrimary, fontFamily: 'Inter_500Medium', lineHeight: 18 },
  descCard: { backgroundColor: colors.surfaceCard, borderRadius: radius.card, padding: spacing.md, gap: spacing.sm },
  sectionTitle: { ...typography.sectionTitle, color: colors.textPrimary, fontFamily: 'Inter_700Bold' },
  descText: { ...typography.body, color: colors.textSecondary, fontFamily: 'Inter_400Regular', lineHeight: 22 },
  vibeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  notesCard: { backgroundColor: colors.accentPeach + '20', borderRadius: radius.card, padding: spacing.md, flexDirection: 'row', gap: spacing.sm, borderWidth: 1.5, borderColor: colors.accentPeach + '50' },
  notesContent: { flex: 1, gap: 4 },
  notesTitle: { ...typography.bodyMedium, color: colors.textPrimary, fontFamily: 'Inter_600SemiBold' },
  notesText: { ...typography.meta, color: colors.textSecondary, fontFamily: 'Inter_400Regular', lineHeight: 18 },
  hostRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  hostInfo: { flex: 1, gap: 2 },
  hostName: { ...typography.body, color: colors.textPrimary, fontFamily: 'Inter_600SemiBold' },
  hostOrg: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
  msgBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.accentPrimary + '15', alignItems: 'center', justifyContent: 'center' },
  sectionHeader: { ...typography.sectionTitle, color: colors.textPrimary, fontFamily: 'Inter_700Bold', marginTop: spacing.sm },
  roleCard: { backgroundColor: colors.surfaceCard, borderRadius: radius.card, padding: spacing.md, gap: spacing.sm },
  roleHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  roleLeft: { gap: 2 },
  roleTitle: { fontSize: 17, fontFamily: 'Inter_700Bold', color: colors.textPrimary },
  rolePay: { fontSize: 22, fontFamily: 'Inter_700Bold', color: colors.accentPrimary },
  roleRight: { alignItems: 'flex-end', gap: 4 },
  roleSlots: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
  slotBar: { width: 80, height: 4, backgroundColor: colors.borderSubtle, borderRadius: 2 },
  slotFill: { height: 4, backgroundColor: colors.accentMint, borderRadius: 2 },
  roleShift: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  roleShiftText: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
  roleApplicants: { ...typography.meta, color: colors.accentLavender, fontFamily: 'Inter_500Medium', marginLeft: 'auto' },
  roleNotes: { ...typography.meta, color: colors.textSecondary, fontFamily: 'Inter_400Regular', lineHeight: 18 },
  roleChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  applyBtn: { borderRadius: radius.button, overflow: 'hidden' },
  applyBtnApplied: { backgroundColor: colors.accentMint + '40', borderRadius: radius.button, paddingVertical: 12, alignItems: 'center' },
  applyBtnFilled: { backgroundColor: colors.borderSubtle, borderRadius: radius.button, paddingVertical: 12, alignItems: 'center' },
  applyBtnGrad: { paddingVertical: 12, alignItems: 'center' },
  applyBtnText: { fontSize: 15, fontFamily: 'Inter_700Bold', color: '#fff' },
  applyBtnTextDisabled: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: colors.textMuted, paddingVertical: 12 },
  applicantRow: { backgroundColor: colors.surfaceCard, borderRadius: radius.card, padding: spacing.sm, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  applicantInfo: { flex: 1, gap: 2 },
  applicantName: { ...typography.body, color: colors.textPrimary, fontFamily: 'Inter_600SemiBold' },
  applicantRole: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xl, gap: spacing.sm },
  emptyStateText: { ...typography.body, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
  crewPaymentBadge: { flexDirection: 'row', gap: 6, marginLeft: spacing.xl, marginTop: -4, marginBottom: 4 },
  paymentTrust: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 8 },
  paymentTrustText: { fontSize: 11, fontFamily: 'Inter_400Regular', color: colors.textMuted },
});
