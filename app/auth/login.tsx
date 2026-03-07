import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, Pressable,
  ScrollView, Platform, KeyboardAvoidingView, ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, radius, shadow } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const botPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const handleLogin = async () => {
    setErrorMsg('');
    const trimEmail = email.trim();
    const trimPass = password.trim();

    if (!trimEmail || !trimPass) {
      setErrorMsg('Please enter your email and password.');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    try {
      const result = await signIn(trimEmail, trimPass);
      if (result.success) {
        router.replace('/(tabs)');
      } else {
        setErrorMsg(result.message || 'Login failed.');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } catch (e) {
      setErrorMsg('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setErrorMsg('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLoading(true);
    try {
      const result = await signIn('alex@nyu.edu', 'demo');
      if (result.success) {
        router.replace('/(tabs)');
      } else {
        setErrorMsg(result.message || 'Demo login failed.');
      }
    } catch (e) {
      setErrorMsg('Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingTop: topPad + 20, paddingBottom: botPad + 40 }]}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable onPress={() => router.back()} style={[styles.backBtn, shadow.card]}>
          <Ionicons name="chevron-back" size={22} color={colors.textSecondary} />
        </Pressable>

        <View style={styles.headerArea}>
          <LinearGradient colors={['#FF8F9B', '#FF5E73']} style={styles.logoCircle}>
            <Text style={styles.logoText}>CC</Text>
          </LinearGradient>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to your CrewCast account</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={[styles.inputWrap, !!errorMsg && styles.inputWrapError]}>
              <Ionicons name="mail-outline" size={18} color={errorMsg ? colors.accentPrimary : colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={(t) => { setEmail(t); setErrorMsg(''); }}
                placeholder="you@email.com"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
              />
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputWrap, !!errorMsg && styles.inputWrapError]}>
              <Ionicons name="lock-closed-outline" size={18} color={errorMsg ? colors.accentPrimary : colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={(t) => { setPassword(t); setErrorMsg(''); }}
                placeholder="Your password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showPass}
                editable={!loading}
              />
              <Pressable onPress={() => setShowPass(s => !s)} style={styles.eyeBtn}>
                <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.textMuted} />
              </Pressable>
            </View>
          </View>

          {!!errorMsg && (
            <View style={styles.errorRow}>
              <Ionicons name="alert-circle" size={16} color={colors.accentPrimary} />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          )}

          <Pressable
            onPress={handleLogin}
            disabled={loading}
            style={({ pressed }) => [styles.loginBtn, { opacity: loading ? 0.7 : pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] }]}
          >
            <LinearGradient colors={['#FF8F9B', '#FF5E73']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.loginBtnGrad}>
              {loading ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.loginBtnText}>Signing in...</Text>
                </View>
              ) : (
                <Text style={styles.loginBtnText}>Sign In</Text>
              )}
            </LinearGradient>
          </Pressable>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable
            onPress={() => router.push('/auth/signup')}
            style={[styles.signupBtn, shadow.card]}
          >
            <Text style={styles.signupBtnText}>Create an account</Text>
          </Pressable>

          <Pressable
            onPress={handleDemoLogin}
            disabled={loading}
            style={({ pressed }) => [styles.demoBtn, { opacity: loading ? 0.5 : pressed ? 0.8 : 1 }]}
          >
            <Ionicons name="flash-outline" size={16} color={colors.accentPrimary} />
            <Text style={styles.demoBtnText}>Quick Demo Login</Text>
          </Pressable>

          <Text style={styles.demoHint}>Demo account: alex@nyu.edu</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundPrimary },
  content: { paddingHorizontal: spacing.lg, gap: spacing.xl },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.surfaceCard,
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  headerArea: { alignItems: 'center', gap: spacing.sm },
  logoCircle: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: 24, fontFamily: 'Inter_700Bold', color: '#fff' },
  title: { fontSize: 28, fontFamily: 'Inter_700Bold', color: colors.textPrimary, marginTop: 4 },
  subtitle: { ...typography.body, color: colors.textMuted, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  form: { gap: spacing.md },
  inputGroup: { gap: 6 },
  label: { ...typography.bodyMedium, color: colors.textSecondary, fontFamily: 'Inter_600SemiBold' },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.small, borderWidth: 1.5, borderColor: colors.borderSubtle,
    paddingHorizontal: spacing.md,
  },
  inputWrapError: {
    borderColor: colors.accentPrimary,
  },
  inputIcon: { marginRight: spacing.sm },
  input: { flex: 1, fontSize: 15, color: colors.textPrimary, paddingVertical: 14, fontFamily: 'Inter_400Regular' },
  eyeBtn: { padding: 4 },
  errorRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.accentPrimary + '10',
    borderRadius: radius.small, paddingVertical: 10, paddingHorizontal: spacing.md,
  },
  errorText: { fontSize: 13, fontFamily: 'Inter_500Medium', color: colors.accentPrimary, flex: 1 },
  loginBtn: { marginTop: 4 },
  loginBtnGrad: { borderRadius: radius.button, paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  loginBtnText: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#fff' },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.borderSubtle },
  dividerText: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
  signupBtn: {
    backgroundColor: colors.surfaceCard, borderRadius: radius.button,
    paddingVertical: 14, alignItems: 'center',
  },
  signupBtnText: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: colors.textPrimary },
  demoBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 12, borderRadius: radius.button,
    borderWidth: 1.5, borderColor: colors.accentPrimary + '40',
    backgroundColor: colors.accentPrimary + '08',
  },
  demoBtnText: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: colors.accentPrimary },
  demoHint: { ...typography.meta, color: colors.textMuted, textAlign: 'center', fontFamily: 'Inter_400Regular' },
});
