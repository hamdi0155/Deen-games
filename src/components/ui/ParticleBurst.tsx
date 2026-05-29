import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

interface ParticleData {
  angle: number;
  distance: number;
  size: number;
  delay: number;
  opacity: number;
}

interface Props {
  color?: string;
  count?: number;
  onDone?: () => void;
}

function createParticles(count: number): ParticleData[] {
  return Array.from({ length: count }, (_, i) => ({
    angle: (i / count) * 2 * Math.PI + (Math.random() - 0.5) * 0.5,
    distance: 24 + Math.random() * 32,
    size: 3 + Math.random() * 3,
    delay: Math.floor(Math.random() * 80),
    opacity: 0.6 + Math.random() * 0.4,
  }));
}

function SingleParticle({ p, color }: { p: ParticleData; color: string }) {
  const tx = Math.cos(p.angle) * p.distance;
  const ty = Math.sin(p.angle) * p.distance;

  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const opacity = useSharedValue(p.opacity);

  useEffect(() => {
    x.value = withDelay(p.delay, withTiming(tx, { duration: 500, easing: Easing.out(Easing.quad) }));
    y.value = withDelay(p.delay, withTiming(ty, { duration: 500, easing: Easing.out(Easing.quad) }));
    opacity.value = withDelay(p.delay + 100, withTiming(0, { duration: 400 }));
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: x.value }, { translateY: y.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: p.size,
          height: p.size,
          borderRadius: p.size / 2,
          backgroundColor: color,
          shadowColor: color,
          shadowOpacity: 0.9,
          shadowRadius: p.size * 2,
          shadowOffset: { width: 0, height: 0 },
        },
        style,
      ]}
    />
  );
}

export function ParticleBurst({ color = '#6366F1', count = 14, onDone }: Props) {
  const particles = useRef(createParticles(count)).current;

  useEffect(() => {
    if (!onDone) return;
    const t = setTimeout(onDone, 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <View
      pointerEvents="none"
      style={{ position: 'absolute', width: 0, height: 0, alignItems: 'center', justifyContent: 'center' }}
    >
      {particles.map((p, i) => (
        <SingleParticle key={i} p={p} color={color} />
      ))}
    </View>
  );
}
