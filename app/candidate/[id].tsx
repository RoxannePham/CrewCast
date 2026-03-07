import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
  Platform, Linking
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
import { Badge } from '@/components/ui/Badge';
import { PaymentSheet } from '@/components/PaymentSheet';
import { PaymentReceipt } from '@/components/PaymentReceipt';
import { mockWorkers } from '@/data/mockUsers';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { usePayments } from '@/context/PaymentContext';

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: colors.accentPeach + '30', text: '#8B5A00' },
  shortlisted: { bg: colors.accentLavender + '30', text: '#5B2B8F' },
  booked: { bg: colors.accentMint + '30', text: '#1A6635' },
  accepted: { bg: colors.accentMint + '30', text: '#1A6635' },
  declined: { bg: colors.accentPrimary + '20', text: '#AA2244' },
  messaged: { bg: colors.accentBlue + '30', text: '#1A4D80' },
  withdrawn: { bg: colors.borderSubtle, text: colors.textMuted },
};

export default function CandidateDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { bookWorker, bookedWorkers, getApplicationsByWorker, getEventById } = useApp();
  const { user } = useAuth();
  const {
    createPayment, processPayment, getPaymentForApplication,
    paymentMethods, selectedPaymentMethod, setSelectedPaymentMethod,
  } = usePayments();
  const [activeTab, setActiveTab] = useState<'profile' | 'reviews' | 'stats'>('profile');
  const [booked, setBooked] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const isHost = user?.type === 'host';

  const worker = mockWorkers.find(w => w.id === id);
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const botPad = Platform.OS === 'web' ? 34 : insets.bottom;

  if (!worker) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: colors.textMuted }}>Worker not found</Text>
        <Pressable onPress={() => router.back()}><Text style={{ color: colors.accentPrimary }}>Go back</Text></Pressable>
      </View>
    );
  }

  const isBooked = booked || bookedWorkers.has(worker.id);
  const workerApps = getApplicationsByWorker(worker.id);
  const reliabilityPct = Math.round(worker.reliabilityScore * 100);

  const bookedApp = workerApps.find(a => a.status === 'booked' || a.status === 'accepted');
  const existingPayment = bookedApp ? getPaymentForApplication(bookedApp.id) : undefined;
  const paymentCompleted = existingPayment?.paymentStatus === 'completed';

  const paymentEvent = bookedApp ? getEventById(bookedApp.eventId) : undefined;
  const paymentRole = paymentEvent?.roles.find(r => r.id === bookedApp?.roleId);
  const payAmount = paymentRole?.pay || 125;

  const handlePayWorker = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowPayment(true);
  };

  const handleConfirmPayment = async () => {
    if (!bookedApp || !user) return;
    const event = getEventById(bookedApp.eventId);
    const role = event?.roles.find(r => r.id === bookedApp.roleId);

    const payment = createPayment({
      eventId: bookedApp.eventId,
      applicationId: bookedApp.id,
      hostId: user.id,
      workerId: worker.id,
      workerName: worker.name,
      eventTitle: event?.title || 'Event',
      roleType: role?.roleType || 'Crew',
      amountTotal: payAmount,
      paymentMethod: selectedPaymentMethod,
    });

    await processPayment(payment.id);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.hero, { paddingTop: topPad + 8 }]}>
        <LinearGradient colors={[worker.avatarColor + 'AA', worker.avatarColor + '33', colors.backgroundPrimary]} style={StyleSheet.absoluteFill} />
        <View style={styles.heroHeader}>
          <Pressable onPress={() => router.back()} style={[styles.backBtn, shadow.card]}>
            <Ionicons name="chevron-back" size={22} color={colors.textSecondary} />
          </Pressable>
          <Pressable onPress={() => router.push('/messages/dm1')} style={[styles.msgBtn, shadow.card]}>
            <Feather name="message-circle" size={20} color={colors.accentPrimary} />
          </Pressable>
        </View>
        <View style={styles.profileArea}>
          <Avatar
            size={90}
            name={worker.name}
            imageSource={worker.portraitPath}
            backgroundColor={worker.avatarColor}
            showBorder
          />
          <Text style={styles.workerName}>{worker.name}</Text>
          <Text style={styles.workerSchool}>{worker.school} &middot; {worker.city}</Text>
          <View style={styles.ratingRow}>
            <StarRating rating={worker.rating} size={14} />
            <Text style={styles.ratingText}>{worker.rating} ({worker.gigs} gigs)</Text>
          </View>
          <View style={styles.badgeRow}>
            {worker.isTopRated && <Badge variant="topRated" />}
            {worker.isOnTime && <Badge variant="onTime" />}
            {worker.isCampusVerified && <Badge variant="campusVerified" />}
          </View>
        </View>
      </View>

      <View style={styles.tabs}>
        {(['profile', 'reviews', 'stats'] as const).map(tab => (
          <Pressable key={tab} onPress={() => setActiveTab(tab)} style={[styles.tab, activeTab === tab && styles.tabActive]}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: botPad + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'profile' && (
          <View style={styles.section}>
            <View style={[styles.card, shadow.card]}>
              <Text style={styles.cardTitle}>About</Text>
              <Text style={styles.bioText}>{worker.bio}</Text>
            </View>
            <View style={[styles.card, shadow.card]}>
              <Text style={styles.cardTitle}>Roles</Text>
              <View style={styles.chipGrid}>
                {worker.roles.map(r => <Chip key={r} label={r} variant="pink" />)}
              </View>
            </View>
            <View style={[styles.card, shadow.card]}>
              <Text style={styles.cardTitle}>Skills</Text>
              <View style={styles.chipGrid}>
                {worker.skills.map(s => <Chip key={s} label={s} variant="default" />)}
              </View>
            </View>
            <View style={[styles.card, shadow.card]}>
              <Text style={styles.cardTitle}>Details</Text>
              {[
                { icon: 'school-outline' as const, label: worker.school },
                { icon: 'location-outline' as const, label: worker.city },
                { icon: 'calendar-outline' as const, label: `Available: ${worker.availability.join(', ')}` },
                { icon: 'cash-outline' as const, label: worker.payPreference },
                { icon: 'briefcase-outline' as const, label: `${worker.yearsExperience} yrs experience` },
              ].filter(i => !!i.label).map((item, idx) => (
                <View key={idx} style={styles.detailRow}>
                  <Ionicons name={item.icon} size={16} color={colors.textMuted} />
                  <Text style={styles.detailText}>{item.label}</Text>
                </View>
              ))}
            </View>
            {worker.portfolioLinks.length > 0 && (
              <View style={[styles.card, shadow.card]}>
                <Text style={styles.cardTitle}>Portfolio & Links</Text>
                {worker.portfolioLinks.map(link => (
                  <Pressable key={link} onPress={() => Linking.openURL(`https://${link}`)} style={styles.linkRow}>
                    <Ionicons name="link-outline" size={16} color={colors.accentPrimary} />
                    <Text style={styles.linkText}>{link}</Text>
                  </Pressable>
                ))}
                {worker.socialLinks.instagram && (
                  <Pressable style={styles.linkRow}>
                    <Ionicons name="logo-instagram" size={16} color="#E1306C" />
                    <Text style={styles.linkText}>{worker.socialLinks.instagram}</Text>
                  </Pressable>
                )}
                {worker.socialLinks.tiktok && (
                  <Pressable style={styles.linkRow}>
                    <Feather name="music" size={16} color={colors.textPrimary} />
                    <Text style={styles.linkText}>{worker.socialLinks.tiktok}</Text>
                  </Pressable>
                )}
              </View>
            )}

            {workerApps.length > 0 && (
              <View style={[styles.card, shadow.card]}>
                <Text style={styles.cardTitle}>Applications ({workerApps.length})</Text>
                {workerApps.map(app => {
                  const statusColor = STATUS_COLORS[app.status] || STATUS_COLORS.pending;
                  return (
                    <View key={app.id} style={styles.appRow}>
                      <View style={styles.appRowLeft}>
                        <View style={[styles.statusDot, { backgroundColor: statusColor.text }]} />
                        <View style={styles.appRowInfo}>
                          <Text style={styles.appRowNote} numberOfLines={2}>{app.note}</Text>
                          <Text style={styles.appRowTime}>{app.appliedAt}</Text>
                        </View>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
                        <Text style={[styles.statusBadgeText, { color: statusColor.text }]}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </Text>
                      </View>
                    </View>
                  );
                })}
                {workerApps.some(a => a.resumeUri) && (
                  <View style={styles.resumeIndicator}>
                    <Ionicons name="document-text-outline" size={16} color={colors.accentPrimary} />
                    <Text style={styles.resumeIndicatorText}>Resume attached</Text>
                  </View>
                )}
                {workerApps.some(a => a.profileSummary) && (
                  <View style={[styles.summaryCard]}>
                    <Ionicons name="sparkles-outline" size={16} color={colors.accentLavender} />
                    <View style={styles.summaryInfo}>
                      <Text style={styles.summaryTitle}>Profile Summary</Text>
                      <Text style={styles.summaryText}>
                        {workerApps.find(a => a.profileSummary)?.profileSummary}
                      </Text>
                    </View>
                  </View>
                )}
                {workerApps.some(a => a.portfolioUrl) && (
                  <Pressable
                    onPress={() => {
                      const url = workerApps.find(a => a.portfolioUrl)?.portfolioUrl;
                      if (url) Linking.openURL(url.startsWith('http') ? url : `https://${url}`);
                    }}
                    style={styles.linkRow}
                  >
                    <Ionicons name="globe-outline" size={16} color={colors.accentBlue} />
                    <Text style={styles.linkText}>{workerApps.find(a => a.portfolioUrl)?.portfolioUrl}</Text>
                  </Pressable>
                )}
                {workerApps.some(a => a.linkedinUrl) && (
                  <Pressable
                    onPress={() => {
                      const url = workerApps.find(a => a.linkedinUrl)?.linkedinUrl;
                      if (url) Linking.openURL(url.startsWith('http') ? url : `https://${url}`);
                    }}
                    style={styles.linkRow}
                  >
                    <Ionicons name="logo-linkedin" size={16} color="#0A66C2" />
                    <Text style={styles.linkText}>{workerApps.find(a => a.linkedinUrl)?.linkedinUrl}</Text>
                  </Pressable>
                )}
              </View>
            )}

            {isBooked && existingPayment && showReceipt && (
              <PaymentReceipt payment={existingPayment} />
            )}
          </View>
        )}

        {activeTab === 'reviews' && (
          <View style={styles.section}>
            <View style={[styles.ratingOverview, shadow.card]}>
              <Text style={styles.bigRating}>{worker.rating}</Text>
              <StarRating rating={worker.rating} size={20} />
              <Text style={styles.ratingFromText}>{worker.gigs} gigs completed</Text>
            </View>
            {worker.reviews.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="chatbubble-outline" size={36} color={colors.textMuted} />
                <Text style={styles.emptyStateText}>No reviews yet</Text>
              </View>
            ) : (
              worker.reviews.map(review => (
                <View key={review.id} style={[styles.reviewCard, shadow.card]}>
                  <View style={styles.reviewHeader}>
                    <Avatar size={36} name={review.authorName} backgroundColor={review.authorAvatarColor} />
                    <View style={styles.reviewInfo}>
                      <Text style={styles.reviewAuthor}>{review.authorName}</Text>
                      <Text style={styles.reviewEvent}>{review.eventTitle} &middot; {review.date}</Text>
                    </View>
                    <StarRating rating={review.rating} size={12} />
                  </View>
                  <Text style={styles.reviewText}>{review.text}</Text>
                </View>
              ))
            )}
          </View>
        )}

        {activeTab === 'stats' && (
          <View style={styles.section}>
            <View style={[styles.statsBanner, shadow.card]}>
              <LinearGradient colors={[worker.avatarColor + '60', worker.avatarColor + '20']} style={StyleSheet.absoluteFill} />
              <Text style={styles.statsBannerText}>Reliability Score</Text>
              <Text style={styles.statsBannerScore}>{reliabilityPct}%</Text>
            </View>
            {[
              { label: 'On-Time Arrival', value: `${worker.onTimePercent}%`, color: colors.accentMint },
              { label: 'Completion Rate', value: `${worker.completionPercent}%`, color: colors.accentLavender },
              { label: 'Repeat Bookings', value: `${Math.round(worker.repeatBookings * 100)}%`, color: colors.accentPrimary },
              { label: 'Response Speed', value: `${Math.round(worker.responseSpeed * 100)}%`, color: colors.accentPeach },
              { label: 'Average Rating', value: `${worker.rating}/5`, color: colors.starGold },
            ].map(stat => (
              <View key={stat.label} style={[styles.statCard, shadow.card]}>
                <View style={styles.statInfo}>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                  <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                </View>
                <View style={styles.statBarBg}>
                  <View style={[styles.statBarFill, {
                    width: `${parseFloat(stat.value) > 5 ? parseFloat(stat.value) : parseFloat(stat.value) / 5 * 100}%` as any,
                    backgroundColor: stat.color,
                  }]} />
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={[styles.bookingBar, { paddingBottom: botPad + 12 }]}>
        <View style={styles.bookingInfo}>
          <Text style={styles.bookingName}>{worker.name}</Text>
          <Text style={styles.bookingRoles}>{worker.roles.join(', ')}</Text>
        </View>
        {!isBooked ? (
          <Pressable
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              setBooked(true);
              bookWorker(worker.id);
            }}
            style={({ pressed }) => [styles.bookBtn, { transform: [{ scale: pressed ? 0.96 : 1 }] }]}
          >
            <LinearGradient colors={['#FF8F9B', '#FF5E73']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.bookBtnGrad}>
              <Text style={styles.bookBtnText}>Book {worker.name.split(' ')[0]}</Text>
            </LinearGradient>
          </Pressable>
        ) : paymentCompleted ? (
          <Pressable
            onPress={() => setShowReceipt(s => !s)}
            style={({ pressed }) => [styles.bookBtn, { transform: [{ scale: pressed ? 0.96 : 1 }] }]}
          >
            <View style={[styles.bookBtnGrad, { backgroundColor: colors.accentMint + '60' }]}>
              <Ionicons name="checkmark-circle" size={18} color="#1A6635" />
              <Text style={[styles.bookBtnText, { color: '#1A6635' }]}>Paid</Text>
            </View>
          </Pressable>
        ) : (
          <Pressable
            onPress={handlePayWorker}
            style={({ pressed }) => [styles.bookBtn, { transform: [{ scale: pressed ? 0.96 : 1 }] }]}
          >
            <LinearGradient colors={['#CDB9FF', '#A78BFA']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.bookBtnGrad}>
              <Ionicons name="wallet-outline" size={16} color="#fff" />
              <Text style={styles.bookBtnText}>Pay Worker</Text>
            </LinearGradient>
          </Pressable>
        )}
      </View>

      <PaymentSheet
        visible={showPayment}
        onClose={() => setShowPayment(false)}
        onConfirm={handleConfirmPayment}
        eventTitle={paymentEvent?.title || 'Event'}
        workerName={worker.name}
        orgName={paymentEvent?.orgName || 'Organization'}
        roleType={paymentRole?.roleType || worker.roles[0] || 'Crew'}
        amount={payAmount}
        paymentMethods={paymentMethods}
        selectedMethod={selectedPaymentMethod}
        onMethodChange={setSelectedPaymentMethod}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundPrimary },
  hero: { paddingBottom: spacing.lg },
  heroHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing.md, marginBottom: spacing.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceCard, alignItems: 'center', justifyContent: 'center' },
  msgBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceCard, alignItems: 'center', justifyContent: 'center' },
  profileArea: { alignItems: 'center', gap: 6, paddingHorizontal: spacing.lg },
  workerName: { fontSize: 26, fontFamily: 'Inter_700Bold', color: colors.textPrimary, marginTop: 8 },
  workerSchool: { ...typography.body, color: colors.textSecondary, fontFamily: 'Inter_400Regular' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ratingText: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
  badgeRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', justifyContent: 'center' },
  tabs: { flexDirection: 'row', backgroundColor: colors.surfaceCard, marginHorizontal: spacing.md, borderRadius: radius.button, padding: 4, marginBottom: 2 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: radius.button - 2 },
  tabActive: { backgroundColor: colors.backgroundPrimary },
  tabText: { fontSize: 13, fontFamily: 'Inter_500Medium', color: colors.textMuted },
  tabTextActive: { fontFamily: 'Inter_700Bold', color: colors.textPrimary },
  scrollContent: { paddingHorizontal: spacing.md, paddingTop: spacing.md },
  section: { gap: spacing.sm },
  card: { backgroundColor: colors.surfaceCard, borderRadius: radius.card, padding: spacing.md, gap: spacing.sm },
  cardTitle: { ...typography.sectionTitle, color: colors.textPrimary, fontFamily: 'Inter_700Bold' },
  bioText: { ...typography.body, color: colors.textSecondary, fontFamily: 'Inter_400Regular', lineHeight: 22 },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  detailText: { ...typography.body, color: colors.textSecondary, fontFamily: 'Inter_400Regular' },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 2 },
  linkText: { ...typography.body, color: colors.accentPrimary, fontFamily: 'Inter_400Regular' },
  ratingOverview: { backgroundColor: colors.surfaceCard, borderRadius: radius.card, padding: spacing.lg, alignItems: 'center', gap: 6 },
  bigRating: { fontSize: 56, fontFamily: 'Inter_700Bold', color: colors.textPrimary },
  ratingFromText: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
  reviewCard: { backgroundColor: colors.surfaceCard, borderRadius: radius.card, padding: spacing.md, gap: spacing.sm },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  reviewInfo: { flex: 1, gap: 2 },
  reviewAuthor: { ...typography.body, color: colors.textPrimary, fontFamily: 'Inter_600SemiBold' },
  reviewEvent: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
  reviewText: { ...typography.body, color: colors.textSecondary, fontFamily: 'Inter_400Regular', lineHeight: 20 },
  statsBanner: { borderRadius: radius.card, padding: spacing.lg, alignItems: 'center', overflow: 'hidden', gap: 4 },
  statsBannerText: { ...typography.sectionTitle, color: colors.textPrimary, fontFamily: 'Inter_600SemiBold' },
  statsBannerScore: { fontSize: 48, fontFamily: 'Inter_700Bold', color: colors.textPrimary },
  statCard: { backgroundColor: colors.surfaceCard, borderRadius: radius.card, padding: spacing.md, gap: 8 },
  statInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statLabel: { ...typography.body, color: colors.textSecondary, fontFamily: 'Inter_500Medium' },
  statValue: { ...typography.sectionTitle, fontFamily: 'Inter_700Bold' },
  statBarBg: { height: 6, backgroundColor: colors.borderSubtle, borderRadius: 3 },
  statBarFill: { height: 6, borderRadius: 3 },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xl, gap: spacing.sm },
  emptyStateText: { ...typography.body, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
  bookingBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: colors.surfaceCard, paddingHorizontal: spacing.md, paddingTop: spacing.md,
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    borderTopWidth: 1, borderTopColor: colors.borderSubtle,
  },
  bookingInfo: { flex: 1, gap: 2 },
  bookingName: { ...typography.bodyMedium, color: colors.textPrimary, fontFamily: 'Inter_600SemiBold' },
  bookingRoles: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
  bookBtn: { overflow: 'hidden', borderRadius: radius.button },
  bookBtnGrad: { paddingVertical: 12, paddingHorizontal: spacing.lg, flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: radius.button },
  bookBtnText: { fontSize: 15, fontFamily: 'Inter_700Bold', color: '#fff' },
  appRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle },
  appRowLeft: { flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
  appRowInfo: { flex: 1, gap: 2 },
  appRowNote: { ...typography.body, color: colors.textSecondary, fontFamily: 'Inter_400Regular', lineHeight: 18 },
  appRowTime: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
  statusBadge: { borderRadius: radius.chip, paddingHorizontal: 10, paddingVertical: 3, marginLeft: spacing.sm },
  statusBadgeText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  resumeIndicator: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.accentPrimary + '10', borderRadius: radius.small, padding: spacing.sm, marginTop: 4 },
  resumeIndicatorText: { ...typography.body, color: colors.accentPrimary, fontFamily: 'Inter_500Medium' },
  summaryCard: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, backgroundColor: colors.accentLavender + '10', borderRadius: radius.small, padding: spacing.sm, marginTop: 4 },
  summaryInfo: { flex: 1, gap: 2 },
  summaryTitle: { ...typography.bodyMedium, color: colors.textPrimary, fontFamily: 'Inter_600SemiBold' },
  summaryText: { ...typography.meta, color: colors.textSecondary, fontFamily: 'Inter_400Regular', lineHeight: 18 },
});
