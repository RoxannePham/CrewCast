import React from 'react';
import { View, Text, StyleSheet, Pressable, ImageBackground, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadow } from '@/constants/theme';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Event } from '@/context/AppContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - spacing.md * 2;

interface EventHeroCardProps {
  event: Event;
  onApply: () => void;
  applied?: boolean;
}

export function EventHeroCard({ event, onApply, applied }: EventHeroCardProps) {
  return (
    <Pressable
      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
      style={({ pressed }) => [
        styles.card,
        shadow.cardHeavy,
        { transform: [{ scale: pressed ? 0.98 : 1 }] }
      ]}
    >
      <View style={styles.imageContainer}>
        {event.coverImage ? (
          <ImageBackground source={{ uri: event.coverImage }} style={styles.image} imageStyle={{ borderRadius: radius.card }}>
            <LinearGradient
              colors={['transparent', 'rgba(20,10,30,0.75)', 'rgba(10,5,20,0.92)']}
              style={styles.gradient}
            />
            <CardContent event={event} onApply={onApply} applied={applied} />
          </ImageBackground>
        ) : (
          <LinearGradient
            colors={[event.themeColor + 'CC', event.themeColor + '44', '#1E0830']}
            start={{ x: 0.3, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.image, { borderRadius: radius.card }]}
          >
            <View style={styles.fallbackPattern}>
              <Text style={styles.sigmaText}>ΣΣ</Text>
            </View>
            <LinearGradient
              colors={['transparent', 'rgba(10,5,20,0.7)', 'rgba(5,2,15,0.9)']}
              style={styles.gradient}
            />
            <CardContent event={event} onApply={onApply} applied={applied} />
          </LinearGradient>
        )}
      </View>
    </Pressable>
  );
}

function CardContent({ event, onApply, applied }: { event: Event; onApply: () => void; applied?: boolean }) {
  return (
    <View style={styles.content}>
      <View style={styles.topRow}>
        <View style={styles.avatarRow}>
          {[colors.accentPrimary, colors.accentLavender, colors.accentMint].map((c, i) => (
            <View key={i} style={[styles.miniAvatar, { backgroundColor: c, marginLeft: i > 0 ? -8 : 0 }]} />
          ))}
        </View>
      </View>
      <View style={styles.bottomRow}>
        <View style={styles.textBlock}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.eventMeta}>{event.date} • {event.time}</Text>
          </View>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={12} color={colors.textInverse + 'BB'} />
            <Text style={styles.locationText}>{event.distance}</Text>
          </View>
        </View>
        <PrimaryButton
          label={applied ? 'Applied' : 'Apply'}
          onPress={onApply}
          size="small"
          disabled={applied}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    backgroundColor: colors.surfaceCard,
  },
  imageContainer: {
    borderRadius: radius.card,
    overflow: 'hidden',
  },
  image: {
    width: CARD_WIDTH,
    height: 200,
    justifyContent: 'flex-end',
  },
  fallbackPattern: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sigmaText: {
    fontSize: 64,
    color: 'rgba(255,255,255,0.15)',
    fontFamily: 'Inter_700Bold',
  },
  gradient: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: 140,
    borderBottomLeftRadius: radius.card,
    borderBottomRightRadius: radius.card,
  },
  content: {
    padding: spacing.md,
    justifyContent: 'space-between',
    flex: 0,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: spacing.sm,
  },
  avatarRow: {
    flexDirection: 'row',
  },
  miniAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  textBlock: {
    flex: 1,
    marginRight: spacing.sm,
  },
  eventTitle: {
    ...typography.cardTitle,
    color: colors.textInverse,
    fontSize: 18,
    marginBottom: 4,
    fontFamily: 'Inter_700Bold',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  eventMeta: {
    ...typography.meta,
    color: colors.textInverse + 'CC',
    fontFamily: 'Inter_400Regular',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  locationText: {
    ...typography.meta,
    color: colors.textInverse + 'BB',
    fontFamily: 'Inter_400Regular',
  },
});
