import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  Pressable, Platform, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, radius, shadow } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

const EVENT_TYPES = ['Greek Life', 'Campus Party', 'Networking', 'Brand Launch', 'Concert', 'Rave', 'Cultural Event', 'Charity', 'Corporate', 'Fashion Show'];
const ORG_ROLES = ['Social Chair', 'Event Organizer', 'Promoter', 'Brand Manager', 'Manager', 'Director'];

export default function HostSetupScreen() {
  const insets = useSafeAreaInsets();
  const { signUp, completeOnboarding } = useAuth();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [orgRole, setOrgRole] = useState('');
  const [school, setSchool] = useState('');
  const [city, setCity] = useState('');
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [loading, setLoading] = useState(false);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const botPad = Platform.OS === 'web' ? 34 : insets.bottom;
  const totalSteps = 2;

  const toggle = (arr: string[], item: string, setter: (v: string[]) => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setter(arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]);
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await signUp(name || 'New Host', email || 'host@crewcast.com', password, 'host');
      await completeOnboarding();
      router.replace('/(tabs)');
    } catch {
      Alert.alert('Error', 'Setup failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: topPad + 16, paddingBottom: botPad + 40 }]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Pressable onPress={() => step > 1 ? setStep(s => s - 1) : router.back()} style={[styles.backBtn, shadow.card]}>
          <Ionicons name="chevron-back" size={22} color={colors.textSecondary} />
        </Pressable>
        <View style={styles.progressBar}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <View key={i} style={[styles.progressDot, i + 1 <= step && styles.progressDotActive]} />
          ))}
        </View>
        <View style={{ width: 40 }} />
      </View>

      {step === 1 && (
        <View style={styles.stepContent}>
          <LinearGradient colors={['#CDB9FF', '#A89EFF']} style={styles.iconCircle}>
            <Ionicons name="calendar" size={28} color="#fff" />
          </LinearGradient>
          <Text style={styles.stepTitle}>Your host profile</Text>
          <Text style={styles.stepSubtitle}>Tell crew who you are and what you host</Text>
          {[
            { label: 'Your Name', value: name, setter: setName, placeholder: 'Jessica McCall' },
            { label: 'Email', value: email, setter: setEmail, placeholder: 'you@email.com' },
            { label: 'Password', value: password, setter: setPassword, placeholder: 'Create a password' },
            { label: 'Organization / Club Name', value: orgName, setter: setOrgName, placeholder: 'NYU Greek Council' },
            { label: 'School / Company', value: school, setter: setSchool, placeholder: 'NYU, Columbia, etc.' },
            { label: 'City / Campus Area', value: city, setter: setCity, placeholder: 'New York, NY' },
          ].map(f => (
            <View key={f.label} style={styles.inputGroup}>
              <Text style={styles.label}>{f.label}</Text>
              <TextInput
                style={styles.input}
                value={f.value}
                onChangeText={f.setter}
                placeholder={f.placeholder}
                placeholderTextColor={colors.textMuted}
                secureTextEntry={f.label === 'Password'}
              />
            </View>
          ))}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Your Role</Text>
            <View style={styles.chipGrid}>
              {ORG_ROLES.map(r => (
                <Pressable key={r} onPress={() => setOrgRole(r)} style={[styles.chip, orgRole === r && styles.chipActive]}>
                  <Text style={[styles.chipText, orgRole === r && styles.chipTextActive]}>{r}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      )}

      {step === 2 && (
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>Event preferences</Text>
          <Text style={styles.stepSubtitle}>What types of events do you host?</Text>
          <View style={styles.chipGrid}>
            {EVENT_TYPES.map(et => (
              <Pressable key={et} onPress={() => toggle(selectedEventTypes, et, setSelectedEventTypes)} style={[styles.chip, selectedEventTypes.includes(et) && styles.chipActive]}>
                <Text style={[styles.chipText, selectedEventTypes.includes(et) && styles.chipTextActive]}>{et}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={[styles.label, { marginTop: spacing.md }]}>Budget Range</Text>
          <View style={styles.budgetRow}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <TextInput style={styles.input} value={budgetMin} onChangeText={setBudgetMin} placeholder="$500" placeholderTextColor={colors.textMuted} keyboardType="numeric" />
            </View>
            <Text style={styles.label}>–</Text>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <TextInput style={styles.input} value={budgetMax} onChangeText={setBudgetMax} placeholder="$5000" placeholderTextColor={colors.textMuted} keyboardType="numeric" />
            </View>
          </View>
        </View>
      )}

      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          if (step < totalSteps) setStep(s => s + 1);
          else handleFinish();
        }}
        disabled={loading}
        style={({ pressed }) => [styles.ctaBtn, { opacity: loading ? 0.7 : pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] }]}
      >
        <LinearGradient colors={['#CDB9FF', '#A89EFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ctaBtnGrad}>
          <Text style={styles.ctaBtnText}>{step < totalSteps ? 'Continue' : loading ? 'Setting up...' : "Start Hosting!"}</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </LinearGradient>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundPrimary },
  content: { paddingHorizontal: spacing.lg, gap: spacing.lg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceCard, alignItems: 'center', justifyContent: 'center' },
  progressBar: { flexDirection: 'row', gap: 8 },
  progressDot: { width: 40, height: 6, borderRadius: 3, backgroundColor: colors.borderSubtle },
  progressDotActive: { backgroundColor: colors.accentLavender },
  stepContent: { gap: spacing.md },
  iconCircle: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  stepTitle: { fontSize: 26, fontFamily: 'Inter_700Bold', color: colors.textPrimary },
  stepSubtitle: { ...typography.body, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
  inputGroup: { gap: 6 },
  label: { ...typography.bodyMedium, color: colors.textSecondary, fontFamily: 'Inter_600SemiBold' },
  input: { backgroundColor: colors.surfaceCard, borderRadius: radius.small, paddingHorizontal: spacing.md, paddingVertical: 14, fontSize: 15, color: colors.textPrimary, fontFamily: 'Inter_400Regular', borderWidth: 1.5, borderColor: colors.borderSubtle },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.chip, backgroundColor: colors.surfaceCard, borderWidth: 1.5, borderColor: colors.borderSubtle },
  chipActive: { backgroundColor: colors.accentLavender, borderColor: colors.accentLavender },
  chipText: { fontSize: 13, fontFamily: 'Inter_500Medium', color: colors.textSecondary },
  chipTextActive: { color: '#fff' },
  budgetRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  ctaBtn: {},
  ctaBtnGrad: { borderRadius: radius.button, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  ctaBtnText: { fontSize: 17, fontFamily: 'Inter_700Bold', color: '#fff' },
});
