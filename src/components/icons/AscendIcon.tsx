// ============================================================
// ASCEND ICON SYSTEM — custom, proprietary glyphs
// ------------------------------------------------------------
// Design grid:   24 × 24
// Stroke:        1.8 default, round caps + round joins
// Geometry:      composed from primitives (no icon-font glyphs)
// Philosophy:    SF-Symbols precision, luxury restraint.
//                Every glyph is recognizable at 20px and elegant at 64px.
// Usage:         <AscendIcon name="focus" size={24} color={COLORS.accent} />
// ============================================================
import React from 'react';
import Svg, { Path, Circle, Line, Rect, Polyline, Ellipse, G } from 'react-native-svg';

export type AscendIconName =
  // Life domains
  | 'education' | 'career' | 'finance' | 'physical' | 'appearance' | 'mental'
  | 'social' | 'relationships' | 'discipline' | 'spiritual' | 'creativity' | 'leadership'
  // Navigation + core
  | 'home' | 'goals' | 'focus' | 'habits' | 'stats' | 'profile' | 'settings'
  // Actions + status
  | 'achievement' | 'flame' | 'check' | 'plus' | 'close' | 'star'
  | 'chevron-right' | 'chevron-left' | 'chevron-down' | 'arrow-up' | 'sparkle' | 'lock'
  // Extended functional set
  | 'check-circle' | 'circle' | 'diamond' | 'flash' | 'build' | 'info' | 'list'
  | 'moon' | 'bell' | 'shield' | 'trash' | 'trophy' | 'warning'
  // Cadence / scheduling
  | 'sun' | 'calendar' | 'repeat'
  // Focus / timer
  | 'play' | 'pause' | 'refresh'
  // Messaging
  | 'send';

interface Props {
  name: AscendIconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  /** Renders a soft filled variant where supported (active tab / selected state). */
  filled?: boolean;
}

export function AscendIcon({
  name,
  size = 24,
  color = '#E8EAF0',
  strokeWidth = 1.8,
  filled = false,
}: Props) {
  const stroke = color;
  const common = {
    stroke,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };
  const softFill = filled ? color + '22' : 'none';

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {GLYPHS[name]({ common, stroke, color, softFill, strokeWidth, filled })}
    </Svg>
  );
}

interface DrawArgs {
  common: {
    stroke: string;
    strokeWidth: number;
    strokeLinecap: 'round';
    strokeLinejoin: 'round';
    fill: string;
  };
  stroke: string;
  color: string;
  softFill: string;
  strokeWidth: number;
  filled: boolean;
}

const GLYPHS: Record<AscendIconName, (a: DrawArgs) => React.ReactNode> = {
  // ── LIFE DOMAINS ────────────────────────────────────────

  // Education — classical academy: roofline over columns.
  education: ({ common, color, filled }) => (
    <G>
      <Path d="M3 9 L12 4 L21 9" {...common} fill={filled ? color + '22' : 'none'} />
      <Line x1="6" y1="10.5" x2="6" y2="18" {...common} />
      <Line x1="12" y1="10.5" x2="12" y2="18" {...common} />
      <Line x1="18" y1="10.5" x2="18" y2="18" {...common} />
      <Line x1="4" y1="20" x2="20" y2="20" {...common} />
    </G>
  ),

  // Career — refined briefcase.
  career: ({ common, softFill }) => (
    <G>
      <Rect x="3" y="7.5" width="18" height="12.5" rx="2.5" {...common} fill={softFill} />
      <Path d="M9 7.5 V6 a2 2 0 0 1 2 -2 h2 a2 2 0 0 1 2 2 v1.5" {...common} />
      <Line x1="3" y1="13" x2="21" y2="13" {...common} />
    </G>
  ),

  // Finance — growth: an ascending trend with arrow tip.
  finance: ({ common }) => (
    <G>
      <Polyline points="4,16 9,11 13,14 20,6" {...common} />
      <Polyline points="15,6 20,6 20,11" {...common} />
    </G>
  ),

  // Physical — barbell performance.
  physical: ({ common }) => (
    <G>
      <Line x1="8" y1="12" x2="16" y2="12" {...common} />
      <Rect x="3.5" y="8" width="3" height="8" rx="1.2" {...common} />
      <Rect x="17.5" y="8" width="3" height="8" rx="1.2" {...common} />
    </G>
  ),

  // Appearance — refined hand mirror.
  appearance: ({ common, softFill }) => (
    <G>
      <Ellipse cx="12" cy="9" rx="6" ry="6.8" {...common} fill={softFill} />
      <Line x1="12" y1="15.8" x2="12" y2="21" {...common} />
      <Line x1="9" y1="21" x2="15" y2="21" {...common} />
    </G>
  ),

  // Mental — clarity bulb.
  mental: ({ common, softFill }) => (
    <G>
      <Path
        d="M12 3 a6 6 0 0 1 4 10.4 c-0.7 0.6 -1 1.3 -1 2.1 h-6 c0 -0.8 -0.3 -1.5 -1 -2.1 A6 6 0 0 1 12 3 Z"
        {...common}
        fill={softFill}
      />
      <Line x1="9.5" y1="18" x2="14.5" y2="18" {...common} />
      <Line x1="10.5" y1="20.5" x2="13.5" y2="20.5" {...common} />
    </G>
  ),

  // Social — connected constellation.
  social: ({ common, color, stroke }) => (
    <G>
      <Line x1="6.5" y1="8" x2="16.5" y2="7" {...common} />
      <Line x1="16.5" y1="7" x2="12" y2="17" {...common} />
      <Line x1="12" y1="17" x2="6.5" y2="8" {...common} />
      <Circle cx="6.5" cy="8" r="2.2" {...common} fill={color + '22'} />
      <Circle cx="16.5" cy="7" r="2.2" {...common} fill={color + '22'} />
      <Circle cx="12" cy="17" r="2.2" {...common} fill={color + '22'} />
    </G>
  ),

  // Relationships — geometric heart.
  relationships: ({ common, softFill }) => (
    <Path
      d="M12 20 C5.5 14.5 3.5 10.5 5.3 7.6 C6.9 5 10.6 5.6 12 8.4 C13.4 5.6 17.1 5 18.7 7.6 C20.5 10.5 18.5 14.5 12 20 Z"
      {...common}
      fill={softFill}
    />
  ),

  // Discipline — minimalist shield with integrity check.
  discipline: ({ common, softFill }) => (
    <G>
      <Path
        d="M12 3 L20 6 V11 C20 16 16.2 19.6 12 21 C7.8 19.6 4 16 4 11 V6 Z"
        {...common}
        fill={softFill}
      />
      <Polyline points="8.8,12 11,14.2 15.2,9.8" {...common} />
    </G>
  ),

  // Spiritual — crescent + star.
  spiritual: ({ common, color }) => (
    <G>
      <Path d="M16.5 3.2 a9 9 0 1 0 4.3 15.6 A7 7 0 1 1 16.5 3.2 Z" {...common} fill={color + '18'} />
      <Circle cx="18.5" cy="7" r="0.9" fill={color} stroke="none" />
    </G>
  ),

  // Creativity — four-point spark.
  creativity: ({ common, color }) => (
    <G>
      <Path
        d="M12 2.5 C12.4 8 13 8.6 18.5 9 C13 9.4 12.4 10 12 15.5 C11.6 10 11 9.4 5.5 9 C11 8.6 11.6 8 12 2.5 Z"
        {...common}
        fill={color + '18'}
      />
      <Path d="M18 15 C18.2 17.4 18.4 17.6 20.8 17.8 C18.4 18 18.2 18.2 18 20.6 C17.8 18.2 17.6 18 15.2 17.8 C17.6 17.6 17.8 17.4 18 15 Z" {...common} fill={color + '18'} />
    </G>
  ),

  // Leadership — minimal crown.
  leadership: ({ common, softFill }) => (
    <G>
      <Path d="M4 8.5 L8 13 L12 5.5 L16 13 L20 8.5 L18.3 18.5 H5.7 Z" {...common} fill={softFill} />
      <Line x1="5.7" y1="18.5" x2="18.3" y2="18.5" {...common} />
    </G>
  ),

  // ── NAVIGATION + CORE ───────────────────────────────────

  home: ({ common, softFill }) => (
    <G>
      <Path d="M4 10.5 L12 4 L20 10.5" {...common} />
      <Path d="M6 9.5 V20 H18 V9.5" {...common} fill={softFill} />
    </G>
  ),

  // Goals — pennant flag (intent, direction).
  goals: ({ common, softFill }) => (
    <G>
      <Line x1="5.5" y1="3" x2="5.5" y2="21" {...common} />
      <Path d="M5.5 4 H17 L13.5 7.5 L17 11 H5.5 Z" {...common} fill={softFill} />
    </G>
  ),

  // Focus — concentric focus ring.
  focus: ({ common, color }) => (
    <G>
      <Circle cx="12" cy="12" r="8.5" {...common} />
      <Circle cx="12" cy="12" r="4.5" {...common} />
      <Circle cx="12" cy="12" r="1.4" fill={color} stroke="none" />
    </G>
  ),

  // Habits — momentum pulse.
  habits: ({ common }) => (
    <Polyline points="3,12 7.5,12 10,7 13,17 15.5,12 21,12" {...common} />
  ),

  // Stats — life-map hexagon (radar).
  stats: ({ common, color, softFill }) => (
    <G>
      <Path d="M12 3 L20 7.5 V16.5 L12 21 L4 16.5 V7.5 Z" {...common} fill={softFill} />
      <Circle cx="12" cy="12" r="1.3" fill={color} stroke="none" />
    </G>
  ),

  profile: ({ common, softFill }) => (
    <G>
      <Circle cx="12" cy="8.5" r="3.8" {...common} fill={softFill} />
      <Path d="M5 20 a7 7 0 0 1 14 0" {...common} />
    </G>
  ),

  // Settings — minimal sliders (Linear-style, not a gear).
  settings: ({ common, color }) => (
    <G>
      <Line x1="4" y1="8" x2="20" y2="8" {...common} />
      <Line x1="4" y1="16" x2="20" y2="16" {...common} />
      <Circle cx="9" cy="8" r="2.4" {...common} fill={color + '22'} />
      <Circle cx="15" cy="16" r="2.4" {...common} fill={color + '22'} />
    </G>
  ),

  // ── ACTIONS + STATUS ────────────────────────────────────

  // Achievement — crafted medal.
  achievement: ({ common, color, softFill }) => (
    <G>
      <Circle cx="12" cy="9" r="5" {...common} fill={softFill} />
      <Path d="M9 13 L7 21 L12 18 L17 21 L15 13" {...common} />
      <Circle cx="12" cy="9" r="1.6" fill={color} stroke="none" />
    </G>
  ),

  // Flame — streak.
  flame: ({ common, color, filled }) => (
    <Path
      d="M12 3 C13.5 6.5 16.5 7.8 16.5 12.2 a4.5 4.5 0 0 1 -9 0 C7.5 10 9 8.8 9.6 7.4 C10.4 8.6 11 9 11.6 9 C12.2 8.4 12 6 12 3 Z"
      {...common}
      fill={filled ? color : 'none'}
    />
  ),

  check: ({ common }) => <Polyline points="5,13 10,18 19,6.5" {...common} />,

  plus: ({ common }) => (
    <G>
      <Line x1="12" y1="5" x2="12" y2="19" {...common} />
      <Line x1="5" y1="12" x2="19" y2="12" {...common} />
    </G>
  ),

  close: ({ common }) => (
    <G>
      <Line x1="6" y1="6" x2="18" y2="18" {...common} />
      <Line x1="18" y1="6" x2="6" y2="18" {...common} />
    </G>
  ),

  star: ({ common, color, filled }) => (
    <Path
      d="M12 3 L14.6 8.6 L20.5 9.3 L16.2 13.4 L17.4 19.3 L12 16.3 L6.6 19.3 L7.8 13.4 L3.5 9.3 L9.4 8.6 Z"
      {...common}
      fill={filled ? color : 'none'}
    />
  ),

  'chevron-right': ({ common }) => <Polyline points="9,5 16,12 9,19" {...common} />,
  'chevron-left': ({ common }) => <Polyline points="15,5 8,12 15,19" {...common} />,
  'chevron-down': ({ common }) => <Polyline points="5,9 12,16 19,9" {...common} />,
  'arrow-up': ({ common }) => (
    <G>
      <Line x1="12" y1="20" x2="12" y2="5" {...common} />
      <Polyline points="6,11 12,5 18,11" {...common} />
    </G>
  ),

  // Sparkle — small accent flourish.
  sparkle: ({ common, color }) => (
    <Path
      d="M12 3 C12.4 8.4 13.6 9.6 19 10 C13.6 10.4 12.4 11.6 12 17 C11.6 11.6 10.4 10.4 5 10 C10.4 9.6 11.6 8.4 12 3 Z"
      {...common}
      fill={color + '18'}
    />
  ),

  lock: ({ common, softFill }) => (
    <G>
      <Rect x="5" y="10.5" width="14" height="9.5" rx="2.5" {...common} fill={softFill} />
      <Path d="M8 10.5 V7.5 a4 4 0 0 1 8 0 V10.5" {...common} />
    </G>
  ),

  // ── EXTENDED FUNCTIONAL SET ─────────────────────────────

  'check-circle': ({ common, color, filled }) => (
    <G>
      <Circle cx="12" cy="12" r="9" {...common} fill={filled ? color : 'none'} />
      <Polyline points="8,12 11,15 16,9" {...common} stroke={filled ? '#0b0d14' : color} />
    </G>
  ),

  circle: ({ common }) => <Circle cx="12" cy="12" r="8.5" {...common} />,

  diamond: ({ common, softFill }) => (
    <Path d="M12 3 L21 12 L12 21 L3 12 Z" {...common} fill={softFill} />
  ),

  flash: ({ common, color, filled }) => (
    <Path d="M13 2 L5 13.5 H11 L10.2 22 L19 9.5 H12.5 Z" {...common} fill={filled ? color : 'none'} />
  ),

  // Build — wrench (used where "forge/build" actions live).
  build: ({ common }) => (
    <Path d="M15 5 a3.6 3.6 0 0 0 -4.9 4.5 L4 15.6 L8.4 20 l6.1-6.1 a3.6 3.6 0 0 0 4.5-4.9 l-2.6 2.6 -2-2 Z" {...common} />
  ),

  info: ({ common, color }) => (
    <G>
      <Circle cx="12" cy="12" r="8.5" {...common} />
      <Line x1="12" y1="11" x2="12" y2="16.5" {...common} />
      <Circle cx="12" cy="7.8" r="0.9" fill={color} stroke="none" />
    </G>
  ),

  list: ({ common, color }) => (
    <G>
      <Line x1="9" y1="6.5" x2="20" y2="6.5" {...common} />
      <Line x1="9" y1="12" x2="20" y2="12" {...common} />
      <Line x1="9" y1="17.5" x2="20" y2="17.5" {...common} />
      <Circle cx="4.5" cy="6.5" r="1.1" fill={color} stroke="none" />
      <Circle cx="4.5" cy="12" r="1.1" fill={color} stroke="none" />
      <Circle cx="4.5" cy="17.5" r="1.1" fill={color} stroke="none" />
    </G>
  ),

  moon: ({ common, color }) => (
    <Path d="M16.5 3.2 a9 9 0 1 0 4.3 15.6 A7 7 0 1 1 16.5 3.2 Z" {...common} fill={color + '12'} />
  ),

  bell: ({ common, softFill }) => (
    <G>
      <Path d="M6 16 V11 a6 6 0 0 1 12 0 V16 l1.6 2.2 H4.4 Z" {...common} fill={softFill} />
      <Path d="M10 19.5 a2 2 0 0 0 4 0" {...common} />
    </G>
  ),

  shield: ({ common, softFill }) => (
    <Path d="M12 3 L20 6 V11 C20 16 16.2 19.6 12 21 C7.8 19.6 4 16 4 11 V6 Z" {...common} fill={softFill} />
  ),

  trash: ({ common }) => (
    <G>
      <Line x1="4.5" y1="6.5" x2="19.5" y2="6.5" {...common} />
      <Path d="M6.5 6.5 L7.5 20 a1 1 0 0 0 1 1 H15.5 a1 1 0 0 0 1 -1 L17.5 6.5" {...common} />
      <Path d="M9.5 6.5 V4.5 a1 1 0 0 1 1 -1 h3 a1 1 0 0 1 1 1 V6.5" {...common} />
      <Line x1="10.5" y1="10" x2="10.5" y2="17" {...common} />
      <Line x1="13.5" y1="10" x2="13.5" y2="17" {...common} />
    </G>
  ),

  trophy: ({ common, softFill }) => (
    <G>
      <Path d="M7 4 H17 V9 a5 5 0 0 1 -10 0 Z" {...common} fill={softFill} />
      <Path d="M7 5.5 H4.5 V7 a3 3 0 0 0 3 3" {...common} />
      <Path d="M17 5.5 H19.5 V7 a3 3 0 0 1 -3 3" {...common} />
      <Line x1="12" y1="14" x2="12" y2="17.5" {...common} />
      <Line x1="8.5" y1="20.5" x2="15.5" y2="20.5" {...common} />
      <Line x1="10" y1="17.5" x2="14" y2="17.5" {...common} />
    </G>
  ),

  warning: ({ common, color, softFill }) => (
    <G>
      <Path d="M12 3.5 L21.5 20 H2.5 Z" {...common} fill={softFill} />
      <Line x1="12" y1="9.5" x2="12" y2="14.5" {...common} />
      <Circle cx="12" cy="17" r="0.9" fill={color} stroke="none" />
    </G>
  ),

  // Cadence — daily.
  sun: ({ common, color, softFill }) => (
    <G>
      <Circle cx="12" cy="12" r="4" {...common} fill={softFill} />
      <Line x1="12" y1="2.5" x2="12" y2="5" {...common} />
      <Line x1="12" y1="19" x2="12" y2="21.5" {...common} />
      <Line x1="2.5" y1="12" x2="5" y2="12" {...common} />
      <Line x1="19" y1="12" x2="21.5" y2="12" {...common} />
      <Line x1="5.3" y1="5.3" x2="7" y2="7" {...common} />
      <Line x1="17" y1="17" x2="18.7" y2="18.7" {...common} />
      <Line x1="18.7" y1="5.3" x2="17" y2="7" {...common} />
      <Line x1="7" y1="17" x2="5.3" y2="18.7" {...common} />
    </G>
  ),

  // Cadence — weekly / weekdays.
  calendar: ({ common, color, softFill }) => (
    <G>
      <Rect x="3.5" y="5" width="17" height="16" rx="2.5" {...common} fill={softFill} />
      <Line x1="3.5" y1="9.5" x2="20.5" y2="9.5" {...common} />
      <Line x1="8" y1="3" x2="8" y2="6.5" {...common} />
      <Line x1="16" y1="3" x2="16" y2="6.5" {...common} />
      <Circle cx="8.5" cy="14" r="0.95" fill={color} stroke="none" />
      <Circle cx="12" cy="14" r="0.95" fill={color} stroke="none" />
      <Circle cx="15.5" cy="14" r="0.95" fill={color} stroke="none" />
      <Circle cx="8.5" cy="17.5" r="0.95" fill={color} stroke="none" />
      <Circle cx="12" cy="17.5" r="0.95" fill={color} stroke="none" />
    </G>
  ),

  // Cadence — recurring.
  repeat: ({ common }) => (
    <G>
      <Path d="M4 11 a8 8 0 0 1 13 -5 L20 8.5" {...common} />
      <Polyline points="20,4 20,8.5 15.5,8.5" {...common} />
      <Path d="M20 13 a8 8 0 0 1 -13 5 L4 15.5" {...common} />
      <Polyline points="4,20 4,15.5 8.5,15.5" {...common} />
    </G>
  ),

  // Play — filled triangle
  play: ({ color }) => (
    <Path d="M6 4 L20 12 L6 20 Z" fill={color} stroke="none" />
  ),

  // Pause — two vertical bars
  pause: ({ common }) => (
    <G>
      <Rect x="6" y="4" width="4" height="16" rx="1" {...common} fill={common.stroke} />
      <Rect x="14" y="4" width="4" height="16" rx="1" {...common} fill={common.stroke} />
    </G>
  ),

  // Refresh — circular arrow
  refresh: ({ common }) => (
    <G>
      <Path d="M21 2v6h-6" {...common} />
      <Path d="M3 12a9 9 0 0 1 15-6.7L21 8" {...common} />
      <Path d="M3 22v-6h6" {...common} />
      <Path d="M21 12a9 9 0 0 1-15 6.7L3 16" {...common} />
    </G>
  ),

  // Send — paper plane
  send: ({ common }) => (
    <G>
      <Path d="M22 2 L11 13" {...common} />
      <Path d="M22 2 L15 22 L11 13 L2 9 Z" {...common} />
    </G>
  ),
};

/** Maps a category id to its Ascend domain glyph. */
export const CATEGORY_ASCEND_ICONS: Record<string, AscendIconName> = {
  education: 'education',
  career: 'career',
  finance: 'finance',
  physical: 'physical',
  appearance: 'appearance',
  mental: 'mental',
  social: 'social',
  relationships: 'relationships',
  discipline: 'discipline',
  spiritual: 'spiritual',
  creativity: 'creativity',
  leadership: 'leadership',
};
