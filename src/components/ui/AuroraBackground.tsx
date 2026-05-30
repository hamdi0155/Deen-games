import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { DURATION } from '../../constants/theme';

interface OrbConfig {
  color: string;
  size: number;
  x: number;
  y: number;
  driftX: number;
  driftY: number;
  driftSize: number;
  duration: number;
  delay: number;
}

const ORBS: OrbConfig[] = [
  // Indigo — top-left
  {
    color: 'rgba(99,102,241,0.09)',
    size: 300,
    x: -80, y: -60,
    driftX: 60, driftY: 50,
    driftSize: 20,
    duration: DURATION.ambient, delay: 0,
  },
  // Purple — right-center
  {
    color: 'rgba(124,58,237,0.07)',
    size: 260,
    x: 160, y: 280,
    driftX: -60, driftY: -70,
    driftSize: 18,
    duration: DURATION.ambient * 1.375, delay: 1500,
  },
  // Deep indigo — mid-left
  {
    color: 'rgba(79,70,229,0.05)',
    size: 210,
    x: 40, y: 480,
    driftX: 70, driftY: -50,
    driftSize: 15,
    duration: DURATION.ambient * 1.75, delay: 3000,
  },
  // Blue/teal — bottom-center
  {
    color: 'rgba(14,165,233,0.06)',
    size: 240,
    x: 80, y: 620,
    driftX: 50, driftY: -60,
    driftSize: 16,
    duration: DURATION.ambient * 1.375, delay: 800,
  },
];

function OrbView({ cfg }: { cfg: OrbConfig }) {
  const x = useSharedValue(cfg.x);
  const y = useSharedValue(cfg.y);
  const size = useSharedValue(cfg.size);

  useEffect(() => {
    const ease = Easing.inOut(Easing.sin);

    x.value = withDelay(
      cfg.delay,
      withRepeat(
        withSequence(
          withTiming(cfg.x + cfg.driftX, { duration: cfg.duration, easing: ease }),
          withTiming(cfg.x, { duration: cfg.duration, easing: ease }),
        ),
        -1,
        true,
      ),
    );

    y.value = withDelay(
      cfg.delay,
      withRepeat(
        withSequence(
          withTiming(cfg.y + cfg.driftY, { duration: cfg.duration, easing: ease }),
          withTiming(cfg.y, { duration: cfg.duration, easing: ease }),
        ),
        -1,
        true,
      ),
    );

    size.value = withDelay(
      cfg.delay,
      withRepeat(
        withSequence(
          withTiming(cfg.size + cfg.driftSize, { duration: cfg.duration * 0.6, easing: ease }),
          withTiming(cfg.size - cfg.driftSize * 0.5, { duration: cfg.duration * 0.6, easing: ease }),
          withTiming(cfg.size, { duration: cfg.duration * 0.4, easing: ease }),
        ),
        -1,
        true,
      ),
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
    ],
    width: size.value,
    height: size.value,
    borderRadius: size.value / 2,
  }));

  return (
    <Animated.View
      style={[
        styles.orb,
        { backgroundColor: cfg.color },
        animStyle,
      ]}
    />
  );
}

export function AuroraBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {ORBS.map((cfg, i) => (
        <OrbView key={i} cfg={cfg} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  orb: {
    position: 'absolute',
  },
});
