import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { SPRING } from '../../constants/theme';
import { haptic } from '../../services/haptics';

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  disabled?: boolean;
  activeOpacity?: number;
}

export function PressableScale({ children, onPress, onLongPress, style, disabled, activeOpacity = 1 }: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    haptic.light();
    scale.value = withSpring(0.96, SPRING.snappy);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1.0, SPRING.snappy);
  };

  const flatStyle = Array.isArray(style) ? StyleSheet.flatten(style) : style;

  return (
    <Animated.View style={[animatedStyle, flatStyle]}>
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={activeOpacity}
        style={{ flex: 1 }}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
}
