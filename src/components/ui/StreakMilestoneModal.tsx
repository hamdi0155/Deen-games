import React, { useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
  withSequence,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { COLORS, FONTS, SPACING, RADIUS, SPRING, DURATION } from '../../constants/theme';
import { ParticleBurst } from './ParticleBurst';

interface Props {
  visible: boolean;
  streakDays: number;
  habitTitle: string;
  color: string;
  onDismiss: () => void;
}

export function isStreakMilestone(days: number): boolean {
  return [7, 14, 30, 100].includes(days);
}

function getMilestonePhrase(days: number): string {
  if (days === 7) return 'A week of fire. The compound effect begins.';
  if (days === 14) return 'Two weeks strong. Identity is forming.';
  if (days === 30) return 'One month. You are no longer trying — you are becoming.';
  if (days === 100) return 'One hundred days. You are the discipline.';
  return 'Keep the streak alive.';
}

function getSubMessage(days: number): string {
  if (days === 7) return 'One week of consistency.';
  if (days === 14) return 'Two weeks strong.';
  if (days === 21) return 'The habit is now part of you.';
  if (days >= 30) return 'You are the rare few.';
  return '';
}

export function StreakMilestoneModal({
  visible,
  streakDays,
  habitTitle,
  color,
  onDismiss,
}: Props) {
  const bgOpacity = useSharedValue(0);
  const ringScale = useSharedValue(0.2);
  const ringOpacity = useSharedValue(0);
  const flameRingScale = useSharedValue(1);
  const numberScale = useSharedValue(0.3);
  const numberOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const btnOpacity = useSharedValue(0);
  const emojiScale = useSharedValue(0.5);

  useEffect(() => {
    if (!visible) return;

    const ease = Easing.out(Easing.cubic);

    bgOpacity.value = withTiming(1, { duration: DURATION.standard });

    emojiScale.value = withDelay(200,
      withSpring(1, SPRING.gentle)
    );

    ringScale.value = withDelay(300,
      withSequence(
        withTiming(1, { duration: DURATION.scene, easing: ease }),
        withTiming(0.92, { duration: DURATION.fast }),
        withTiming(1, { duration: DURATION.fast }),
      )
    );
    ringOpacity.value = withDelay(300, withTiming(1, { duration: DURATION.standard }));

    // Pulsing flame ring: 1 → 1.1 → 1, loops forever
    flameRingScale.value = withDelay(
      700,
      withRepeat(
        withSequence(
          withTiming(1.1, { duration: DURATION.emphasis, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: DURATION.emphasis, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      )
    );

    numberScale.value = withDelay(500,
      withSpring(1, SPRING.gentle)
    );
    numberOpacity.value = withDelay(500, withTiming(1, { duration: DURATION.standard }));

    textOpacity.value = withDelay(800, withTiming(1, { duration: DURATION.standard }));
    btnOpacity.value = withDelay(1100, withTiming(1, { duration: DURATION.standard }));
  }, [visible]);

  const handleDismiss = () => {
    bgOpacity.value = withTiming(0, { duration: 250 });
    setTimeout(onDismiss, 260);
  };

  const bgStyle = useAnimatedStyle(() => ({ opacity: bgOpacity.value }));
  const ringStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
    transform: [{ scale: ringScale.value }],
  }));
  const flameRingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: flameRingScale.value }],
  }));
  const numberStyle = useAnimatedStyle(() => ({
    opacity: numberOpacity.value,
    transform: [{ scale: numberScale.value }],
  }));
  const textStyle = useAnimatedStyle(() => ({ opacity: textOpacity.value }));
  const btnStyle = useAnimatedStyle(() => ({ opacity: btnOpacity.value }));
  const emojiStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emojiScale.value }],
  }));

  if (!visible) return null;

  return (
    <Modal transparent animationType="none" visible={visible} statusBarTranslucent>
      <Animated.View style={[styles.overlay, bgStyle]}>
        <LinearGradient
          colors={['rgba(249,115,22,0.20)', 'rgba(249,115,22,0.05)', 'rgba(5,5,8,0.97)']}
          locations={[0, 0.4, 1]}
          style={StyleSheet.absoluteFill}
        />

        {/* Particle burst at center */}
        <View style={styles.particleAnchor}>
          {visible && <ParticleBurst color="#F97316" count={20} />}
        </View>

        <View style={styles.content}>
          {/* Tag */}
          <Animated.View style={textStyle}>
            <Text style={styles.tag}>✦ STREAK MILESTONE ✦</Text>
          </Animated.View>

          {/* Flame emoji in ring */}
          <View style={styles.ringWrap}>
            <Animated.View
              style={[
                styles.outerRing,
                { borderColor: color + '30' },
                ringStyle,
              ]}
            />
            <Animated.View
              style={[
                styles.innerRing,
                { borderColor: color + '60' },
                ringStyle,
              ]}
            />
            {/* Pulsing flame ring */}
            <Animated.View
              style={[
                styles.flameRing,
                { borderColor: '#F97316' + '80' },
                flameRingStyle,
              ]}
            />
            <LinearGradient
              colors={[color + '28', color + '0A']}
              style={styles.emojiContainer}
            >
              <Animated.Text style={[styles.emoji, emojiStyle]}>
                🔥
              </Animated.Text>
            </LinearGradient>
          </View>

          {/* Hero text: streak count + label */}
          <Animated.View style={[styles.numberWrap, numberStyle]}>
            <Text style={styles.heroNumber}>{streakDays}</Text>
            <Text style={styles.heroLabel}>Day Streak 🔥</Text>
          </Animated.View>

          {/* Habit title + phrase + sub-message */}
          <Animated.View style={[styles.textBlock, textStyle]}>
            <Text style={styles.habitTitle}>{habitTitle}</Text>
            <Text style={styles.phrase}>{getMilestonePhrase(streakDays)}</Text>
            {getSubMessage(streakDays) ? (
              <Text style={styles.subMessage}>{getSubMessage(streakDays)}</Text>
            ) : null}
          </Animated.View>

          {/* Dismiss */}
          <Animated.View style={btnStyle}>
            <TouchableOpacity onPress={handleDismiss} activeOpacity={0.8}>
              <LinearGradient
                colors={['#F97316', '#EA580C']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.btn}
              >
                <Text style={styles.btnText}>Keep the Fire Burning</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5,5,8,0.96)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  particleAnchor: {
    position: 'absolute',
    top: '42%',
    left: '50%',
    width: 0,
    height: 0,
  },
  content: {
    alignItems: 'center',
    gap: SPACING.xl,
    paddingHorizontal: SPACING.xxl,
  },
  tag: {
    fontSize: 10,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    letterSpacing: 4,
  },
  ringWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 180,
    height: 180,
  },
  outerRing: {
    position: 'absolute',
    width: 175,
    height: 175,
    borderRadius: 87.5,
    borderWidth: 1,
  },
  innerRing: {
    position: 'absolute',
    width: 148,
    height: 148,
    borderRadius: 74,
    borderWidth: 1.5,
  },
  flameRing: {
    position: 'absolute',
    width: 162,
    height: 162,
    borderRadius: 81,
    borderWidth: 2,
    shadowColor: '#F97316',
    shadowOpacity: 0.5,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 0 },
  },
  emojiContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 52 },
  numberWrap: { alignItems: 'center', gap: 4 },
  heroNumber: {
    fontSize: 48,
    fontFamily: FONTS.families.displayBold,
    color: '#F97316',
    letterSpacing: 1,
    textAlign: 'center',
    shadowColor: '#F97316',
    shadowOpacity: 0.5,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 0 },
  },
  heroLabel: {
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.families.display,
    color: '#F97316',
    letterSpacing: 1,
    textAlign: 'center',
  },
  textBlock: { alignItems: 'center', gap: SPACING.sm },
  habitTitle: {
    fontSize: FONTS.sizes.xl,
    fontFamily: FONTS.families.display,
    color: COLORS.text,
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  phrase: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  subMessage: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.displayLight,
    color: '#F97316',
    textAlign: 'center',
    letterSpacing: 1.5,
    marginTop: SPACING.xs,
  },
  btn: {
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xxl,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.families.display,
    letterSpacing: 1,
  },
});
