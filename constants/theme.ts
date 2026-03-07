export const colors = {
  backgroundPrimary: '#F6F1E8',
  backgroundSecondary: '#EFE8DC',
  surfaceCard: '#FFFFFF',
  surfaceTint: '#F7F3EC',
  borderSubtle: '#E6DED1',
  accentPrimary: '#FF7B8A',
  accentPrimaryHover: '#FF667A',
  accentPrimaryPressed: '#FF5E73',
  accentLavender: '#CDB9FF',
  accentBlue: '#B9D9FF',
  accentMint: '#BFF0D4',
  accentPeach: '#FFD9B8',
  textPrimary: '#1E1E1E',
  textSecondary: '#5A5A5A',
  textMuted: '#8F8F8F',
  textInverse: '#FFFFFF',
  starGold: '#FFB800',
};

export const typography = {
  eventTitle: { fontSize: 30, fontWeight: '700' as const, fontFamily: 'Inter_700Bold' },
  sectionTitle: { fontSize: 18, fontWeight: '600' as const, fontFamily: 'Inter_600SemiBold' },
  cardTitle: { fontSize: 16, fontWeight: '600' as const, fontFamily: 'Inter_600SemiBold' },
  body: { fontSize: 14, fontWeight: '400' as const, fontFamily: 'Inter_400Regular' },
  bodyMedium: { fontSize: 14, fontWeight: '500' as const, fontFamily: 'Inter_500Medium' },
  meta: { fontSize: 12, fontWeight: '400' as const, fontFamily: 'Inter_400Regular' },
  metaMedium: { fontSize: 12, fontWeight: '500' as const, fontFamily: 'Inter_500Medium' },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const radius = {
  card: 22,
  button: 999,
  chip: 999,
  small: 12,
  medium: 16,
};

export const shadow = {
  card: {
    shadowColor: '#1E1E1E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  cardHeavy: {
    shadowColor: '#1E1E1E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
};
