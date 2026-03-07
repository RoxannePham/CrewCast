import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, Pressable,
  ScrollView, Platform, KeyboardAvoidingView, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { colors, typography, spacing, radius, shadow } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/ui/Avatar';

const ROLE_OPTIONS: { value: 'worker' | 'host'; label: string; icon: string; desc: string }[] = [
  { value: 'worker', label: 'Worker', icon: 'hammer-outline', desc: 'Find gigs & get hired' },
  { value: 'host', label: 'Host', icon: 'megaphone-outline', desc: 'Post events & hire crew' },
];

export default function SignUpScreen() {
  const insets = useSafeAreaInsets();
  const { signUp, updateOnboardingProfile } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState<'worker' | 'host'>('worker');
  const [school, setSchool] = useState('');
  const [organization, setOrganization] = useState('');
  const [major, setMajor] = useState('');
  const [loading, setLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const botPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const isValid = fullName.trim() && email.trim() && password.trim() && school.trim();

  const handlePickPhoto = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photo library to upload a profile photo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setProfilePhoto(result.assets[0].uri);
    }
  };

  const handleSignUp = async () => {
    if (!isValid) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    try {
      await signUp(fullName.trim(), email.trim(), password, role);
      if (profilePhoto) {
        await updateOnboardingProfile({ profilePhotoUri: profilePhoto });
      }
      if (role === 'worker') {
        router.replace('/onboarding/worker-setup');
      } else {
        router.replace('/onboarding/host-setup');
      }
    } catch (e) {
      Alert.alert('Error', 'Sign up failed. Try again.');
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
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Join CrewCast and start connecting</Text>
        </View>

        <View style={styles.form}>
          <Pressable onPress={handlePickPhoto} style={styles.photoSection}>
            <View style={styles.photoWrap}>
              <Avatar
                size={80}
                name={fullName || 'User'}
                imageUri={profilePhoto || undefined}
                backgroundColor={colors.accentLavender + '40'}
              />
              <View style={styles.photoCameraIcon}>
                <Ionicons name="camera" size={14} color="#fff" />
              </View>
            </View>
            <Text style={styles.photoLabel}>
              {profilePhoto ? 'Change photo' : 'Upload profile photo'}
            </Text>
          </Pressable>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="person-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Your full name"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="mail-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="you@email.com"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password *</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Create a password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showPass}
              />
              <Pressable onPress={() => setShowPass(s => !s)} style={styles.eyeBtn}>
                <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.textMuted} />
              </Pressable>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>I want to...</Text>
            <View style={styles.roleRow}>
              {ROLE_OPTIONS.map(opt => {
                const selected = role === opt.value;
                return (
                  <Pressable
                    key={opt.value}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setRole(opt.value);
                    }}
                    style={[
                      styles.roleCard,
                      selected && styles.roleCardSelected,
                      shadow.card,
                    ]}
                  >
                    <Ionicons
                      name={opt.icon as any}
                      size={22}
                      color={selected ? colors.accentPrimary : colors.textMuted}
                    />
                    <Text style={[styles.roleLabel, selected && styles.roleLabelSelected]}>{opt.label}</Text>
                    <Text style={styles.roleDesc}>{opt.desc}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>School *</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="school-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={school}
                onChangeText={setSchool}
                placeholder="Your university"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Organization (optional)</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="people-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={organization}
                onChangeText={setOrganization}
                placeholder="Club or organization"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Major / Field</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="book-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={major}
                onChangeText={setMajor}
                placeholder="e.g. Computer Science"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="words"
              />
            </View>
          </View>

          <Pressable
            onPress={handleSignUp}
            disabled={loading || !isValid}
            style={({ pressed }) => [
              styles.submitBtn,
              { opacity: (loading || !isValid) ? 0.6 : pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
            ]}
          >
            <LinearGradient
              colors={['#FF8F9B', '#FF5E73']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.submitBtnGrad}
            >
              <Text style={styles.submitBtnText}>{loading ? 'Creating account...' : 'Get Started'}</Text>
            </LinearGradient>
          </Pressable>

          <Pressable onPress={() => router.push('/auth/login')} style={styles.loginLink}>
            <Text style={styles.loginLinkText}>
              Already have an account? <Text style={styles.loginLinkBold}>Log in</Text>
            </Text>
          </Pressable>
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
  photoSection: { alignItems: 'center', gap: 8 },
  photoWrap: { position: 'relative' },
  photoCameraIcon: {
    position: 'absolute', bottom: 0, right: 0,
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: colors.accentPrimary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#fff',
  },
  photoLabel: { fontSize: 13, fontFamily: 'Inter_500Medium', color: colors.accentPrimary },
  inputGroup: { gap: 6 },
  label: { ...typography.bodyMedium, color: colors.textSecondary, fontFamily: 'Inter_600SemiBold' },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.small, borderWidth: 1.5, borderColor: colors.borderSubtle,
    paddingHorizontal: spacing.md,
  },
  inputIcon: { marginRight: spacing.sm },
  input: { flex: 1, fontSize: 15, color: colors.textPrimary, paddingVertical: 14, fontFamily: 'Inter_400Regular' },
  eyeBtn: { padding: 4 },
  roleRow: { flexDirection: 'row', gap: spacing.sm },
  roleCard: {
    flex: 1, backgroundColor: colors.surfaceCard,
    borderRadius: radius.small, borderWidth: 1.5, borderColor: colors.borderSubtle,
    paddingVertical: 14, paddingHorizontal: 12, alignItems: 'center', gap: 4,
  },
  roleCardSelected: {
    borderColor: colors.accentPrimary, backgroundColor: '#FFF5F6',
  },
  roleLabel: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: colors.textPrimary },
  roleLabelSelected: { color: colors.accentPrimary },
  roleDesc: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_400Regular', textAlign: 'center' as const },
  submitBtn: { marginTop: 8 },
  submitBtnGrad: { borderRadius: radius.button, paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  submitBtnText: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#fff' },
  loginLink: { alignItems: 'center', paddingVertical: 8 },
  loginLinkText: { ...typography.body, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
  loginLinkBold: { color: colors.accentPrimary, fontFamily: 'Inter_600SemiBold' },
});
