// ============================================================
// ASCEND DESIGN LANGUAGE v2.0 — The Constitution
// ============================================================

export const COLORS = {
  // Foundation
  bg: '#0E0B1A',            // ADHD spec: deep indigo-black canvas
  bgDeep: '#07050F',
  bgCard: 'rgba(255,255,255,0.06)',
  bgCardElevated: 'rgba(255,255,255,0.09)',
  bgCardBorder: 'rgba(255,255,255,0.10)',
  bgInput: 'rgba(255,255,255,0.06)',
  bgModal: 'rgba(14,11,26,0.97)',

  // Text hierarchy
  text: '#F2EEE6',           // ADHD spec: text-warm (off-white, easier on eyes)
  textSecondary: 'rgba(242,238,230,0.55)', // ADHD spec: text-dim
  textMuted: 'rgba(242,238,230,0.55)',
  textDim: 'rgba(242,238,230,0.25)',

  // Semantic accents
  accent: '#8B7CF6',                    // ADHD spec: violet-flow (progress, in-motion)
  accentDim: 'rgba(139,124,246,0.14)',

  gold: '#FFB23E',                      // ADHD spec: xp-gold — SACRED, reward only
  goldDim: 'rgba(255,178,62,0.14)',

  success: '#6BCB8B',                   // ADHD spec: success-soft (gentle green)
  successDim: 'rgba(107,203,139,0.14)',

  danger: '#E84545',
  dangerDim: 'rgba(232,69,69,0.12)',

  warning: '#E8941A',
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
    // Display = Sora (geometric, premium, confident — Apple/Linear lineage).
    // Swapped from Cinzel serif to shed the fantasy-RPG feel.
    display:      'Sora_600SemiBold',
    displayBold:  'Sora_700Bold',
    displayMedium:'Sora_500Medium',
    displayLight: 'Sora_400Regular',
    // Body = Inter (the open SF Pro analogue) for clarity at small sizes.
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

// ------------------------------------------------------------
// TYPE — structured hierarchy (Apple-principled).
// Spread a preset onto a Text style: style={[TYPE.title, { color }]}
// Hero → Display → Title → Section → Body → Caption → Micro
// ------------------------------------------------------------
export const TYPE = {
  hero: {
    fontFamily: 'Sora_700Bold',
    fontSize: 42,
    letterSpacing: -1.2,
    lineHeight: 46,
  },
  display: {
    fontFamily: 'Sora_700Bold',
    fontSize: 30,
    letterSpacing: -0.8,
    lineHeight: 34,
  },
  title: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 23,
    letterSpacing: -0.4,
    lineHeight: 28,
  },
  section: {
    // Section eyebrows — small, confident, lightly tracked (not shouting caps).
    fontFamily: 'Sora_600SemiBold',
    fontSize: 13,
    letterSpacing: 0.4,
    lineHeight: 16,
  },
  body: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    letterSpacing: -0.1,
    lineHeight: 22,
  },
  bodyStrong: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    letterSpacing: -0.1,
    lineHeight: 22,
  },
  caption: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    letterSpacing: 0,
    lineHeight: 18,
  },
  micro: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    letterSpacing: 0.2,
    lineHeight: 14,
  },
  // Numeric / metric readouts (HUD figures) — tabular feel.
  metric: {
    fontFamily: 'Sora_700Bold',
    fontSize: 28,
    letterSpacing: -0.5,
    lineHeight: 32,
  },
} as const;

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
  snappy:     { damping: 18, stiffness: 280 },
  responsive: { damping: 22, stiffness: 220 },
  gentle:     { damping: 28, stiffness: 150 },
  luxe:       { damping: 32, stiffness: 120 },
  // ADHD spec: reward spring — satisfying overshoot
  pop:        { damping: 12, stiffness: 260 },
};

// Animation durations (ms)
export const DURATION = {
  instant:  150,   // ADHD spec: feedback within 150ms
  fast:     220,   // ADHD spec: dur-quiet navigation
  standard: 300,
  emphasis: 450,
  scene:    600,   // ADHD spec: dur-reward full sequence
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
