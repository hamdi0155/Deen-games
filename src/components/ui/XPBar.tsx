import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
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

  const isFull = progress >= 1;
  const borderRad = height / 2;

  return (
    <View style={[styles.track, { height, borderRadius: borderRad }, style]}>
      <Animated.View
        style={[
          styles.fill,
          animStyle,
          {
            borderRadius: borderRad,
            shadowColor: color,
            shadowOpacity: 0.8,
            shadowRadius: height * 2,
            shadowOffset: { width: 0, height: 0 },
            overflow: 'hidden',
          },
        ]}
      >
        {isFull ? (
          <LinearGradient
            colors={[color, color + 'CC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: color }]} />
        )}
        {/* Shimmer leading-edge highlight */}
        <View
          style={[
            styles.shimmer,
            { borderRadius: borderRad },
          ]}
        />
      </Animated.View>
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
  shimmer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '30%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
});
