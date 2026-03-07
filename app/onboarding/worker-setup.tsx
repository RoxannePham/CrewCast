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
const SKILL_OPTIONS = ['House', 'EDM', 'Hip-Hop', 'Techno', 'Photography', 'Videography', 'TikTok', 'Instagram', 'Event Hosting', 'Bartending', 'Brand Activation', 'Lighting', 'Sound', 'Social Media'];
const AVAIL_OPTIONS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const EXP_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Professional'];

type OnboardMode = 'choose' | 'resume' | 'prompts';

export default function WorkerSetupScreen() {
  const insets = useSafeAreaInsets();
  const { signUp, completeOnboarding, updateOnboardingProfile, user } = useAuth();
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<OnboardMode>('choose');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [school, setSchool] = useState('');
  const [major, setMajor] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState('');
  const [loading, setLoading] = useState(false);

  const [resumeAttached, setResumeAttached] = useState(false);
  const [workType, setWorkType] = useState('');
  const [pastExperience, setPastExperience] = useState('');
  const [tools, setTools] = useState('');
  const [rolesLookingFor, setRolesLookingFor] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const botPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const totalSteps = mode === 'choose' ? 1 : 4;
  const currentStep = mode === 'choose' ? 1 : step;

  const toggle = (arr: string[], item: string, setter: (v: string[]) => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setter(arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]);
  };

  const handleResumeUpload = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setResumeAttached(true);
    Alert.alert('Resume Attached', 'Your resume has been attached to your profile. You can replace it anytime from your profile settings.');
  };

  const handleFinish = async () => {
    if (!user && (!name || !email)) {
      Alert.alert('Missing Info', 'Please enter your name and email to continue.');
      return;
    }
    setLoading(true);
    try {
      if (!user) {
        await signUp(name, email, password, 'worker', {
          school,
          major,
          roles: selectedRoles,
          skills: selectedSkills,
          bio,
          availability,
          experienceLevel,
          resumeUri: resumeAttached ? 'local://resume_uploaded.pdf' : null,
          portfolioUrl,
          linkedinUrl,
          promptAnswers: mode === 'prompts' ? {
            workType,
            pastExperience,
            tools,
            rolesLookingFor,
          } : {},
        });
      } else {
        await updateOnboardingProfile({
          school,
          major,
          roles: selectedRoles,
          skills: selectedSkills,
          bio,
          availability,
          experienceLevel,
          resumeUri: resumeAttached ? 'local://resume_uploaded.pdf' : null,
          portfolioUrl,
          linkedinUrl,
          promptAnswers: mode === 'prompts' ? {
            workType,
            pastExperience,
            tools,
            rolesLookingFor,
          } : {},
        });
      }
      await completeOnboarding();
      router.replace('/(tabs)');
    } catch {
      Alert.alert('Error', 'Setup failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const canContinue = () => {
    if (mode === 'choose') return true;
    if (step === 1 && !user) return !!(name && email);
    if (step === 1 && user) return true;
    if (step === 2) return mode === 'resume' ? true : !!(workType || selectedRoles.length > 0);
    if (step === 3) return selectedRoles.length > 0;
    return true;
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (mode === 'choose') return;
    if (step < totalSteps) setStep(s => s + 1);
    else handleFinish();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: topPad + 16, paddingBottom: botPad + 40 }]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            if (mode !== 'choose' && step > 1) setStep(s => s - 1);
            else if (mode !== 'choose') setMode('choose');
            else router.back();
          }}
          style={[styles.backBtn, shadow.card]}
        >
          <Ionicons name="chevron-back" size={22} color={colors.textSecondary} />
        </Pressable>
        {mode !== 'choose' && (
          <View style={styles.progressBar}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <View key={i} style={[styles.progressDot, i + 1 <= step && styles.progressDotActive]} />
            ))}
          </View>
        )}
        <View style={{ width: 40 }} />
      </View>

      {mode === 'choose' && (
        <View style={styles.stepContent}>
          <LinearGradient colors={['#FF8F9B', '#FF5E73']} style={styles.iconCircle}>
            <Ionicons name="person-add" size={28} color="#fff" />
          </LinearGradient>
          <Text style={styles.stepTitle}>Build your profile</Text>
          <Text style={styles.stepSubtitle}>Choose how you want to set up your worker profile</Text>

          <Pressable
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setMode('resume'); setStep(1); }}
            style={({ pressed }) => [styles.modeCard, { transform: [{ scale: pressed ? 0.97 : 1 }] }]}
          >
            <View style={[styles.modeIcon, { backgroundColor: colors.accentLavender + '30' }]}>
              <Ionicons name="document-text" size={24} color={colors.accentLavender} />
            </View>
            <View style={styles.modeInfo}>
              <Text style={styles.modeTitle}>Upload your resume</Text>
              <Text style={styles.modeDesc}>Quick setup — attach your CV and we'll build your profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </Pressable>

          <Pressable
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setMode('prompts'); setStep(1); }}
            style={({ pressed }) => [styles.modeCard, { transform: [{ scale: pressed ? 0.97 : 1 }] }]}
          >
            <View style={[styles.modeIcon, { backgroundColor: colors.accentMint + '40' }]}>
              <Ionicons name="chatbubble-ellipses" size={24} color="#1A6635" />
            </View>
            <View style={styles.modeInfo}>
              <Text style={styles.modeTitle}>Answer a few questions</Text>
              <Text style={styles.modeDesc}>Tell us about your experience and we'll create a profile summary</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </Pressable>
        </View>
      )}

      {mode !== 'choose' && step === 1 && (
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>About you</Text>
          <Text style={styles.stepSubtitle}>Step 1 of {totalSteps} — Basic info</Text>
          {!user && (
            <>
              {[
                { label: 'Full Name *', value: name, setter: setName, placeholder: 'Your full name' },
                { label: 'Email *', value: email, setter: setEmail, placeholder: 'you@email.com', keyboardType: 'email-address' as const },
                { label: 'Password', value: password, setter: setPassword, placeholder: 'Create a password', secure: true },
              ].map(f => (
                <View key={f.label} style={styles.inputGroup}>
                  <Text style={styles.label}>{f.label}</Text>
                  <TextInput
                    style={styles.input}
                    value={f.value}
                    onChangeText={f.setter}
                    placeholder={f.placeholder}
                    placeholderTextColor={colors.textMuted}
                    secureTextEntry={f.secure}
                    keyboardType={f.keyboardType}
                    autoCapitalize={f.keyboardType === 'email-address' ? 'none' : undefined}
                  />
                </View>
              ))}
            </>
          )}
          {[
            { label: 'School / University', value: school, setter: setSchool, placeholder: 'Rutgers, NYU, Columbia...' },
            { label: 'Major / Field', value: major, setter: setMajor, placeholder: 'Computer Science, Business...' },
          ].map(f => (
            <View key={f.label} style={styles.inputGroup}>
              <Text style={styles.label}>{f.label}</Text>
              <TextInput
                style={styles.input}
                value={f.value}
                onChangeText={f.setter}
                placeholder={f.placeholder}
                placeholderTextColor={colors.textMuted}
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

      {mode === 'resume' && step === 2 && (
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>Upload your resume</Text>
          <Text style={styles.stepSubtitle}>Step 2 of {totalSteps} — Your CV/resume</Text>

          <Pressable
            onPress={handleResumeUpload}
            style={[styles.uploadArea, resumeAttached && styles.uploadAreaDone]}
          >
            <View style={[styles.uploadIcon, resumeAttached && styles.uploadIconDone]}>
              <Ionicons name={resumeAttached ? 'checkmark-circle' : 'cloud-upload-outline'} size={36} color={resumeAttached ? '#1A6635' : colors.accentPrimary} />
            </View>
            <Text style={styles.uploadTitle}>{resumeAttached ? 'Resume attached' : 'Tap to upload resume'}</Text>
            <Text style={styles.uploadDesc}>{resumeAttached ? 'Tap to replace' : 'PDF, DOC, or DOCX (max 10MB)'}</Text>
          </Pressable>

          {!resumeAttached && (
            <View style={styles.skipNote}>
              <Ionicons name="information-circle-outline" size={16} color={colors.textMuted} />
              <Text style={styles.skipNoteText}>No resume? No problem — you can skip this and your profile info will be used instead.</Text>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Portfolio / Website (optional)</Text>
            <TextInput
              style={styles.input}
              value={portfolioUrl}
              onChangeText={setPortfolioUrl}
              placeholder="https://your-portfolio.com"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>LinkedIn (optional)</Text>
            <TextInput
              style={styles.input}
              value={linkedinUrl}
              onChangeText={setLinkedinUrl}
              placeholder="https://linkedin.com/in/you"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
            />
          </View>
        </View>
      )}

      {mode === 'prompts' && step === 2 && (
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>Tell us about your experience</Text>
          <Text style={styles.stepSubtitle}>Step 2 of {totalSteps} — Your background</Text>

          {[
            { label: 'What kind of work do you do?', value: workType, setter: setWorkType, placeholder: 'I DJ college events and club nights...' },
            { label: 'What events, teams, or organizations have you worked with before?', value: pastExperience, setter: setPastExperience, placeholder: 'Greek Week at NYU, Club XYZ...' },
            { label: 'What tools or platforms do you know?', value: tools, setter: setTools, placeholder: 'Serato DJ, Lightroom, Final Cut Pro...' },
            { label: 'What roles are you looking for?', value: rolesLookingFor, setter: setRolesLookingFor, placeholder: 'DJ gigs, photography, content creation...' },
          ].map(f => (
            <View key={f.label} style={styles.inputGroup}>
              <Text style={styles.label}>{f.label}</Text>
              <TextInput
                style={[styles.input, styles.textarea]}
                value={f.value}
                onChangeText={f.setter}
                placeholder={f.placeholder}
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={2}
              />
            </View>
          ))}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Experience Level</Text>
            <View style={styles.chipGrid}>
              {EXP_LEVELS.map(level => (
                <Pressable
                  key={level}
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setExperienceLevel(level); }}
                  style={[styles.chip, experienceLevel === level && styles.chipActive]}
                >
                  <Text style={[styles.chipText, experienceLevel === level && styles.chipTextActive]}>{level}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Portfolio / LinkedIn (optional)</Text>
            <TextInput
              style={styles.input}
              value={portfolioUrl}
              onChangeText={setPortfolioUrl}
              placeholder="https://your-portfolio.com or LinkedIn URL"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
            />
          </View>
        </View>
      )}

      {mode !== 'choose' && step === 3 && (
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>Roles & Skills</Text>
          <Text style={styles.stepSubtitle}>Step 3 of {totalSteps} — What you do</Text>
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
          <Text style={[styles.label, { marginTop: spacing.md }]}>Skills & Tags</Text>
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

      {mode !== 'choose' && step === 4 && (
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>Availability</Text>
          <Text style={styles.stepSubtitle}>Step 4 of {totalSteps} — When you're free</Text>
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

          <View style={[styles.reviewCard, shadow.card]}>
            <Text style={styles.reviewTitle}>Profile Preview</Text>
            {name ? <Text style={styles.reviewItem}>{name}</Text> : null}
            {school ? <Text style={styles.reviewMeta}>{school}{major ? ` · ${major}` : ''}</Text> : null}
            {selectedRoles.length > 0 && <Text style={styles.reviewMeta}>Roles: {selectedRoles.join(', ')}</Text>}
            {resumeAttached && (
              <View style={styles.reviewBadge}>
                <Ionicons name="document-text" size={14} color="#1A6635" />
                <Text style={styles.reviewBadgeText}>Resume attached</Text>
              </View>
            )}
            {!resumeAttached && (workType || bio) && (
              <View style={styles.reviewBadge}>
                <Ionicons name="chatbubble-ellipses" size={14} color={colors.accentLavender} />
                <Text style={[styles.reviewBadgeText, { color: colors.accentLavender }]}>Profile summary will be generated</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {mode !== 'choose' && (
        <Pressable
          onPress={handleNext}
          disabled={loading || !canContinue()}
          style={({ pressed }) => [
            styles.ctaBtn,
            { opacity: loading || !canContinue() ? 0.6 : pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] }
          ]}
        >
          <LinearGradient colors={['#FF8F9B', '#FF5E73']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ctaBtnGrad}>
            <Text style={styles.ctaBtnText}>
              {step < totalSteps ? 'Continue' : loading ? 'Setting up...' : "Let's Go!"}
            </Text>
            <Ionicons name={step < totalSteps ? 'arrow-forward' : 'checkmark'} size={18} color="#fff" />
          </LinearGradient>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundPrimary },
  content: { paddingHorizontal: spacing.lg, gap: spacing.lg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceCard, alignItems: 'center', justifyContent: 'center' },
  progressBar: { flexDirection: 'row', gap: 6 },
  progressDot: { width: 24, height: 6, borderRadius: 3, backgroundColor: colors.borderSubtle },
  progressDotActive: { backgroundColor: colors.accentPrimary },
  stepContent: { gap: spacing.md },
  iconCircle: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  stepTitle: { fontSize: 26, fontFamily: 'Inter_700Bold', color: colors.textPrimary },
  stepSubtitle: { ...typography.body, color: colors.textMuted, fontFamily: 'Inter_400Regular', marginTop: -spacing.sm },
  modeCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.surfaceCard, borderRadius: radius.card,
    padding: spacing.md, borderWidth: 1.5, borderColor: colors.borderSubtle,
  },
  modeIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  modeInfo: { flex: 1, gap: 2 },
  modeTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', color: colors.textPrimary },
  modeDesc: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_400Regular', lineHeight: 18 },
  inputGroup: { gap: 6 },
  label: { ...typography.bodyMedium, color: colors.textSecondary, fontFamily: 'Inter_600SemiBold' },
  input: {
    backgroundColor: colors.surfaceCard, borderRadius: radius.small,
    paddingHorizontal: spacing.md, paddingVertical: 14,
    fontSize: 15, color: colors.textPrimary, fontFamily: 'Inter_400Regular',
    borderWidth: 1.5, borderColor: colors.borderSubtle,
  },
  textarea: { minHeight: 70, textAlignVertical: 'top' },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.chip, backgroundColor: colors.surfaceCard, borderWidth: 1.5, borderColor: colors.borderSubtle },
  chipActive: { backgroundColor: colors.accentPrimary, borderColor: colors.accentPrimary },
  chipText: { fontSize: 13, fontFamily: 'Inter_500Medium', color: colors.textSecondary },
  chipTextActive: { color: '#fff' },
  uploadArea: {
    borderWidth: 2, borderColor: colors.accentPrimary + '50', borderStyle: 'dashed',
    borderRadius: radius.card, padding: spacing.xl, alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.accentPrimary + '08',
  },
  uploadAreaDone: { borderColor: '#1A6635' + '50', backgroundColor: '#E0F4E8' + '60', borderStyle: 'solid' },
  uploadIcon: {},
  uploadIconDone: {},
  uploadTitle: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: colors.textPrimary },
  uploadDesc: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
  skipNote: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, paddingHorizontal: 4 },
  skipNoteText: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_400Regular', flex: 1, lineHeight: 18 },
  reviewCard: {
    backgroundColor: colors.surfaceCard, borderRadius: radius.card,
    padding: spacing.md, gap: spacing.sm, marginTop: spacing.sm,
  },
  reviewTitle: { ...typography.sectionTitle, color: colors.textPrimary, fontFamily: 'Inter_700Bold' },
  reviewItem: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: colors.textPrimary },
  reviewMeta: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
  reviewBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  reviewBadgeText: { ...typography.meta, color: '#1A6635', fontFamily: 'Inter_500Medium' },
  ctaBtn: { marginTop: spacing.sm },
  ctaBtnGrad: { borderRadius: radius.button, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  ctaBtnText: { fontSize: 17, fontFamily: 'Inter_700Bold', color: '#fff' },
});
