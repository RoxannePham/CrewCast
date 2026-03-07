import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, radius } from '@/constants/theme';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onPress?: () => void;
}

export function SearchBar({ placeholder = 'Search gigs...', value, onChangeText, onPress }: SearchBarProps) {
  const [focused, setFocused] = useState(false);

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={[styles.bar, focused && styles.barFocused]}>
        <Feather name="search" size={17} color={colors.textMuted} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.button,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: colors.borderSubtle,
  },
  barFocused: {
    borderColor: colors.accentPrimary,
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: 'Inter_400Regular',
  },
});
