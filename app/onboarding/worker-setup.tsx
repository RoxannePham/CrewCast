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

const ROLE_OPTIONS = ['DJ', 'Photographer', 'Videographer', 'Host/MC', 'Content Creator', 'Bartender', 'Security', 'Volunteer', 'Setup Crew'];
const SKILL_OPTIONS = ['House', 'EDM', 'Hip-Hop', 'Techno', 'Photography', 'Videography', 'TikTok', 'Instagram', 'Event Hosting', 'Bartending', 'Brand Activation'];
const AVAIL_OPTIONS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function WorkerSetupScreen() {
  const insets = useSafeAreaInsets();
  const { signUp, completeOnboarding } = useAuth();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [school, setSchool] = useState('');
  const [city, setCity] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const botPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const totalSteps = 3;

  const toggle = (arr: string[], item: string, setter: (v: string[]) => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setter(arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]);
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await signUp(name || 'New Worker', email || 'user@crewcast.com', password, 'worker');
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
      {/* Header */}
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
          <Text style={styles.stepTitle}>Tell us about you</Text>
          <Text style={styles.stepSubtitle}>Step 1 of {totalSteps}</Text>
          {[
            { label: 'Full Name', value: name, setter: setName, placeholder: 'Alex Kim' },
            { label: 'Email', value: email, setter: setEmail, placeholder: 'you@email.com' },
            { label: 'Password', value: password, setter: setPassword, placeholder: 'Create a password' },
            { label: 'School / Organization', value: school, setter: setSchool, placeholder: 'NYU, Columbia, etc.' },
            { label: 'City / Area', value: city, setter: setCity, placeholder: 'New York, NY' },
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
            <Text style={styles.label}>Short Bio</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell hosts what you do and what makes you great..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>
      )}

      {step === 2 && (
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>Your roles & skills</Text>
          <Text style={styles.stepSubtitle}>Step 2 of {totalSteps}</Text>
          <Text style={styles.label}>What do you do? (select all that apply)</Text>
          <View style={styles.chipGrid}>
            {ROLE_OPTIONS.map(role => (
              <Pressable
                key={role}
                onPress={() => toggle(selectedRoles, role, setSelectedRoles)}
                style={[styles.chip, selectedRoles.includes(role) && styles.chipActive]}
              >
                <Text style={[styles.chipText, selectedRoles.includes(role) && styles.chipTextActive]}>{role}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={[styles.label, { marginTop: spacing.md }]}>Skills / Tags</Text>
          <View style={styles.chipGrid}>
            {SKILL_OPTIONS.map(skill => (
              <Pressable
                key={skill}
                onPress={() => toggle(selectedSkills, skill, setSelectedSkills)}
                style={[styles.chip, selectedSkills.includes(skill) && styles.chipActive]}
              >
                <Text style={[styles.chipText, selectedSkills.includes(skill) && styles.chipTextActive]}>{skill}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {step === 3 && (
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>Availability & preferences</Text>
          <Text style={styles.stepSubtitle}>Step 3 of {totalSteps}</Text>
          <Text style={styles.label}>When are you available?</Text>
          <View style={styles.chipGrid}>
            {AVAIL_OPTIONS.map(day => (
              <Pressable
                key={day}
                onPress={() => toggle(availability, day, setAvailability)}
                style={[styles.chip, availability.includes(day) && styles.chipActive]}
              >
                <Text style={[styles.chipText, availability.includes(day) && styles.chipTextActive]}>{day}</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.label}>I have my own equipment</Text>
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.label}>I can travel for gigs</Text>
          </View>
        </View>
      )}

      {/* CTA */}
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          if (step < totalSteps) setStep(s => s + 1);
          else handleFinish();
        }}
        disabled={loading}
        style={({ pressed }) => [styles.ctaBtn, { opacity: loading ? 0.7 : pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] }]}
      >
        <LinearGradient colors={['#FF8F9B', '#FF5E73']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ctaBtnGrad}>
          <Text style={styles.ctaBtnText}>{step < totalSteps ? 'Continue' : loading ? 'Setting up...' : "Let's Go!"}</Text>
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
  progressDot: { width: 28, height: 6, borderRadius: 3, backgroundColor: colors.borderSubtle },
  progressDotActive: { backgroundColor: colors.accentPrimary },
  stepContent: { gap: spacing.md },
  stepTitle: { fontSize: 26, fontFamily: 'Inter_700Bold', color: colors.textPrimary },
  stepSubtitle: { ...typography.body, color: colors.textMuted, fontFamily: 'Inter_400Regular', marginTop: -spacing.sm },
  inputGroup: { gap: 6 },
  label: { ...typography.bodyMedium, color: colors.textSecondary, fontFamily: 'Inter_600SemiBold' },
  input: {
    backgroundColor: colors.surfaceCard, borderRadius: radius.small,
    paddingHorizontal: spacing.md, paddingVertical: 14,
    fontSize: 15, color: colors.textPrimary, fontFamily: 'Inter_400Regular',
    borderWidth: 1.5, borderColor: colors.borderSubtle,
  },
  textarea: { minHeight: 80, textAlignVertical: 'top' },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.chip, backgroundColor: colors.surfaceCard, borderWidth: 1.5, borderColor: colors.borderSubtle },
  chipActive: { backgroundColor: colors.accentPrimary, borderColor: colors.accentPrimary },
  chipText: { fontSize: 13, fontFamily: 'Inter_500Medium', color: colors.textSecondary },
  chipTextActive: { color: '#fff' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surfaceCard, borderRadius: radius.small, padding: spacing.md },
  ctaBtn: { marginTop: spacing.sm },
  ctaBtnGrad: { borderRadius: radius.button, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  ctaBtnText: { fontSize: 17, fontFamily: 'Inter_700Bold', color: '#fff' },
});
