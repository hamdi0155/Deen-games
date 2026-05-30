import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';
import { haptic } from '../../services/haptics';

interface Props {
  title: string;
  emoji: string;
  visible: boolean;
  onDone: () => void;
}

const STAY_MS = 3000;
const SLIDE_IN_MS = 400;
const FADE_OUT_MS = 350;

export function AchievementToast({ title, emoji, visible, onDone }: Props) {
  const translateY = useSharedValue(120);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!visible) return;
    haptic.heavy();

    // Slide up from bottom
    translateY.value = withSpring(0, { damping: 14, stiffness: 160 });
    opacity.value = withTiming(1, { duration: SLIDE_IN_MS });

    // Fade out after stay duration
    const totalDelay = STAY_MS;
    opacity.value = withSequence(
      withTiming(1, { duration: SLIDE_IN_MS }),
      withDelay(totalDelay, withTiming(0, { duration: FADE_OUT_MS }))
    );

    const timer = setTimeout(() => {
      onDone();
    }, SLIDE_IN_MS + totalDelay + FADE_OUT_MS);

    return () => clearTimeout(timer);
  }, [visible]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, animStyle]}>
      <Text style={styles.emoji}>{emoji}</Text>
      <View style={styles.textBlock}>
        <Text style={styles.label}>Achievement Unlocked</Text>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 24,
    right: 24,
    zIndex: 9999,
    backgroundColor: 'rgba(201,168,76,0.08)',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.gold + '50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    gap: SPACING.md,
    shadowColor: COLORS.gold,
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
  },
  emoji: {
    fontSize: 36,
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.gold,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.families.display,
    color: COLORS.text,
    letterSpacing: 0.5,
  },
});
