// ============================================================
// MomentumCard — cinematic momentum widget with tier system
// ============================================================
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polyline, Defs, LinearGradient, Stop, Polygon, Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';

const AnimatedPolyline = Animated.createAnimatedComponent(Polyline);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface MomentumCardProps {
  score: number;
  weeklyXP: number;
  streak: number;
  trend: 'up' | 'down' | 'flat';
}

// Tier thresholds
const TIERS = [
  { label: 'IRON',     min: 0,    max: 200,  color: '#9097AE', glow: '#9097AE22' },
  { label: 'BRONZE',   min: 200,  max: 500,  color: '#CD7F32', glow: '#CD7F3222' },
  { label: 'SILVER',   min: 500,  max: 1000, color: '#C0C0C0', glow: '#C0C0C022' },
  { label: 'GOLD',     min: 1000, max: 2000, color: '#C9A84C', glow: '#C9A84C22' },
  { label: 'PLATINUM', min: 2000, max: 9999, color: '#5B6CF5', glow: '#5B6CF522' },
] as const;

function getTier(score: number) {
  return TIERS.find((t) => score >= t.min && score < t.max) ?? TIERS[TIERS.length - 1];
}

const SVG_W = 88;
const SVG_H = 26;

function buildSparklinePoints(
  weeklyXP: number,
  score: number,
  trend: 'up' | 'down' | 'flat',
): { x: number; y: number }[] {
  const seed = (score * 9301 + 49297) % 233280;
  const rand = (i: number) => ((seed + i * 6364136223846793005) % 2147483647) / 2147483647;
  const base = weeklyXP > 0 ? weeklyXP / 7 : 30;
  const variance = base * 0.4;

  const rawValues: number[] = Array.from({ length: 7 }, (_, i) => {
    let v = base + (rand(i) - 0.5) * 2 * variance;
    if (trend === 'up') v += (i / 6) * base * 0.6;
    else if (trend === 'down') v -= (i / 6) * base * 0.5;
    return Math.max(1, v);
  });

  const minV = Math.min(...rawValues);
  const maxV = Math.max(...rawValues);
  const range = maxV - minV || 1;
  const padding = 3;

  return rawValues.map((v, i) => ({
    x: (i / 6) * SVG_W,
    y: SVG_H - padding - ((v - minV) / range) * (SVG_H - padding * 2),
  }));
}

function pointsToString(pts: { x: number; y: number }[]): string {
  return pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
}

function polylineLength(pts: { x: number; y: number }[]): number {
  let len = 0;
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i - 1].x;
    const dy = pts[i].y - pts[i - 1].y;
    len += Math.sqrt(dx * dx + dy * dy);
  }
  return len;
}

export function MomentumCard({ score, weeklyXP, streak, trend }: MomentumCardProps) {
  const tier = getTier(score);
  const pts = buildSparklinePoints(weeklyXP, score, trend);
  const pointsStr = pointsToString(pts);
  const totalLength = polylineLength(pts);

  const dashOffset = useSharedValue(totalLength);
  const glowOpacity = useSharedValue(0.4);

  useEffect(() => {
    dashOffset.value = withTiming(0, { duration: 1000, easing: Easing.out(Easing.cubic) });
    if (trend === 'up') {
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.9, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.4, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      );
    }
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: dashOffset.value,
  }));

  const trendLabel = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—';
  const trendColor =
    trend === 'up' ? COLORS.success : trend === 'down' ? COLORS.danger : COLORS.textSecondary;

  const fillPts = [
    ...pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`),
    `${SVG_W},${SVG_H}`,
    `0,${SVG_H}`,
  ].join(' ');

  // Progress within tier
  const tierProgress = Math.min((score - tier.min) / (tier.max - tier.min), 1);

  return (
    <View style={[styles.container, { borderColor: tier.color + '35' }]}>
      {/* Tier label */}
      <View style={styles.tierRow}>
        <View style={[styles.tierPip, { backgroundColor: tier.color }]} />
        <Text style={[styles.label, { color: tier.color }]}>{tier.label}</Text>
      </View>

      {/* Score row */}
      <View style={styles.scoreRow}>
        <Text style={[styles.score, { color: COLORS.text }]}>{score.toLocaleString()}</Text>
        <Text style={[styles.trendIndicator, { color: trendColor }]}>{trendLabel}</Text>
      </View>

      {/* Streak */}
      {streak > 0 && (
        <Text style={styles.streakText}>🔥 {streak}d streak</Text>
      )}

      {/* Sparkline */}
      <View style={styles.sparklineWrapper}>
        <Svg width={SVG_W} height={SVG_H}>
          <Defs>
            <LinearGradient id="sparkFill2" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={tier.color} stopOpacity="0.3" />
              <Stop offset="1" stopColor={tier.color} stopOpacity="0" />
            </LinearGradient>
          </Defs>
          <Polygon points={fillPts} fill="url(#sparkFill2)" stroke="none" />
          <AnimatedPolyline
            points={pointsStr}
            stroke={tier.color}
            strokeWidth={1.5}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={[totalLength, totalLength]}
            animatedProps={animatedProps}
          />
        </Svg>
      </View>

      {/* Tier progress bar */}
      <View style={styles.tierBar}>
        <View style={[styles.tierBarFill, { width: `${tierProgress * 100}%`, backgroundColor: tier.color }]} />
      </View>

      <Text style={styles.weeklyLabel}>+{weeklyXP.toLocaleString()} XP wk</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(14,18,30,0.95)',
    borderWidth: 1,
    borderRadius: RADIUS.lg,
    padding: SPACING.sm,
    minWidth: 124,
  },
  tierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  tierPip: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  label: {
    fontFamily: FONTS.families.bodyMedium,
    fontSize: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  score: {
    fontFamily: FONTS.families.displayBold,
    fontSize: 26,
    lineHeight: 30,
  },
  trendIndicator: {
    fontFamily: FONTS.families.bodySemibold,
    fontSize: 13,
    marginTop: 2,
  },
  streakText: {
    fontFamily: FONTS.families.body,
    fontSize: 9,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  sparklineWrapper: {
    marginVertical: SPACING.xs,
  },
  tierBar: {
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 1,
    overflow: 'hidden',
    marginBottom: 3,
  },
  tierBarFill: {
    height: 2,
    borderRadius: 1,
  },
  weeklyLabel: {
    fontFamily: FONTS.families.body,
    fontSize: 9,
    color: COLORS.textMuted,
  },
});
