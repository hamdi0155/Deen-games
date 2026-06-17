/**
 * RewardBurst — the signature ADHD completion moment (spec §4).
 *
 * Call with xpDelta to trigger:
 *  0ms       haptic tap
 *  0–150ms   card lifts + checks off (handled by parent via onStart callback)
 *  150–400ms gold particles burst, XP counter ticks up
 *  400–600ms progress ring fills; level-up flash if leveledUp
 *  ~600ms    onDone fires
 *
 * Respects reduced motion: keeps XP count + ring fill, drops particles.
 */
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, AccessibilityInfo } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { COLORS, FONTS, SPRING } from '../../constants/theme';

// ─── Particle ────────────────────────────────────────────────────────────────

interface ParticleData {
  angle: number;
  distance: number;
  size: number;
  delay: number;
}

function buildParticles(count: number): ParticleData[] {
  return Array.from({ length: count }, (_, i) => ({
    angle: (i / count) * 2 * Math.PI + (Math.random() - 0.5) * 0.8,
    distance: 28 + Math.random() * 44,
    size: 3.5 + Math.random() * 3.5,
    delay: Math.floor(Math.random() * 60),
  }));
}

function GoldParticle({ p }: { p: ParticleData }) {
  const tx = Math.cos(p.angle) * p.distance;
  const ty = Math.sin(p.angle) * p.distance;
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const opacity = useSharedValue(0.9);

  useEffect(() => {
    x.value = withDelay(p.delay + 150, withTiming(tx, { duration: 380, easing: Easing.out(Easing.quad) }));
    y.value = withDelay(p.delay + 150, withTiming(ty, { duration: 380, easing: Easing.out(Easing.quad) }));
    opacity.value = withDelay(p.delay + 200, withTiming(0, { duration: 300 }));
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
          backgroundColor: COLORS.gold,
          shadowColor: COLORS.gold,
          shadowOpacity: 1,
          shadowRadius: p.size * 2,
          shadowOffset: { width: 0, height: 0 },
        },
        style,
      ]}
    />
  );
}

// ─── XP Tick counter ────────────────────────────────────────────────────────

function XPTick({ xpDelta, baseXP }: { xpDelta: number; baseXP: number }) {
  const displayed = useSharedValue(baseXP);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(8);

  useEffect(() => {
    opacity.value = withDelay(150, withTiming(1, { duration: 120 }));
    translateY.value = withDelay(150, withSpring(0, SPRING.pop));
    // Count up from baseXP to baseXP + xpDelta
    displayed.value = withDelay(160, withTiming(baseXP + xpDelta, { duration: 380, easing: Easing.out(Easing.quad) }));
    opacity.value = withDelay(700, withTiming(0, { duration: 200 }));
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  // Animated text needs a workaround: use JS-driven state for the number
  const [count, setCount] = React.useState(baseXP);
  useEffect(() => {
    const start = baseXP;
    const end = baseXP + xpDelta;
    const duration = 380;
    const startTime = Date.now() + 160;
    const tick = () => {
      const now = Date.now();
      if (now < startTime) { requestAnimationFrame(tick); return; }
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 2); // ease-out quad
      setCount(Math.round(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <Animated.View style={[styles.xpTickContainer, containerStyle]}>
      <Text style={styles.xpTickText}>{count.toLocaleString()} XP</Text>
    </Animated.View>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

interface Props {
  xpDelta: number;
  baseXP: number;
  leveledUp?: boolean;
  reducedMotion?: boolean;
  onDone?: () => void;
}

export function RewardBurst({ xpDelta, baseXP, leveledUp = false, reducedMotion = false, onDone }: Props) {
  const particles = useRef(buildParticles(16)).current;

  // Level-up gold flash ring
  const ringScale = useSharedValue(0.6);
  const ringOpacity = useSharedValue(0);

  useEffect(() => {
    if (leveledUp) {
      ringOpacity.value = withDelay(400, withTiming(1, { duration: 80 }));
      ringScale.value = withDelay(400, withSpring(1, SPRING.pop));
      ringOpacity.value = withDelay(520, withTiming(0, { duration: 200 }));
    }

    const timer = setTimeout(() => onDone?.(), 700);
    return () => clearTimeout(timer);
  }, []);

  const ringStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
    transform: [{ scale: ringScale.value }],
  }));

  return (
    <View pointerEvents="none" style={styles.root}>
      {/* Gold particles — skipped when reduced motion */}
      {!reducedMotion && particles.map((p, i) => (
        <GoldParticle key={i} p={p} />
      ))}

      {/* XP counter tick */}
      <XPTick xpDelta={xpDelta} baseXP={baseXP} />

      {/* Level-up ring flash */}
      {leveledUp && (
        <Animated.View style={[styles.levelRing, ringStyle]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    width: 0,
    height: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  xpTickContainer: {
    position: 'absolute',
    top: -40,
    backgroundColor: 'rgba(14,11,26,0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.gold + '60',
  },
  xpTickText: {
    fontFamily: FONTS.families.displayBold,
    fontSize: 13,
    color: COLORS.gold,
    letterSpacing: 0.3,
  },
  levelRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: COLORS.gold,
    shadowColor: COLORS.gold,
    shadowOpacity: 0.9,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
});
