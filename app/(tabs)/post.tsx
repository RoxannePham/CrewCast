import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { colors, typography, spacing, radius, shadow } from '@/constants/theme';
import { Chip } from '@/components/ui/Chip';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

const ROLE_TYPES = ['DJ', 'Photographer', 'Videographer', 'Host / MC', 'Content Creator', 'Security', 'Bartender'];

export default function PostScreen() {
  const insets = useSafeAreaInsets();
  const [eventTitle, setEventTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [posted, setPosted] = useState(false);

  const topPadding = Platform.OS === 'web' ? 67 : insets.top;

  const toggleRole = (role: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const handlePost = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setPosted(true);
    setTimeout(() => {
      setPosted(false);
      setEventTitle('');
      setDate('');
      setLocation('');
      setSelectedRoles([]);
      router.replace('/(tabs)');
    }, 1500);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: topPadding + 12, paddingBottom: Platform.OS === 'web' ? 84 : 100 }]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textSecondary} />
        </Pressable>
        <Text style={styles.title}>Post an Event</Text>
        <View style={{ width: 40 }} />
      </View>

      <LinearGradient
        colors={[colors.accentPrimary + '20', colors.accentLavender + '10']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroCard}
      >
        <Ionicons name="calendar" size={32} color={colors.accentPrimary} />
        <Text style={styles.heroText}>Create your event and find the perfect crew</Text>
      </LinearGradient>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Event Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Greek Week Afterparty"
            placeholderTextColor={colors.textMuted}
            value={eventTitle}
            onChangeText={setEventTitle}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Date</Text>
            <TextInput
              style={styles.input}
              placeholder="Apr 20"
              placeholderTextColor={colors.textMuted}
              value={date}
              onChangeText={setDate}
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder="NYU Campus"
              placeholderTextColor={colors.textMuted}
              value={location}
              onChangeText={setLocation}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Roles Needed</Text>
          <View style={styles.rolesGrid}>
            {ROLE_TYPES.map(role => (
              <Chip
                key={role}
                label={role}
                selected={selectedRoles.includes(role)}
                onPress={() => toggleRole(role)}
                style={{ marginRight: 6, marginBottom: 6 }}
              />
            ))}
          </View>
        </View>

        {selectedRoles.length > 0 && (
          <View style={[styles.selectedInfo, shadow.card]}>
            <Feather name="check-circle" size={16} color={colors.accentMint.replace('BFF0D4', '1A6635')} />
            <Text style={styles.selectedText}>
              {selectedRoles.length} role{selectedRoles.length > 1 ? 's' : ''} selected: {selectedRoles.join(', ')}
            </Text>
          </View>
        )}

        <PrimaryButton
          label={posted ? 'Posted!' : 'Publish Event'}
          onPress={handlePost}
          size="large"
          disabled={!eventTitle || !date || selectedRoles.length === 0}
          style={{ marginTop: spacing.md }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  content: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceCard,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  title: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
    fontFamily: 'Inter_700Bold',
  },
  heroCard: {
    borderRadius: radius.card,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  heroText: {
    ...typography.cardTitle,
    color: colors.textSecondary,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  form: {
    gap: spacing.md,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    fontFamily: 'Inter_600SemiBold',
  },
  input: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.small,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.textPrimary,
    fontFamily: 'Inter_400Regular',
    borderWidth: 1.5,
    borderColor: colors.borderSubtle,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  rolesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.accentMint + '30',
    borderRadius: radius.small,
    padding: spacing.md,
  },
  selectedText: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
    fontFamily: 'Inter_400Regular',
  },
});
