import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { COLORS, FONTS, SPACING } from '../../constants/theme';

const MESSAGES = [
  'Consulting the ancient scrolls…',
  'Forging your quest chain…',
  'Mapping the path to mastery…',
  'Calibrating XP rewards…',
  'Your quest is almost ready…',
];

export function GeneratingAnimation() {
  const opacity = useSharedValue(1);
  const [msgIndex, setMsgIndex] = React.useState(0);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.3, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.icon, animStyle]}>⚔️</Animated.Text>
      <Text style={styles.title}>The Quest Master is working…</Text>
      <Text style={styles.message}>{MESSAGES[msgIndex]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: SPACING.md, padding: SPACING.xl },
  icon: { fontSize: 64 },
  title: { fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.bold, color: COLORS.text, textAlign: 'center' },
  message: { fontSize: FONTS.sizes.md, color: COLORS.textMuted, textAlign: 'center' },
});
