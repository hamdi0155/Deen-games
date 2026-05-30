// ============================================================
// MissionCard — Cinematic hero card for Today's Mission
// Replaces TodayCard as the dashboard centerpiece.
// ============================================================
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path, Line, G } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { MomentumRing } from './MomentumRing';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';

// ── Gradient palettes keyed to primary category ──────────────
const CATEGORY_GRADIENTS: Record<string, readonly [string, string, string]> = {
  discipline: ['#1A0E00', '#2D1700', '#3D2000'],
  physical:   ['#071018', '#0D1E2E', '#122840'],
  education:  ['#0A0A1A', '#12102D', '#1A1540'],
  career:     ['#050D18', '#0A1528', '#0F1E38'],
  mental:     ['#0D0A1A', '#15112A', '#1C163A'],
};
const DEFAULT_GRADIENT: readonly [string, string, string] = ['#0A0A18', '#12103A', '#1A1560'];

// ── Category accent colors for border + chip tint ─────────────
const CATEGORY_ACCENT: Record<string, string> = {
  discipline: '#F97316',
  physical:   '#E8941A',
  education:  '#5B6CF5',
  career:     '#3B82F6',
  mental:     '#8B5CF6',
};
const DEFAULT_ACCENT = COLORS.accent;

// ── SVG Art: mountain silhouette (discipline / physical) ──────
function MountainArt({ color }: { color: string }) {
  return (
    <Svg width={110} height={80} viewBox="0 0 110 80" style={styles.svgArt}>
      <G opacity={0.18}>
        {/* Far ridge */}
        <Path
          d="M0 80 L20 40 L40 55 L60 20 L80 45 L100 28 L110 35 L110 80 Z"
          fill={color}
          stroke="none"
        />
        {/* Near ridge overlay */}
        <Path
          d="M0 80 L30 55 L50 68 L70 42 L90 60 L110 50 L110 80 Z"
          fill={color}
          fillOpacity={0.5}
          stroke="none"
        />
        {/* Peak highlight line */}
        <Path
          d="M20 40 L40 55 L60 20 L80 45 L100 28"
          fill="none"
          stroke={color}
          strokeWidth={1}
          strokeOpacity={0.5}
        />
      </G>
    </Svg>
  );
}

// ── SVG Art: angular grid (career / education) ─────────────────
function GridArt({ color }: { color: string }) {
  return (
    <Svg width={110} height={80} viewBox="0 0 110 80" style={styles.svgArt}>
      <G opacity={0.12}>
        {/* Vertical columns */}
        {[15, 30, 45, 60, 75, 90, 105].map((x, i) => (
          <Line key={`v${i}`} x1={x} y1={0} x2={x} y2={80} stroke={color} strokeWidth={0.8} />
        ))}
        {/* Horizontal rows */}
        {[10, 20, 30, 40, 50, 60, 70].map((y, i) => (
          <Line key={`h${i}`} x1={0} y1={y} x2={110} y2={y} stroke={color} strokeWidth={0.8} />
        ))}
        {/* Diagonal accent */}
        <Path
          d="M110 0 L0 80"
          stroke={color}
          strokeWidth={1.2}
          strokeOpacity={0.4}
        />
        <Path
          d="M110 20 L20 80"
          stroke={color}
          strokeWidth={0.8}
          strokeOpacity={0.25}
        />
      </G>
    </Svg>
  );
}

function SceneArt({ categoryId, color }: { categoryId: string; color: string }) {
  if (categoryId === 'discipline' || categoryId === 'physical') {
    return <MountainArt color={color} />;
  }
  if (categoryId === 'career' || categoryId === 'education') {
    return <GridArt color={color} />;
  }
  // Default: abstract mountain for remaining categories
  return <MountainArt color={color} />;
}

// ── Props ─────────────────────────────────────────────────────
export interface MissionCardProps {
  habitsTotal: number;
  habitsDone: number;
  disciplinesTotal: number;
  disciplinesDone: number;
  streakDays: number;
  primaryCategoryId?: string;
  missionTitle?: string;
  onPress?: () => void;
}

export function MissionCard({
  habitsTotal,
  habitsDone,
  disciplinesTotal,
  disciplinesDone,
  streakDays,
  primaryCategoryId = 'default',
  missionTitle = 'Master Your Day',
  onPress,
}: MissionCardProps) {
  const total = habitsTotal + disciplinesTotal;
  const done = habitsDone + disciplinesDone;
  const progress = total > 0 ? done / total : 0;

  const totalXP = done * 25;
  const momentumGain = Math.round(progress * 20);

  const gradientColors =
    (CATEGORY_GRADIENTS[primaryCategoryId] ?? DEFAULT_GRADIENT) as [string, string, string];
  const accentColor = CATEGORY_ACCENT[primaryCategoryId] ?? DEFAULT_ACCENT;

  // ── Shimmer sweep — single pass on mount ────────────────────
  const shimmerX = useSharedValue(-200);
  useEffect(() => {
    shimmerX.value = withTiming(400, {
      duration: 2000,
      easing: Easing.out(Easing.quad),
    });
  }, []);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerX.value }],
  }));

  // Description line derived from progress
  const description =
    total === 0
      ? 'Set habits and practices to begin.'
      : done === total
      ? 'All objectives complete. Exceptional execution.'
      : `${done} of ${total} objectives complete — keep going.`;

  const ringColor = done === total && total > 0 ? COLORS.success : accentColor;

  return (
    <View style={[styles.wrapper, { borderColor: accentColor + '30' }]}>
      {/* Cinematic gradient background */}
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Dark readability overlay — stronger on left, fades right */}
      <LinearGradient
        colors={['rgba(0,0,0,0.72)', 'rgba(0,0,0,0.40)', 'rgba(0,0,0,0.10)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Scene illustration — absolute, right-aligned */}
      <View style={styles.artLayer} pointerEvents="none">
        <SceneArt categoryId={primaryCategoryId} color={accentColor} />
      </View>

      {/* Shimmer sweep line */}
      <Animated.View style={[styles.shimmerWrap, shimmerStyle]} pointerEvents="none">
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.07)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.shimmerLine}
        />
      </Animated.View>

      {/* Card body */}
      <View style={styles.body}>
        {/* HEADER LABEL */}
        <Text style={styles.missionLabel}>TODAY'S MISSION</Text>

        {/* HUD ROW */}
        <View style={styles.hudRow}>
          {/* Momentum ring */}
          <MomentumRing
            progress={progress}
            size={88}
            strokeWidth={6}
            color={ringColor}
            centerValue={total === 0 ? '—' : `${Math.round(progress * 100)}%`}
            centerLabel="done"
            delay={300}
          />

          {/* Mission text column */}
          <View style={styles.textCol}>
            <Text style={styles.missionTitle} numberOfLines={2}>
              {missionTitle}
            </Text>
            <Text style={styles.description} numberOfLines={2}>
              {description}
            </Text>

            {/* Streak badge */}
            {streakDays > 0 && (
              <View style={styles.streakBadge}>
                <Text style={styles.streakText}>🔥 {streakDays}d streak</Text>
              </View>
            )}
          </View>
        </View>

        {/* BOTTOM ROW */}
        <View style={styles.bottomRow}>
          {/* XP + Momentum chips */}
          <View style={styles.chips}>
            <View style={[styles.chip, { borderColor: COLORS.gold + '40' }]}>
              <Text style={styles.chipTextGold}>⚡ +{totalXP} XP</Text>
            </View>
            <View style={[styles.chip, { borderColor: accentColor + '40' }]}>
              <Text style={[styles.chipTextAccent, { color: accentColor }]}>
                ↑ +{momentumGain} Momentum
              </Text>
            </View>
          </View>

          {/* View Mission button */}
          {onPress && (
            <TouchableOpacity
              onPress={onPress}
              style={[styles.viewBtn, { borderColor: accentColor + '60' }]}
              activeOpacity={0.75}
            >
              <Text style={[styles.viewBtnText, { color: accentColor }]}>
                View Mission →
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    overflow: 'hidden',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.55,
    shadowRadius: 24,
    elevation: 14,
  },
  artLayer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  svgArt: {
    // No inline styles; width/height handled in SVG props
  },
  shimmerWrap: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  shimmerLine: {
    width: 160,
    height: '100%',
  },
  body: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  missionLabel: {
    fontFamily: FONTS.families.displayBold,
    fontSize: 9,
    color: COLORS.gold,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  hudRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  textCol: {
    flex: 1,
    gap: 4,
  },
  missionTitle: {
    fontFamily: FONTS.families.displayBold,
    fontSize: FONTS.sizes.xl,
    color: COLORS.text,
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  description: {
    fontFamily: FONTS.families.body,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  streakBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(249,115,22,0.12)',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(249,115,22,0.28)',
    marginTop: 2,
  },
  streakText: {
    fontFamily: FONTS.families.bodySemibold,
    fontSize: FONTS.sizes.xs,
    color: '#F97316',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  chips: {
    flexDirection: 'row',
    gap: SPACING.xs,
    flexWrap: 'wrap',
    flex: 1,
  },
  chip: {
    borderRadius: RADIUS.full,
    borderWidth: 1,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  chipTextGold: {
    fontFamily: FONTS.families.bodySemibold,
    fontSize: FONTS.sizes.xs,
    color: COLORS.gold,
  },
  chipTextAccent: {
    fontFamily: FONTS.families.bodySemibold,
    fontSize: FONTS.sizes.xs,
  },
  viewBtn: {
    borderRadius: RADIUS.full,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  viewBtnText: {
    fontFamily: FONTS.families.bodySemibold,
    fontSize: FONTS.sizes.xs,
    letterSpacing: 0.2,
  },
});
