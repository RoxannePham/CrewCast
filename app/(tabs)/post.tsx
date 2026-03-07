import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
  TextInput, Platform, Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, radius, shadow } from '@/constants/theme';
import { Chip } from '@/components/ui/Chip';

const EVENT_TYPES = ['Greek Life', 'College Party', 'Networking', 'Brand Launch', 'Rave/Club', 'Cultural Event', 'Charity', 'Corporate', 'Fashion Show', 'Campus Festival'];
const ROLE_TYPES = ['DJ', 'Photographer', 'Videographer', 'Host/MC', 'Content Creator', 'Bartender', 'Security', 'Volunteer', 'Setup Crew'];

interface RoleEntry {
  id: string;
  roleType: string;
  pay: string;
  slots: string;
  shiftStart: string;
  shiftEnd: string;
  notes: string;
}

export default function PostEventScreen() {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [dressCode, setDressCode] = useState('');
  const [expectedAttendance, setExpectedAttendance] = useState('');
  const [roles, setRoles] = useState<RoleEntry[]>([]);
  const [addingRole, setAddingRole] = useState(false);
  const [newRole, setNewRole] = useState<Partial<RoleEntry>>({ roleType: '', pay: '', slots: '1', shiftStart: '', shiftEnd: '', notes: '' });
  const [loading, setLoading] = useState(false);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const botPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const totalSteps = 3;

  const addRole = () => {
    if (!newRole.roleType || !newRole.pay) {
      Alert.alert('Missing info', 'Please set role type and pay rate.');
      return;
    }
    setRoles(prev => [...prev, { ...newRole as RoleEntry, id: `r_${Date.now()}` }]);
    setNewRole({ roleType: '', pay: '', slots: '1', shiftStart: '', shiftEnd: '', notes: '' });
    setAddingRole(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const removeRole = (id: string) => {
    setRoles(prev => prev.filter(r => r.id !== id));
  };

  const handlePost = () => {
    if (!title || !date || !location) {
      Alert.alert('Missing info', 'Please fill in title, date, and location.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Event Posted!', 'Your event has been posted and crew can now apply.', [
        { text: 'View Event', onPress: () => {} },
        { text: 'Done', style: 'default' },
      ]);
    }, 1200);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: topPad + 12, paddingBottom: botPad + 60 }]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Post an Event</Text>
        <View style={styles.progressDots}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <View key={i} style={[styles.dot, i + 1 <= step && styles.dotActive]} />
          ))}
        </View>
      </View>

      {/* Step 1: Event details */}
      {step === 1 && (
        <View style={styles.stepSection}>
          <View style={[styles.card, shadow.card]}>
            <Text style={styles.cardTitle}>Event Info</Text>
            {[
              { label: 'Event Title *', value: title, setter: setTitle, placeholder: 'Spring Fling 2026' },
              { label: 'Date *', value: date, setter: setDate, placeholder: 'April 20, 2026' },
              { label: 'Time', value: time, setter: setTime, placeholder: '9PM – 1AM' },
              { label: 'Location *', value: location, setter: setLocation, placeholder: 'NYU Palladium' },
              { label: 'Address', value: address, setter: setAddress, placeholder: '140 E 14th St, New York, NY' },
            ].map(f => (
              <View key={f.label} style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{f.label}</Text>
                <TextInput
                  style={styles.input}
                  value={f.value}
                  onChangeText={f.setter}
                  placeholder={f.placeholder}
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            ))}
          </View>

          <View style={[styles.card, shadow.card]}>
            <Text style={styles.cardTitle}>Event Type</Text>
            <View style={styles.chipGrid}>
              {EVENT_TYPES.map(et => (
                <Pressable
                  key={et}
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setEventType(et); }}
                  style={[styles.typeChip, eventType === et && styles.typeChipActive]}
                >
                  <Text style={[styles.typeChipText, eventType === et && styles.typeChipTextActive]}>{et}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Step 2: Description & Details */}
      {step === 2 && (
        <View style={styles.stepSection}>
          <View style={[styles.card, shadow.card]}>
            <Text style={styles.cardTitle}>Description</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your event, the vibe, and what crew can expect..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={4}
            />
          </View>
          <View style={[styles.card, shadow.card]}>
            <Text style={styles.cardTitle}>Details</Text>
            {[
              { label: 'Expected Attendance', value: expectedAttendance, setter: setExpectedAttendance, placeholder: '200' },
              { label: 'Dress Code', value: dressCode, setter: setDressCode, placeholder: 'Dressy Casual' },
            ].map(f => (
              <View key={f.label} style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{f.label}</Text>
                <TextInput
                  style={styles.input}
                  value={f.value}
                  onChangeText={f.setter}
                  placeholder={f.placeholder}
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Step 3: Roles */}
      {step === 3 && (
        <View style={styles.stepSection}>
          <Text style={styles.stepTitle}>Add crew roles</Text>
          <Text style={styles.stepSubtitle}>Tell workers what you need and what you'll pay.</Text>

          {roles.map(role => (
            <View key={role.id} style={[styles.roleRow, shadow.card]}>
              <View style={styles.roleInfo}>
                <Text style={styles.roleType}>{role.roleType}</Text>
                <Text style={styles.roleMeta}>${role.pay} · {role.slots} slot{parseInt(role.slots) > 1 ? 's' : ''} · {role.shiftStart}{role.shiftEnd ? ` – ${role.shiftEnd}` : ''}</Text>
              </View>
              <Pressable onPress={() => removeRole(role.id)}>
                <Ionicons name="close-circle" size={22} color={colors.textMuted} />
              </Pressable>
            </View>
          ))}

          {!addingRole ? (
            <Pressable
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setAddingRole(true); }}
              style={[styles.addRoleBtn, shadow.card]}
            >
              <Ionicons name="add-circle-outline" size={22} color={colors.accentPrimary} />
              <Text style={styles.addRoleBtnText}>Add a role</Text>
            </Pressable>
          ) : (
            <View style={[styles.card, shadow.card]}>
              <Text style={styles.cardTitle}>New Role</Text>
              <Text style={styles.inputLabel}>Role Type *</Text>
              <View style={styles.chipGrid}>
                {ROLE_TYPES.map(rt => (
                  <Pressable
                    key={rt}
                    onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setNewRole(r => ({ ...r, roleType: rt })); }}
                    style={[styles.typeChip, newRole.roleType === rt && styles.typeChipActive]}
                  >
                    <Text style={[styles.typeChipText, newRole.roleType === rt && styles.typeChipTextActive]}>{rt}</Text>
                  </Pressable>
                ))}
              </View>
              {[
                { label: 'Pay ($) *', key: 'pay', placeholder: '200', keyboardType: 'numeric' as const },
                { label: 'Slots', key: 'slots', placeholder: '1', keyboardType: 'numeric' as const },
                { label: 'Shift Start', key: 'shiftStart', placeholder: '9PM' },
                { label: 'Shift End', key: 'shiftEnd', placeholder: '1AM' },
                { label: 'Notes', key: 'notes', placeholder: 'Any special requirements...' },
              ].map(f => (
                <View key={f.key} style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{f.label}</Text>
                  <TextInput
                    style={styles.input}
                    value={(newRole as any)[f.key] || ''}
                    onChangeText={v => setNewRole(r => ({ ...r, [f.key]: v }))}
                    placeholder={f.placeholder}
                    placeholderTextColor={colors.textMuted}
                    keyboardType={f.keyboardType}
                  />
                </View>
              ))}
              <View style={styles.addRoleActions}>
                <Pressable onPress={() => setAddingRole(false)} style={styles.cancelRoleBtn}>
                  <Text style={styles.cancelRoleBtnText}>Cancel</Text>
                </Pressable>
                <Pressable onPress={addRole} style={styles.confirmRoleBtn}>
                  <Text style={styles.confirmRoleBtnText}>Add Role</Text>
                </Pressable>
              </View>
            </View>
          )}

          {roles.length === 0 && !addingRole && (
            <View style={styles.emptyRoles}>
              <Ionicons name="people-outline" size={36} color={colors.textMuted} />
              <Text style={styles.emptyRolesText}>No roles added yet. Add at least one!</Text>
            </View>
          )}
        </View>
      )}

      {/* Navigation */}
      <View style={styles.navRow}>
        {step > 1 && (
          <Pressable onPress={() => setStep(s => s - 1)} style={[styles.backBtn, shadow.card]}>
            <Ionicons name="chevron-back" size={20} color={colors.textSecondary} />
            <Text style={styles.backBtnText}>Back</Text>
          </Pressable>
        )}
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            if (step < totalSteps) setStep(s => s + 1);
            else handlePost();
          }}
          disabled={loading}
          style={({ pressed }) => [styles.nextBtn, { opacity: loading ? 0.7 : pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.97 : 1 }], flex: step > 1 ? 1 : undefined }]}
        >
          <LinearGradient colors={['#FF8F9B', '#FF5E73']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.nextBtnGrad}>
            <Text style={styles.nextBtnText}>{step < totalSteps ? 'Next' : loading ? 'Posting...' : 'Post Event'}</Text>
            {step === totalSteps && <Ionicons name="checkmark" size={18} color="#fff" />}
          </LinearGradient>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundPrimary },
  content: { paddingHorizontal: spacing.md, gap: spacing.md },
  header: { gap: spacing.sm },
  title: { fontSize: 28, fontFamily: 'Inter_700Bold', color: colors.textPrimary },
  progressDots: { flexDirection: 'row', gap: 8 },
  dot: { width: 32, height: 6, borderRadius: 3, backgroundColor: colors.borderSubtle },
  dotActive: { backgroundColor: colors.accentPrimary },
  stepSection: { gap: spacing.md },
  stepTitle: { fontSize: 22, fontFamily: 'Inter_700Bold', color: colors.textPrimary },
  stepSubtitle: { ...typography.body, color: colors.textMuted, fontFamily: 'Inter_400Regular', marginTop: -spacing.sm },
  card: { backgroundColor: colors.surfaceCard, borderRadius: radius.card, padding: spacing.md, gap: spacing.md },
  cardTitle: { ...typography.sectionTitle, color: colors.textPrimary, fontFamily: 'Inter_700Bold' },
  inputGroup: { gap: 6 },
  inputLabel: { ...typography.bodyMedium, color: colors.textSecondary, fontFamily: 'Inter_600SemiBold' },
  input: { backgroundColor: colors.backgroundPrimary, borderRadius: radius.small, paddingHorizontal: spacing.md, paddingVertical: 12, fontSize: 15, color: colors.textPrimary, fontFamily: 'Inter_400Regular', borderWidth: 1.5, borderColor: colors.borderSubtle },
  textarea: { minHeight: 100, textAlignVertical: 'top' },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeChip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: radius.chip, backgroundColor: colors.backgroundPrimary, borderWidth: 1.5, borderColor: colors.borderSubtle },
  typeChipActive: { backgroundColor: colors.accentPrimary, borderColor: colors.accentPrimary },
  typeChipText: { fontSize: 13, fontFamily: 'Inter_500Medium', color: colors.textSecondary },
  typeChipTextActive: { color: '#fff', fontFamily: 'Inter_600SemiBold' },
  roleRow: { backgroundColor: colors.surfaceCard, borderRadius: radius.card, padding: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  roleInfo: { flex: 1, gap: 2 },
  roleType: { fontSize: 16, fontFamily: 'Inter_700Bold', color: colors.textPrimary },
  roleMeta: { ...typography.meta, color: colors.textMuted, fontFamily: 'Inter_400Regular' },
  addRoleBtn: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.surfaceCard, borderRadius: radius.card, padding: spacing.md, borderWidth: 1.5, borderColor: colors.accentPrimary + '40', borderStyle: 'dashed' },
  addRoleBtnText: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: colors.accentPrimary },
  addRoleActions: { flexDirection: 'row', gap: spacing.sm },
  cancelRoleBtn: { flex: 1, backgroundColor: colors.backgroundPrimary, borderRadius: radius.button, paddingVertical: 12, alignItems: 'center', borderWidth: 1.5, borderColor: colors.borderSubtle },
  cancelRoleBtnText: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: colors.textSecondary },
  confirmRoleBtn: { flex: 1, backgroundColor: colors.accentPrimary, borderRadius: radius.button, paddingVertical: 12, alignItems: 'center' },
  confirmRoleBtnText: { fontSize: 14, fontFamily: 'Inter_700Bold', color: '#fff' },
  emptyRoles: { alignItems: 'center', paddingVertical: spacing.xl, gap: spacing.sm },
  emptyRolesText: { ...typography.body, color: colors.textMuted, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  navRow: { flexDirection: 'row', gap: spacing.sm },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.surfaceCard, borderRadius: radius.button, paddingHorizontal: spacing.lg, paddingVertical: 14 },
  backBtnText: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: colors.textSecondary },
  nextBtn: {},
  nextBtnGrad: { borderRadius: radius.button, paddingVertical: 14, paddingHorizontal: spacing.xl, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  nextBtnText: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#fff' },
});
