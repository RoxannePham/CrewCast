import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Modal, Pressable, ActivityIndicator, Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, radius, shadow } from '@/constants/theme';
import { PaymentMethod } from '@/data/mockPayments';
import { calculatePayment, formatCurrency, getPaymentMethodIcon } from '@/lib/paymentHelpers';

type SheetStep = 'review' | 'processing' | 'success';

interface PaymentSheetProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  eventTitle: string;
  workerName: string;
  orgName: string;
  roleType: string;
  amount: number;
  paymentMethods: PaymentMethod[];
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
}

export function PaymentSheet({
  visible, onClose, onConfirm, eventTitle, workerName, orgName,
  roleType, amount, paymentMethods, selectedMethod, onMethodChange,
}: PaymentSheetProps) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<SheetStep>('review');
  const botPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const { total, platformFee, workerPayout } = calculatePayment(amount);

  const handleConfirm = async () => {
    if (step !== 'review') return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setStep('processing');
    try {
      await onConfirm();
      setStep('success');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      setStep('review');
    }
  };

  const handleClose = () => {
    setStep('review');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={step !== 'processing' ? handleClose : undefined} />
        <View style={[styles.sheet, { paddingBottom: botPad + 16 }]}>
          <View style={styles.handle} />

          {step === 'review' && (
            <>
              <View style={styles.header}>
                <Ionicons name="shield-checkmark-outline" size={24} color={colors.accentPrimary} />
                <Text style={styles.sheetTitle}>Review Payment</Text>
              </View>

              <View style={styles.jobInfo}>
                <View style={styles.jobRow}>
                  <Ionicons name="calendar-outline" size={16} color={colors.textMuted} />
                  <Text style={styles.jobLabel}>{eventTitle}</Text>
                </View>
                <View style={styles.jobRow}>
                  <Ionicons name="person-outline" size={16} color={colors.textMuted} />
                  <Text style={styles.jobLabel}>{workerName} &middot; {roleType}</Text>
                </View>
                <View style={styles.jobRow}>
                  <Ionicons name="business-outline" size={16} color={colors.textMuted} />
                  <Text style={styles.jobLabel}>{orgName}</Text>
                </View>
              </View>

              <View style={styles.breakdown}>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Job Total</Text>
                  <Text style={styles.breakdownTotal}>{formatCurrency(total)}</Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownFeeLabel}>CrewCast Fee (2%)</Text>
                  <Text style={styles.breakdownFee}>-{formatCurrency(platformFee)}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.breakdownRow}>
                  <Text style={styles.payoutLabel}>Worker Receives</Text>
                  <Text style={styles.payoutAmount}>{formatCurrency(workerPayout)}</Text>
                </View>
              </View>

              <View style={styles.methodSection}>
                <Text style={styles.methodTitle}>Payment Method</Text>
                {paymentMethods.map(method => {
                  const isSelected = selectedMethod.id === method.id;
                  return (
                    <Pressable
                      key={method.id}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        onMethodChange(method);
                      }}
                      style={[styles.methodRow, isSelected && styles.methodRowSelected]}
                    >
                      <Ionicons
                        name={getPaymentMethodIcon(method.type) as any}
                        size={20}
                        color={isSelected ? colors.accentPrimary : colors.textMuted}
                      />
                      <Text style={[styles.methodLabel, isSelected && styles.methodLabelSelected]}>
                        {method.label}
                      </Text>
                      <View style={[styles.radio, isSelected && styles.radioSelected]}>
                        {isSelected && <View style={styles.radioDot} />}
                      </View>
                    </Pressable>
                  );
                })}
              </View>

              <View style={styles.trustRow}>
                <Ionicons name="lock-closed-outline" size={14} color={colors.textMuted} />
                <Text style={styles.trustText}>Processed securely through CrewCast</Text>
              </View>

              <Pressable
                onPress={handleConfirm}
                style={({ pressed }) => [styles.confirmBtn, { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] }]}
              >
                <LinearGradient
                  colors={['#FF8F9B', '#FF5E73']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.confirmBtnGrad}
                >
                  <Ionicons name="shield-checkmark" size={18} color="#fff" />
                  <Text style={styles.confirmBtnText}>Confirm Payment &middot; {formatCurrency(total)}</Text>
                </LinearGradient>
              </Pressable>

              <Pressable onPress={handleClose} style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
            </>
          )}

          {step === 'processing' && (
            <View style={styles.processingView}>
              <ActivityIndicator size="large" color={colors.accentPrimary} />
              <Text style={styles.processingTitle}>Processing Payment...</Text>
              <Text style={styles.processingSubtext}>Please wait while we securely process your payment</Text>
              <View style={styles.processingBreakdown}>
                <Text style={styles.processingAmount}>{formatCurrency(total)}</Text>
                <Text style={styles.processingTo}>to {workerName}</Text>
              </View>
            </View>
          )}

          {step === 'success' && (
            <View style={styles.successView}>
              <View style={styles.successCircle}>
                <Ionicons name="checkmark" size={36} color="#fff" />
              </View>
              <Text style={styles.successTitle}>Payment Completed</Text>
              <Text style={styles.successSubtext}>
                {formatCurrency(total)} sent to {workerName}
              </Text>
              <View style={styles.successDetails}>
                <View style={styles.successRow}>
                  <Text style={styles.successLabel}>Worker Payout</Text>
                  <Text style={styles.successValue}>{formatCurrency(workerPayout)}</Text>
                </View>
                <View style={styles.successRow}>
                  <Text style={styles.successLabel}>CrewCast Fee</Text>
                  <Text style={styles.successFeeValue}>{formatCurrency(platformFee)}</Text>
                </View>
                <View style={styles.successRow}>
                  <Text style={styles.successLabel}>Payment Method</Text>
                  <Text style={styles.successValue}>{selectedMethod.label}</Text>
                </View>
              </View>
              <View style={styles.trustRow}>
                <Ionicons name="document-text-outline" size={14} color={colors.textMuted} />
                <Text style={styles.trustText}>Payment record saved</Text>
              </View>
              <Pressable onPress={handleClose} style={[styles.doneBtn, shadow.card]}>
                <Text style={styles.doneBtnText}>Done</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: {
    backgroundColor: colors.backgroundPrimary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.lg,
    paddingTop: 12,
    maxHeight: '92%',
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: colors.borderSubtle, alignSelf: 'center', marginBottom: spacing.md,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  sheetTitle: { fontSize: 22, fontFamily: 'Inter_700Bold', color: colors.textPrimary },
  jobInfo: { gap: 8, marginBottom: spacing.md },
  jobRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  jobLabel: { ...typography.body, color: colors.textSecondary, fontFamily: 'Inter_400Regular' },
  breakdown: {
    backgroundColor: colors.surfaceCard, borderRadius: radius.card, padding: spacing.md,
    gap: 10, marginBottom: spacing.md,
  },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  breakdownLabel: { fontSize: 15, fontFamily: 'Inter_500Medium', color: colors.textSecondary },
  breakdownTotal: { fontSize: 24, fontFamily: 'Inter_700Bold', color: colors.textPrimary },
  breakdownFeeLabel: { fontSize: 13, fontFamily: 'Inter_400Regular', color: colors.textMuted },
  breakdownFee: { fontSize: 13, fontFamily: 'Inter_500Medium', color: colors.textMuted },
  divider: { height: 1, backgroundColor: colors.borderSubtle },
  payoutLabel: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#1A6635' },
  payoutAmount: { fontSize: 20, fontFamily: 'Inter_700Bold', color: '#1A6635' },
  methodSection: { gap: 8, marginBottom: spacing.md },
  methodTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: colors.textSecondary },
  methodRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.surfaceCard, borderRadius: radius.small,
    padding: 12, borderWidth: 1.5, borderColor: colors.borderSubtle,
  },
  methodRowSelected: { borderColor: colors.accentPrimary, backgroundColor: colors.accentPrimary + '08' },
  methodLabel: { flex: 1, fontSize: 14, fontFamily: 'Inter_500Medium', color: colors.textPrimary },
  methodLabelSelected: { color: colors.accentPrimary },
  radio: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: colors.borderSubtle,
    alignItems: 'center', justifyContent: 'center',
  },
  radioSelected: { borderColor: colors.accentPrimary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.accentPrimary },
  trustRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, marginBottom: spacing.md,
  },
  trustText: { fontSize: 12, fontFamily: 'Inter_400Regular', color: colors.textMuted },
  confirmBtn: { marginBottom: 8, borderRadius: radius.button, overflow: 'hidden' },
  confirmBtnGrad: {
    paddingVertical: 16, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8,
  },
  confirmBtnText: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#fff' },
  cancelBtn: { alignItems: 'center', paddingVertical: 12 },
  cancelBtnText: { fontSize: 15, fontFamily: 'Inter_500Medium', color: colors.textMuted },
  processingView: { alignItems: 'center', paddingVertical: spacing.xxl, gap: spacing.md },
  processingTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', color: colors.textPrimary },
  processingSubtext: { ...typography.body, color: colors.textMuted, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  processingBreakdown: { alignItems: 'center', gap: 4, marginTop: spacing.sm },
  processingAmount: { fontSize: 32, fontFamily: 'Inter_700Bold', color: colors.accentPrimary },
  processingTo: { fontSize: 14, fontFamily: 'Inter_400Regular', color: colors.textMuted },
  successView: { alignItems: 'center', paddingVertical: spacing.lg, gap: spacing.md },
  successCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#1A6635', alignItems: 'center', justifyContent: 'center',
  },
  successTitle: { fontSize: 22, fontFamily: 'Inter_700Bold', color: colors.textPrimary },
  successSubtext: { ...typography.body, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
  successDetails: {
    width: '100%', backgroundColor: colors.surfaceCard,
    borderRadius: radius.card, padding: spacing.md, gap: 10,
  },
  successRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  successLabel: { fontSize: 13, fontFamily: 'Inter_400Regular', color: colors.textMuted },
  successValue: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: colors.textPrimary },
  successFeeValue: { fontSize: 14, fontFamily: 'Inter_500Medium', color: colors.textMuted },
  doneBtn: {
    width: '100%', backgroundColor: colors.surfaceCard,
    borderRadius: radius.button, paddingVertical: 14, alignItems: 'center',
  },
  doneBtnText: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: colors.textPrimary },
});
