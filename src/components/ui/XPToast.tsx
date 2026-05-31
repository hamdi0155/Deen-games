import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import { AscendIcon } from '../icons/AscendIcon';
import { COLORS, FONTS, SPACING, RADIUS, SPRING, DURATION } from '../../constants/theme';
import { ParticleBurst } from './ParticleBurst';
import { haptic } from '../../services/haptics';

interface Props {
  xp: number;
  color: string;
  onDone: () => void;
}

export function XPToast({ xp, color, onDone }: Props) {
  const tintColor = xp >= 100 ? COLORS.gold : color;

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(10);
  const scale = useSharedValue(0.7);

  useEffect(() => {
    haptic.success();
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
    setTimeout(onDone, 1250);
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  return (
    <>
      <ParticleBurst color={tintColor} count={12} />
      <Animated.View
        style={[
          styles.toast,
          {
            backgroundColor: tintColor + '1F',
            borderColor: tintColor + '40',
            shadowColor: tintColor,
            bottom: 120,
          },
          style,
        ]}
      >
        <AscendIcon name="flash" size={14} color={tintColor} />
        <Text style={[styles.xpNumber, { color: tintColor }]}>+{xp}</Text>
        <Text style={[styles.xpLabel, { color: tintColor }]}> pts</Text>
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
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    zIndex: 100,
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
  },
  xpNumber: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.display,
    letterSpacing: 0.5,
  },
  xpLabel: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.bodyBold,
    letterSpacing: 0.5,
  },
});
