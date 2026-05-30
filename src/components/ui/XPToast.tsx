import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import { COLORS, FONTS, SPACING, RADIUS, SPRING, DURATION } from '../../constants/theme';
import { ParticleBurst } from './ParticleBurst';

interface Props {
  xp: number;
  color?: string;
  onDone?: () => void;
}

export function XPToast({ xp, color = COLORS.accent, onDone }: Props) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(10);
  const scale = useSharedValue(0.7);

  useEffect(() => {
    opacity.value = withSequence(
      withTiming(1, { duration: DURATION.instant }),
      withDelay(700, withTiming(0, { duration: DURATION.fast }))
    );
    translateY.value = withSequence(
      withSpring(-20, SPRING.snappy),
      withDelay(700, withTiming(-50, { duration: DURATION.fast }))
    );
    scale.value = withSequence(
      withSpring(1.1, SPRING.snappy),
      withTiming(1, { duration: DURATION.instant })
    );
    if (onDone) {
      setTimeout(onDone, 1250);
    }
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  return (
    <>
      <ParticleBurst color={color} count={12} />
      <Animated.View style={[styles.toast, { backgroundColor: color + '20', borderColor: color + '60' }, style]}>
        <Text style={[styles.plus, { color }]}>+</Text>
        <Text style={[styles.text, { color }]}>{xp} XP</Text>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    zIndex: 100,
  },
  plus: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.bodyBold,
    lineHeight: 18,
  },
  text: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.display,
    letterSpacing: 0.5,
  },
});
