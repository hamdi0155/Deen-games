// ============================================================
// StatRing — animated progress ring for a single life metric
// ============================================================
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { AscendIconName } from '../icons/AscendIcon';
import { COLORS, FONTS, SPACING, SPRING } from '../../constants/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// ── Props ─────────────────────────────────────────────────────
export interface StatRingProps {
  label: string;
  level: number;
  progress: number;   // 0–1 fraction to next level
  color: string;
  iconName: AscendIconName;
  size?: number;
}

export function StatRing({
  label,
  level,
  progress,
  color,
  iconName,
  size = 72,
}: StatRingProps) {
  const STROKE_WIDTH = 4;
  const clamped = Math.max(0, Math.min(1, progress));
  const r = (size - STROKE_WIDTH) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  const isNearComplete = clamped >= 0.9;

  // Arc animation
  const animated = useSharedValue(0);
  // Scale animation for achievement glow
  const scale = useSharedValue(1);

  useEffect(() => {
    animated.value = withDelay(
      150,
      withTiming(clamped, { duration: 900, easing: Easing.out(Easing.cubic) }),
    );
    if (isNearComplete) {
      scale.value = withDelay(
        600,
        withSpring(1.05, SPRING.gentle),
      );
    } else {
      scale.value = withSpring(1, SPRING.gentle);
    }
  }, [clamped, isNearComplete]);

  const arcProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - animated.value),
  }));

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.wrap, containerStyle]}>
      {/* Ring + icon */}
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
          {/* Outer ambient glow */}
          <Circle
            cx={cx}
            cy={cy}
            r={r}
            stroke={color}
            strokeWidth={10}
            strokeOpacity={0.15}
            fill="none"
          />

          {/* Achievement glow ring — shown when progress >= 0.9 */}
          {isNearComplete && (
            <Circle
              cx={cx}
              cy={cy}
              r={r}
              stroke={color}
              strokeWidth={8}
              strokeOpacity={0.25}
              fill="none"
            />
          )}

          {/* Track */}
          <Circle
            cx={cx}
            cy={cy}
            r={r}
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />

          {/* Progress arc */}
          <AnimatedCircle
            cx={cx}
            cy={cy}
            r={r}
            stroke={color}
            strokeWidth={STROKE_WIDTH}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animatedProps={arcProps}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        </Svg>

        {/* Center: percentage */}
        <View style={[styles.centerIcon, { width: size, height: size }]} pointerEvents="none">
          <Text style={[styles.centerPct, { color }]}>
            {Math.round(clamped * 100)}%
          </Text>
        </View>
      </View>

      {/* Level label */}
      <Text style={styles.levelText}>Lv {level}</Text>

      {/* Category label */}
      <Text style={styles.labelText}>{label.toUpperCase()}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  centerIcon: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerPct: {
    fontFamily: FONTS.families.displayBold,
    fontSize: 13,
    letterSpacing: -0.5,
  },
  levelText: {
    fontFamily: FONTS.families.displayMedium,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    letterSpacing: -0.2,
  },
  labelText: {
    fontFamily: FONTS.families.bodySemibold,
    fontSize: 9,
    color: COLORS.textSecondary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
