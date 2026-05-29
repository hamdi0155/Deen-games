import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';

interface Props {
  xp: number;
  color?: string;
  onDone?: () => void;
}

export function XPToast({ xp, color = COLORS.accent, onDone }: Props) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    opacity.value = withSequence(
      withTiming(1, { duration: 200 }),
      withDelay(800, withTiming(0, { duration: 400 }))
    );
    translateY.value = withSequence(
      withTiming(-40, { duration: 1000 }),
      withTiming(-60, { duration: 400 })
    );
    if (onDone) {
      setTimeout(onDone, 1400);
    }
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.toast, { backgroundColor: color + '22', borderColor: color }, style]}>
      <Text style={[styles.text, { color }]}>+{xp} XP</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    zIndex: 100,
  },
  text: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
  },
});
