// ============================================================
// ASCEND DESIGN LANGUAGE v2.0 — The Constitution
// ============================================================

export const COLORS = {
  // Foundation
  bg: '#07090F',
  bgDeep: '#040508',
  bgCard: 'rgba(255,255,255,0.035)',
  bgCardElevated: 'rgba(255,255,255,0.055)',
  bgCardBorder: 'rgba(255,255,255,0.08)',
  bgInput: 'rgba(255,255,255,0.055)',
  bgModal: 'rgba(7,9,15,0.95)',

  // Text hierarchy
  text: '#E8EAF0',           // Platinum
  textSecondary: '#9097AE',  // Silver
  textMuted: '#9097AE',      // alias kept for compat
  textDim: '#3D4055',        // Smoke

  // Semantic accents
  accent: '#5B6CF5',                    // Sapphire
  accentDim: 'rgba(91,108,245,0.12)',

  gold: '#C9A84C',                      // Brass Gold — achievement
  goldDim: 'rgba(201,168,76,0.12)',

  success: '#0EA875',                   // Soft Emerald
  successDim: 'rgba(14,168,117,0.12)',

  danger: '#E84545',                    // Ruby
  dangerDim: 'rgba(232,69,69,0.12)',

  warning: '#E8941A',                   // Amber — habits/energy
  warningDim: 'rgba(232,148,26,0.12)',
} as const;

export const CATEGORY_COLORS: Record<string, string> = {
  education:     '#5B6CF5',  // Sapphire
  career:        '#3B82F6',  // Blue
  finance:       '#0EA875',  // Emerald
  physical:      '#E8941A',  // Amber
  appearance:    '#E879A0',  // Rose
  mental:        '#8B5CF6',  // Violet
  social:        '#0BBFAF',  // Teal
  relationships: '#E84545',  // Ruby
  discipline:    '#F97316',  // Orange
  spiritual:     '#7C3AED',  // Deep Purple
  creativity:    '#06B6D4',  // Cyan
  leadership:    '#C9A84C',  // Gold
};

export const DIFFICULTY_COLORS: Record<string, string> = {
  easy:   '#0EA875',
  medium: '#E8941A',
  hard:   '#E84545',
  epic:   '#8B5CF6',
};

export const FONTS = {
  families: {
    display:      'Cinzel_700Bold',
    displayBold:  'Cinzel_800ExtraBold',
    displayMedium:'Cinzel_600SemiBold',
    displayLight: 'Cinzel_400Regular',
    body:         'Inter_400Regular',
    bodyMedium:   'Inter_500Medium',
    bodySemibold: 'Inter_600SemiBold',
    bodyBold:     'Inter_700Bold',
  },
  sizes: {
    xs:   11,
    sm:   13,
    md:   15,
    lg:   18,
    xl:   23,
    xxl:  30,
    xxxl: 42,
  },
  weights: {
    regular:  '400' as const,
    medium:   '500' as const,
    semibold: '600' as const,
    bold:     '700' as const,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 40,
};

export const RADIUS = {
  xs:   6,    // tags, badges
  sm:   10,   // icon boxes, chips
  md:   16,   // standard cards
  lg:   20,   // featured cards
  xl:   28,   // modals, sheets, tab bar
  full: 9999, // pills, avatars
};

// Spring physics configs (for Reanimated withSpring)
export const SPRING = {
  snappy:     { damping: 18, stiffness: 280 },  // buttons, toggles
  responsive: { damping: 22, stiffness: 220 },  // cards, reveals
  gentle:     { damping: 28, stiffness: 150 },  // modals, sheets
  luxe:       { damping: 32, stiffness: 120 },  // hero moments
};

// Animation durations (ms)
export const DURATION = {
  instant:  100,
  fast:     200,
  standard: 300,
  emphasis: 450,
  scene:    650,
  ambient:  8000,
};

// Elevation shadow presets (spread across usage)
export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.55,
    shadowRadius: 18,
    elevation: 10,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.70,
    shadowRadius: 32,
    elevation: 20,
  },
};

// Height of floating tab bar + bottom margin
export const TAB_BAR_OFFSET = 90;
