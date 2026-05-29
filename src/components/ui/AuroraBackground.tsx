import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface OrbConfig {
  color: string;
  size: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  duration: number;
  delay: number;
}

const ORBS: OrbConfig[] = [
  {
    color: 'rgba(99,102,241,0.09)',
    size: 340,
    startX: -100, startY: -80,
    endX: 80,    endY: 60,
    duration: 9000, delay: 0,
  },
  {
    color: 'rgba(124,58,237,0.07)',
    size: 280,
    startX: 180,  startY: 320,
    endX: 60,     endY: 200,
    duration: 11000, delay: 2000,
  },
  {
    color: 'rgba(79,70,229,0.05)',
    size: 220,
    startX: 80,  startY: 500,
    endX: -40,   endY: 380,
    duration: 13000, delay: 4000,
  },
  {
    color: 'rgba(139,92,246,0.04)',
    size: 180,
    startX: 260,  startY: 100,
    endX: 200,    endY: -20,
    duration: 8000, delay: 1500,
  },
];

function OrbView({ cfg }: { cfg: OrbConfig }) {
  const x = useSharedValue(cfg.startX);
  const y = useSharedValue(cfg.startY);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    const ease = Easing.inOut(Easing.sin);

    setTimeout(() => {
      x.value = withRepeat(
        withSequence(
          withTiming(cfg.endX, { duration: cfg.duration, easing: ease }),
          withTiming(cfg.startX, { duration: cfg.duration, easing: ease }),
        ),
        -1, false,
      );
      y.value = withRepeat(
        withSequence(
          withTiming(cfg.endY, { duration: cfg.duration * 0.8, easing: ease }),
          withTiming(cfg.startY, { duration: cfg.duration * 0.8, easing: ease }),
        ),
        -1, false,
      );
      scale.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: cfg.duration * 0.5, easing: ease }),
          withTiming(0.88, { duration: cfg.duration * 0.5, easing: ease }),
        ),
        -1, false,
      );
    }, cfg.delay);
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.orb,
        {
          width: cfg.size,
          height: cfg.size,
          borderRadius: cfg.size / 2,
          backgroundColor: cfg.color,
        },
        style,
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
