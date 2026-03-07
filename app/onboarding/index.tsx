import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F6F1E8', '#EFE8DC', '#E8DFD0']}
        style={StyleSheet.absoluteFill}
      />
      {/* Decorative blobs */}
      <View style={[styles.blob1, { top: height * 0.1 }]} />
      <View style={[styles.blob2, { top: height * 0.4 }]} />

      <View style={[styles.content, { paddingTop: topPad + 40, paddingBottom: bottomPad + 40 }]}>
        <View style={styles.logoArea}>
          <LinearGradient
            colors={['#FF8F9B', '#FF5E73']}
            style={styles.logoCircle}
          >
            <Text style={styles.logoText}>CC</Text>
          </LinearGradient>
          <Text style={styles.appName}>CrewCast</Text>
          <Text style={styles.tagline}>Your gig, your crew, your vibe.</Text>
        </View>

        <View style={styles.cards}>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/onboarding/worker-setup');
            }}
            style={({ pressed }) => [
              styles.roleCard,
              styles.workerCard,
              { transform: [{ scale: pressed ? 0.97 : 1 }] }
            ]}
          >
            <LinearGradient
              colors={['#FF8F9B', '#FF5E73']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.cardIconWrap}>
              <Ionicons name="musical-notes" size={28} color="#fff" />
            </View>
            <Text style={styles.cardTitle}>I want to work events</Text>
            <Text style={styles.cardDesc}>Find gigs, get booked, build your reputation</Text>
            <View style={styles.cardArrow}>
              <Ionicons name="arrow-forward" size={20} color="rgba(255,255,255,0.8)" />
            </View>
          </Pressable>

          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/onboarding/host-setup');
            }}
            style={({ pressed }) => [
              styles.roleCard,
              styles.hostCard,
              { transform: [{ scale: pressed ? 0.97 : 1 }] }
            ]}
          >
            <LinearGradient
              colors={['#CDB9FF', '#A89EFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.cardIconWrap}>
              <Ionicons name="calendar" size={28} color="#fff" />
            </View>
            <Text style={styles.cardTitle}>I organize events</Text>
            <Text style={styles.cardDesc}>Post events, hire crew, manage everything</Text>
            <View style={styles.cardArrow}>
              <Ionicons name="arrow-forward" size={20} color="rgba(255,255,255,0.8)" />
            </View>
          </Pressable>
        </View>

        <Pressable
          onPress={() => router.push('/auth/login')}
          style={styles.loginLink}
        >
          <Text style={styles.loginLinkText}>Already have an account? <Text style={styles.loginLinkBold}>Sign in</Text></Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  blob1: {
    position: 'absolute',
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.accentPrimary + '20',
  },
  blob2: {
    position: 'absolute',
    left: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.accentLavender + '30',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
  },
  logoArea: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  logoText: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
  },
  appName: {
    fontSize: 36,
    fontFamily: 'Inter_700Bold',
    color: colors.textPrimary,
  },
  tagline: {
    ...typography.body,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  cards: {
    gap: spacing.md,
  },
  roleCard: {
    borderRadius: radius.card,
    padding: spacing.lg,
    overflow: 'hidden',
    gap: 6,
  },
  workerCard: {},
  hostCard: {},
  cardIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
  },
  cardDesc: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 20,
  },
  cardArrow: {
    alignSelf: 'flex-end',
    marginTop: spacing.sm,
  },
  loginLink: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  loginLinkText: {
    ...typography.body,
    color: colors.textMuted,
    fontFamily: 'Inter_400Regular',
  },
  loginLinkBold: {
    color: colors.accentPrimary,
    fontFamily: 'Inter_600SemiBold',
  },
});
