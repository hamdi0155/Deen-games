// ============================================================
// MomentumCard — compact "MOMENTUM" widget with sparkline trend
// ============================================================
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polyline, Defs, LinearGradient, Stop, Polygon } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';

// ---------------------------------------------------------------------------
// Animated Polyline
// ---------------------------------------------------------------------------
const AnimatedPolyline = Animated.createAnimatedComponent(Polyline);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface MomentumCardProps {
  score: number;      // e.g. 842
  weeklyXP: number;   // XP earned in past 7 days
  streak: number;     // current streak in days
  trend: 'up' | 'down' | 'flat';
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const SVG_W = 90;
const SVG_H = 28;

/**
 * Generate 7 sparkline y-values from weeklyXP.
 * Seeded by `score` for stability. Trends upward when trend === 'up'.
 */
function buildSparklinePoints(
  weeklyXP: number,
  score: number,
  trend: 'up' | 'down' | 'flat',
): { x: number; y: number }[] {
  // Simple seeded pseudo-random using score
  const seed = (score * 9301 + 49297) % 233280;
  const rand = (i: number) => ((seed + i * 6364136223846793005) % 2147483647) / 2147483647;

  const base = weeklyXP > 0 ? weeklyXP / 7 : 50;
  const variance = base * 0.4;

  const rawValues: number[] = Array.from({ length: 7 }, (_, i) => {
    const r = rand(i);
    let v = base + (r - 0.5) * 2 * variance;
    if (trend === 'up') {
      v += (i / 6) * base * 0.6;
    } else if (trend === 'down') {
      v -= (i / 6) * base * 0.5;
    }
    return Math.max(1, v);
  });

  const minV = Math.min(...rawValues);
  const maxV = Math.max(...rawValues);
  const range = maxV - minV || 1;

  const padding = 3; // px padding top/bottom
  return rawValues.map((v, i) => ({
    x: (i / 6) * SVG_W,
    y: SVG_H - padding - ((v - minV) / range) * (SVG_H - padding * 2),
  }));
}

function pointsToString(pts: { x: number; y: number }[]): string {
  return pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
}

/** Approximate polyline length for stroke-dasharray animation */
function polylineLength(pts: { x: number; y: number }[]): number {
  let len = 0;
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i - 1].x;
    const dy = pts[i].y - pts[i - 1].y;
    len += Math.sqrt(dx * dx + dy * dy);
  }
  return len;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function MomentumCard({ score, weeklyXP, streak, trend }: MomentumCardProps) {
  const pts = buildSparklinePoints(weeklyXP, score, trend);
  const pointsStr = pointsToString(pts);
  const totalLength = polylineLength(pts);

  // Animated dash offset: totalLength → 0 (draw-in)
  const dashOffset = useSharedValue(totalLength);

  useEffect(() => {
    dashOffset.value = withTiming(0, {
      duration: 900,
      easing: Easing.out(Easing.cubic),
    });
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: dashOffset.value,
  }));

  // Trend arrow: show ↑ for up, ↓ for down, — for flat
  const trendLabel = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—';
  const trendColor =
    trend === 'up' ? COLORS.success : trend === 'down' ? COLORS.danger : COLORS.textSecondary;

  // Build fill polygon (area under sparkline)
  const fillPts = [
    ...pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`),
    `${SVG_W},${SVG_H}`,
    `0,${SVG_H}`,
  ].join(' ');

  return (
    <View style={styles.container}>
      {/* Label */}
      <Text style={styles.label}>MOMENTUM</Text>

      {/* Score row */}
      <View style={styles.scoreRow}>
        <Text style={styles.score}>{score.toLocaleString()}</Text>
        <Text style={[styles.trendIndicator, { color: trendColor }]}>{trendLabel}</Text>
      </View>

      {/* Streak */}
      <Text style={styles.streakText}>{streak}d streak</Text>

      {/* Sparkline */}
      <View style={styles.sparklineWrapper}>
        <Svg width={SVG_W} height={SVG_H}>
          <Defs>
            <LinearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={COLORS.success} stopOpacity="0.25" />
              <Stop offset="1" stopColor={COLORS.success} stopOpacity="0" />
            </LinearGradient>
          </Defs>

          {/* Fill area */}
          <Polygon points={fillPts} fill="url(#sparkFill)" stroke="none" />

          {/* Animated line */}
          <AnimatedPolyline
            points={pointsStr}
            stroke={COLORS.success}
            strokeWidth={1.5}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={[totalLength, totalLength]}
            animatedProps={animatedProps}
          />
        </Svg>
      </View>

      {/* Weekly XP label */}
      <Text style={styles.weeklyLabel}>+{weeklyXP.toLocaleString()} XP this week</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(14,18,30,0.95)',
    borderWidth: 1,
    borderColor: 'rgba(14,168,117,0.2)',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    minWidth: 130,
  },
  label: {
    fontFamily: FONTS.families.bodyMedium,
    fontSize: 9,
    letterSpacing: 2,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    marginBottom: SPACING.xs,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: 2,
  },
  score: {
    fontFamily: FONTS.families.displayBold,
    fontSize: 28,
    color: COLORS.text,
    lineHeight: 32,
  },
  trendIndicator: {
    fontFamily: FONTS.families.bodySemibold,
    fontSize: 14,
    marginTop: 4,
  },
  streakText: {
    fontFamily: FONTS.families.body,
    fontSize: 10,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  sparklineWrapper: {
    marginVertical: SPACING.xs,
  },
  weeklyLabel: {
    fontFamily: FONTS.families.body,
    fontSize: 9,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
