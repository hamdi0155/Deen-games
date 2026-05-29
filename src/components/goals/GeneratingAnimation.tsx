import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

const MESSAGES = [
  'Consulting the ancient scrolls…',
  'Forging your quest chain…',
  'Mapping the path to mastery…',
  'Calibrating XP rewards…',
  'Your quest is almost ready…',
];

export function GeneratingAnimation() {
  const [msgIndex, setMsgIndex] = React.useState(0);

  // Icon pulse
  const iconScale = useSharedValue(1);
  // Message fade
  const msgOpacity = useSharedValue(1);
  // Rings
  const ring1Rot = useSharedValue(0);
  const ring2Rot = useSharedValue(0);
  const ring3Rot = useSharedValue(0);

  useEffect(() => {
    // Icon pulse: scale 0.9 <-> 1.1
    iconScale.value = withRepeat(
      withTiming(1.1, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // Ring 1: slow clockwise
    ring1Rot.value = withRepeat(
      withTiming(360, { duration: 4000, easing: Easing.linear }),
      -1,
      false
    );
    // Ring 2: medium counter-clockwise
    ring2Rot.value = withRepeat(
      withTiming(-360, { duration: 2800, easing: Easing.linear }),
      -1,
      false
    );
    // Ring 3: fast clockwise
    ring3Rot.value = withRepeat(
      withTiming(360, { duration: 1800, easing: Easing.linear }),
      -1,
      false
    );

    // Message cycling with fade
    const interval = setInterval(() => {
      msgOpacity.value = withSequence(
        withTiming(0, { duration: 300, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: 300, easing: Easing.in(Easing.ease) })
      );
      setTimeout(() => {
        setMsgIndex((i) => (i + 1) % MESSAGES.length);
      }, 300);
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));
  const ring1Style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${ring1Rot.value}deg` }],
  }));
  const ring2Style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${ring2Rot.value}deg` }],
  }));
  const ring3Style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${ring3Rot.value}deg` }],
  }));
  const msgStyle = useAnimatedStyle(() => ({
    opacity: msgOpacity.value,
  }));

  return (
    <LinearGradient
      colors={['#12002A', '#0A0015', COLORS.bg]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      {/* Ambient orbs */}
      <View style={[styles.orb, styles.orb1]} />
      <View style={[styles.orb, styles.orb2]} />
      <View style={[styles.orb, styles.orb3]} />

      {/* Rings + icon center */}
      <View style={styles.ringsContainer}>
        {/* Ring 1: large, slow */}
        <Animated.View style={[styles.ring, styles.ring1, ring1Style]} />
        {/* Ring 2: medium */}
        <Animated.View style={[styles.ring, styles.ring2, ring2Style]} />
        {/* Ring 3: small, fast */}
        <Animated.View style={[styles.ring, styles.ring3, ring3Style]} />

        {/* Icon */}
        <Animated.Text style={[styles.icon, iconStyle]}>⚔️</Animated.Text>
      </View>

      {/* Text block */}
      <Text style={styles.title}>The Quest Master is working…</Text>
      <Animated.Text style={[styles.message, msgStyle]}>
        {MESSAGES[msgIndex]}
      </Animated.Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.lg,
    padding: SPACING.xl,
  },
  // Ambient orbs
  orb: {
    position: 'absolute',
    borderRadius: 9999,
  },
  orb1: {
    width: 280,
    height: 280,
    top: height * 0.05,
    left: -80,
    backgroundColor: 'rgba(99,102,241,0.12)',
  },
  orb2: {
    width: 200,
    height: 200,
    top: height * 0.15,
    right: -60,
    backgroundColor: 'rgba(124,58,237,0.10)',
  },
  orb3: {
    width: 160,
    height: 160,
    bottom: height * 0.2,
    left: width * 0.2,
    backgroundColor: 'rgba(99,102,241,0.08)',
  },
  // Rings wrapper
  ringsContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    borderRadius: 9999,
    borderStyle: 'solid',
  },
  // Large ring — 8 dashes feel at 60% opacity
  ring1: {
    width: 190,
    height: 190,
    borderWidth: 1.5,
    borderColor: 'rgba(99,102,241,0.35)',
    borderTopColor: 'rgba(99,102,241,0.60)',
    borderRightColor: 'rgba(99,102,241,0.20)',
  },
  // Medium ring
  ring2: {
    width: 140,
    height: 140,
    borderWidth: 2,
    borderColor: 'rgba(124,58,237,0.30)',
    borderTopColor: 'rgba(124,58,237,0.55)',
    borderLeftColor: 'rgba(124,58,237,0.15)',
  },
  // Small ring — most visible
  ring3: {
    width: 96,
    height: 96,
    borderWidth: 2.5,
    borderColor: 'rgba(99,102,241,0.25)',
    borderTopColor: 'rgba(99,102,241,0.65)',
    borderBottomColor: 'rgba(99,102,241,0.10)',
  },
  icon: {
    fontSize: 72,
  },
  title: {
    fontSize: FONTS.sizes.xl,
    fontFamily: FONTS.families.display,
    color: COLORS.text,
    textAlign: 'center',
    marginTop: SPACING.lg,
  },
  message: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
