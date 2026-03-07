import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '@/constants/theme';

const { height } = Dimensions.get('window');

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

        <View style={styles.ctas}>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push('/auth/signup');
            }}
            style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.97 : 1 }] }]}
          >
            <LinearGradient
              colors={['#FF8F9B', '#FF5E73']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryBtn}
            >
              <Text style={styles.primaryBtnText}>Get Started</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/auth/login');
            }}
            style={({ pressed }) => [styles.secondaryBtn, { opacity: pressed ? 0.8 : 1 }]}
          >
            <Text style={styles.secondaryBtnText}>I already have an account</Text>
          </Pressable>
        </View>

        <View style={styles.features}>
          {[
            { icon: 'musical-notes' as const, label: 'Find gigs', color: colors.accentPrimary },
            { icon: 'people' as const, label: 'Join crews', color: colors.accentLavender },
            { icon: 'calendar' as const, label: 'Book talent', color: colors.accentMint },
          ].map(f => (
            <View key={f.label} style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: f.color + '25' }]}>
                <Ionicons name={f.icon} size={18} color={f.color} />
              </View>
              <Text style={styles.featureLabel}>{f.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  blob1: {
    position: 'absolute', right: -60,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: colors.accentPrimary + '20',
  },
  blob2: {
    position: 'absolute', left: -40,
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: colors.accentLavender + '30',
  },
  content: {
    flex: 1, paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
  },
  logoArea: { alignItems: 'center', gap: spacing.sm },
  logoCircle: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  logoText: { fontSize: 32, fontFamily: 'Inter_700Bold', color: '#fff' },
  appName: { fontSize: 40, fontFamily: 'Inter_700Bold', color: colors.textPrimary },
  tagline: {
    ...typography.body, color: colors.textSecondary,
    fontFamily: 'Inter_400Regular', textAlign: 'center', fontSize: 16,
  },
  ctas: { gap: spacing.md },
  primaryBtn: {
    borderRadius: radius.button, paddingVertical: 18,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
  },
  primaryBtnText: { fontSize: 18, fontFamily: 'Inter_700Bold', color: '#fff' },
  secondaryBtn: {
    paddingVertical: 16, borderRadius: radius.button,
    borderWidth: 1.5, borderColor: colors.borderSubtle,
    backgroundColor: colors.surfaceCard, alignItems: 'center',
  },
  secondaryBtnText: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: colors.textPrimary },
  features: {
    flexDirection: 'row', justifyContent: 'center', gap: spacing.xl,
  },
  featureItem: { alignItems: 'center', gap: 6 },
  featureIcon: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
  },
  featureLabel: { ...typography.meta, color: colors.textSecondary, fontFamily: 'Inter_500Medium' },
});
