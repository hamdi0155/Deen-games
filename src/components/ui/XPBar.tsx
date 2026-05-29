import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { COLORS } from '../../constants/theme';

interface Props {
  progress: number; // 0–1
  color?: string;
  height?: number;
  style?: ViewStyle;
}

export function XPBar({ progress, color = COLORS.accent, height = 5, style }: Props) {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(Math.max(0, Math.min(1, progress)), {
      duration: 700,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress]);

  const animStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));

  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }, style]}>
      <Animated.View
        style={[
          styles.fill,
          animStyle,
          {
            backgroundColor: color,
            borderRadius: height / 2,
            shadowColor: color,
            shadowOpacity: 0.8,
            shadowRadius: height * 2,
            shadowOffset: { width: 0, height: 0 },
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
  },
});
