export const COLORS = {
  bg: '#050508',
  bgCard: 'rgba(255,255,255,0.04)',
  bgCardBorder: 'rgba(255,255,255,0.09)',
  bgInput: 'rgba(255,255,255,0.06)',
  text: '#F0F0FF',
  textMuted: '#9095A8',
  textDim: '#454860',
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
  sizes: { xs: 11, sm: 13, md: 15, lg: 18, xl: 23, xxl: 30, xxxl: 42 },
  weights: { regular: '400' as const, medium: '500' as const, semibold: '600' as const, bold: '700' as const },
};

export const SPACING = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 40,
};

export const RADIUS = {
  sm: 10, md: 16, lg: 20, xl: 28, full: 9999,
};

// Height of floating tab bar + its bottom margin — used for scroll bottom padding
export const TAB_BAR_OFFSET = 90;
