import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadow } from '@/constants/theme';
import { Payment } from '@/data/mockPayments';
import { formatCurrency, getPaymentStatusLabel, getPayoutStatusLabel } from '@/lib/paymentHelpers';

const PAYMENT_STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  draft: { bg: colors.borderSubtle, text: colors.textMuted },
  pending: { bg: colors.accentPeach + '30', text: '#8B5A00' },
  processing: { bg: colors.accentBlue + '30', text: '#1A4D80' },
  held: { bg: colors.accentBlue + '25', text: '#1A4D80' },
  pending_release: { bg: colors.accentPeach + '30', text: '#8B5A00' },
  completed: { bg: colors.accentMint + '30', text: '#1A6635' },
  failed: { bg: colors.accentPrimary + '20', text: '#AA2244' },
};

const PAYOUT_STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  not_started: { bg: colors.borderSubtle, text: colors.textMuted },
  on_hold: { bg: colors.accentBlue + '25', text: '#1A4D80' },
  scheduled: { bg: colors.accentPeach + '30', text: '#8B5A00' },
  paid: { bg: colors.accentMint + '30', text: '#1A6635' },
};

function getPaymentIcon(status: string): keyof typeof Ionicons.glyphMap {
  if (status === 'completed') return 'checkmark-circle';
  if (status === 'held') return 'lock-closed';
  if (status === 'pending_release') return 'lock-open-outline';
  return 'time-outline';
}

function getReceiptTitle(status: string): string {
  if (status === 'completed') return 'Payment Released';
  if (status === 'held') return 'Funds Secured';
  if (status === 'pending_release') return 'Releasing Funds';
  return getPaymentStatusLabel(status);
}

interface PaymentReceiptProps {
  payment: Payment;
  compact?: boolean;
}

export function PaymentReceipt({ payment, compact = false }: PaymentReceiptProps) {
  const payStatus = PAYMENT_STATUS_COLORS[payment.paymentStatus] || PAYMENT_STATUS_COLORS.draft;
  const payoutStatus = PAYOUT_STATUS_COLORS[payment.payoutStatus] || PAYOUT_STATUS_COLORS.not_started;
  const isHeld = payment.paymentStatus === 'held';
  const isCompleted = payment.paymentStatus === 'completed';

  if (compact) {
    return (
      <View style={[styles.compactCard, shadow.card]}>
        <View style={styles.compactHeader}>
          <Ionicons
            name={getPaymentIcon(payment.paymentStatus)}
            size={18}
            color={payStatus.text}
          />
          <Text style={styles.compactTitle}>{payment.eventTitle}</Text>
          <Text style={[styles.compactAmount, { color: payStatus.text }]}>
            {formatCurrency(payment.amountTotal)}
          </Text>
        </View>
        <View style={styles.compactMeta}>
          <Text style={styles.compactWorker}>{payment.workerName} &middot; {payment.roleType}</Text>
          <View style={styles.compactBadges}>
            <View style={[styles.statusBadge, { backgroundColor: payStatus.bg }]}>
              <Text style={[styles.statusBadgeText, { color: payStatus.text }]}>
                {getPaymentStatusLabel(payment.paymentStatus)}
              </Text>
            </View>
            {(isCompleted || isHeld) && (
              <View style={[styles.statusBadge, { backgroundColor: payoutStatus.bg }]}>
                <Text style={[styles.statusBadgeText, { color: payoutStatus.text }]}>
                  {getPayoutStatusLabel(payment.payoutStatus)}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.receiptCard, shadow.card]}>
      <View style={styles.receiptHeader}>
        {isCompleted ? (
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={20} color="#fff" />
          </View>
        ) : isHeld ? (
          <View style={[styles.checkCircle, { backgroundColor: '#1A4D80' }]}>
            <Ionicons name="lock-closed" size={20} color="#fff" />
          </View>
        ) : (
          <Ionicons name="time-outline" size={28} color={payStatus.text} />
        )}
        <Text style={styles.receiptTitle}>{getReceiptTitle(payment.paymentStatus)}</Text>
      </View>

      {isHeld && (
        <View style={styles.holdInfoCard}>
          <Ionicons name="information-circle-outline" size={16} color="#1A4D80" />
          <Text style={styles.holdInfoText}>
            Funds are held securely. Payment will be released to the worker after service completion is confirmed.
          </Text>
        </View>
      )}

      <View style={styles.receiptDetails}>
        <View style={styles.receiptRow}>
          <Text style={styles.receiptLabel}>Event</Text>
          <Text style={styles.receiptValue}>{payment.eventTitle}</Text>
        </View>
        <View style={styles.receiptRow}>
          <Text style={styles.receiptLabel}>Worker</Text>
          <Text style={styles.receiptValue}>{payment.workerName}</Text>
        </View>
        <View style={styles.receiptRow}>
          <Text style={styles.receiptLabel}>Role</Text>
          <Text style={styles.receiptValue}>{payment.roleType}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.receiptRow}>
          <Text style={styles.receiptLabel}>Total Authorized</Text>
          <Text style={styles.receiptAmount}>{formatCurrency(payment.amountTotal)}</Text>
        </View>
        <View style={styles.receiptRow}>
          <Text style={styles.receiptFeeLabel}>CrewCast Fee (2%)</Text>
          <Text style={styles.receiptFee}>-{formatCurrency(payment.platformFee)}</Text>
        </View>
        <View style={styles.receiptRow}>
          <Text style={styles.receiptPayoutLabel}>Worker Receives{isHeld ? ' (after release)' : ''}</Text>
          <Text style={styles.receiptPayout}>{formatCurrency(payment.workerPayout)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.receiptRow}>
          <Text style={styles.receiptLabel}>Payment Method</Text>
          <Text style={styles.receiptValue}>{payment.paymentMethod.label}</Text>
        </View>
        {payment.heldAt && (
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Authorized</Text>
            <Text style={styles.receiptValue}>
              {new Date(payment.heldAt).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric',
                hour: 'numeric', minute: '2-digit',
              })}
            </Text>
          </View>
        )}
        {payment.completedAt && (
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Released</Text>
            <Text style={styles.receiptValue}>
              {new Date(payment.completedAt).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric',
                hour: 'numeric', minute: '2-digit',
              })}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.receiptBadges}>
        <View style={[styles.statusBadge, { backgroundColor: payStatus.bg }]}>
          <Text style={[styles.statusBadgeText, { color: payStatus.text }]}>
            {getPaymentStatusLabel(payment.paymentStatus)}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: payoutStatus.bg }]}>
          <Text style={[styles.statusBadgeText, { color: payoutStatus.text }]}>
            {getPayoutStatusLabel(payment.payoutStatus)}
          </Text>
        </View>
      </View>

      <View style={styles.trustRow}>
        <Ionicons name="shield-checkmark-outline" size={14} color={colors.textMuted} />
        <Text style={styles.trustText}>Protected by CrewCast payment guarantee</Text>
      </View>
    </View>
  );
}

export function PaymentStatusBadge({ status, type = 'payment' }: { status: string; type?: 'payment' | 'payout' }) {
  const colorMap = type === 'payment' ? PAYMENT_STATUS_COLORS : PAYOUT_STATUS_COLORS;
  const statusColor = colorMap[status] || colorMap.draft || { bg: colors.borderSubtle, text: colors.textMuted };
  const label = type === 'payment' ? getPaymentStatusLabel(status) : getPayoutStatusLabel(status);

  return (
    <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
      <Text style={[styles.statusBadgeText, { color: statusColor.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  compactCard: {
    backgroundColor: colors.surfaceCard, borderRadius: radius.card,
    padding: spacing.sm, gap: 6,
  },
  compactHeader: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
  },
  compactTitle: {
    flex: 1, fontSize: 14, fontFamily: 'Inter_600SemiBold', color: colors.textPrimary,
  },
  compactAmount: { fontSize: 15, fontFamily: 'Inter_700Bold' },
  compactMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  compactWorker: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
  compactBadges: { flexDirection: 'row', gap: 4 },
  receiptCard: {
    backgroundColor: colors.surfaceCard, borderRadius: radius.card,
    padding: spacing.md, gap: spacing.md,
  },
  receiptHeader: { alignItems: 'center', gap: 8 },
  checkCircle: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#1A6635', alignItems: 'center', justifyContent: 'center',
  },
  receiptTitle: { fontSize: 18, fontFamily: 'Inter_700Bold', color: colors.textPrimary },
  holdInfoCard: {
    flexDirection: 'row', gap: 8, backgroundColor: colors.accentBlue + '15',
    borderRadius: radius.card, padding: spacing.sm, alignItems: 'flex-start',
  },
  holdInfoText: { flex: 1, fontSize: 12, fontFamily: 'Inter_400Regular', color: '#1A4D80', lineHeight: 17 },
  receiptDetails: { gap: 8 },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  receiptLabel: { fontSize: 13, fontFamily: 'Inter_400Regular', color: colors.textMuted },
  receiptValue: { fontSize: 13, fontFamily: 'Inter_500Medium', color: colors.textPrimary },
  receiptAmount: { fontSize: 16, fontFamily: 'Inter_700Bold', color: colors.textPrimary },
  receiptFeeLabel: { fontSize: 12, fontFamily: 'Inter_400Regular', color: colors.textMuted },
  receiptFee: { fontSize: 12, fontFamily: 'Inter_400Regular', color: colors.textMuted },
  receiptPayoutLabel: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: '#1A6635' },
  receiptPayout: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#1A6635' },
  divider: { height: 1, backgroundColor: colors.borderSubtle },
  receiptBadges: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  statusBadge: {
    borderRadius: radius.chip, paddingHorizontal: 10, paddingVertical: 3,
  },
  statusBadgeText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  trustRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6,
  },
  trustText: { fontSize: 11, fontFamily: 'Inter_400Regular', color: colors.textMuted },
});
