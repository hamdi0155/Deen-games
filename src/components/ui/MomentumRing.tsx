import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { COLORS, FONTS } from '../../constants/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  /** 0–1 */
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  /** Large figure in the center (e.g. "80%" or "3/5"). */
  centerValue?: string;
  /** Small label beneath the figure. */
  centerLabel?: string;
  /** Delay (ms) before the fill animates in. */
  delay?: number;
}

/**
 * MomentumRing — the signature HUD progress ring.
 * A glowing arc sweeps to the current value with an eased fill,
 * over a faint track. Oura / luxury-watch lineage.
 */
export function MomentumRing({
  progress,
  size = 92,
  strokeWidth = 7,
  color = COLORS.accent,
  trackColor = 'rgba(255,255,255,0.07)',
  centerValue,
  centerLabel,
  delay = 200,
}: Props) {
  const clamped = Math.max(0, Math.min(1, progress));
  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  const animated = useSharedValue(0);

  useEffect(() => {
    animated.value = withDelay(
      delay,
      withTiming(clamped, { duration: 900, easing: Easing.out(Easing.cubic) })
    );
  }, [clamped]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - animated.value),
  }));

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Faint outer glow */}
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          stroke={color}
          strokeWidth={strokeWidth + 4}
          strokeOpacity={0.10}
          fill="none"
        />
        {/* Track */}
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress arc */}
        <AnimatedCircle
          cx={cx}
          cy={cy}
          r={r}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          // start at 12 o'clock
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      </Svg>

      {(centerValue || centerLabel) && (
        <View style={styles.center} pointerEvents="none">
          {centerValue != null && (
            <Text style={[styles.value, { color }]}>{centerValue}</Text>
          )}
          {centerLabel != null && <Text style={styles.label}>{centerLabel}</Text>}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontFamily: FONTS.families.displayBold,
    fontSize: 22,
    letterSpacing: -0.5,
  },
  label: {
    fontFamily: FONTS.families.bodyMedium,
    fontSize: 9,
    color: COLORS.textSecondary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 1,
  },
});
