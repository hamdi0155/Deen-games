export const COLORS = {
  bg: '#000000',
  bgCard: '#0D0D0D',
  bgCardBorder: '#1A1A1A',
  bgInput: '#111111',
  text: '#FFFFFF',
  textMuted: '#888888',
  textDim: '#444444',
  accent: '#6366F1',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
} as const;

export const CATEGORY_COLORS: Record<string, string> = {
  education: '#6366F1',
  career: '#3B82F6',
  finance: '#10B981',
  physical: '#F59E0B',
  appearance: '#EC4899',
  mental: '#8B5CF6',
  social: '#14B8A6',
  relationships: '#EF4444',
  discipline: '#F97316',
  spiritual: '#7C3AED',
  creativity: '#06B6D4',
  leadership: '#D97706',
};

export const DIFFICULTY_COLORS: Record<string, string> = {
  easy: '#10B981',
  medium: '#F59E0B',
  hard: '#EF4444',
  epic: '#8B5CF6',
};

export const FONTS = {
  sizes: { xs: 11, sm: 13, md: 15, lg: 18, xl: 22, xxl: 28, xxxl: 36 },
  weights: { regular: '400' as const, medium: '500' as const, semibold: '600' as const, bold: '700' as const },
};

export const SPACING = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32,
};

export const RADIUS = {
  sm: 8, md: 12, lg: 16, xl: 24, full: 9999,
};
