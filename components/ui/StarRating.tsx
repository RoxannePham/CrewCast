import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '@/constants/theme';

interface StarRatingProps {
  rating: number;
  size?: number;
  showNumber?: boolean;
}

export function StarRating({ rating, size = 13, showNumber = true }: StarRatingProps) {
  const full = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  return (
    <View style={styles.container}>
      {Array.from({ length: 5 }).map((_, i) => {
        let name: 'star' | 'star-half' | 'star-outline' = 'star-outline';
        if (i < full) name = 'star';
        else if (i === full && hasHalf) name = 'star-half';
        return (
          <Ionicons
            key={i}
            name={name}
            size={size}
            color={colors.starGold}
            style={{ marginRight: 1 }}
          />
        );
      })}
      {showNumber && (
        <Text style={[styles.number, { fontSize: size }]}>{rating.toFixed(1)}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  number: {
    ...typography.metaMedium,
    color: colors.textSecondary,
    marginLeft: 4,
    fontFamily: 'Inter_600SemiBold',
  },
});
